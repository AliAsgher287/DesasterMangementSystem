"use client";

import { useState, useEffect, useCallback } from "react";
import { getAuthToken, getAuthItem, clearAuth } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import {
    FiGrid, FiPackage, FiInbox, FiUsers, FiRefreshCw,
    FiPlus, FiEdit2, FiCheck, FiX, FiLoader, FiLogOut,
    FiAlertCircle, FiMapPin, FiClock
} from "react-icons/fi";
import { toast } from "react-hot-toast";

interface Resource {
    _id: string;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    status: string;
    organizationName?: string; // Added to distinguish donor resources
}

interface IncomingRequest {
    _id: string;
    requester: { name: string; organizationName: string };
    resource: { name: string } | null;
    quantity: number;
    status: string;
    createdAt: string;
}

interface OutgoingRequest {
    _id: string;
    resource: { name: string } | null;
    ownerOrganization: string;
    quantity: number;
    status: string;
    createdAt: string;
}

interface Responder {
    _id: string;
    name: string;
    email: string;
}

interface Task {
    _id: string;
    title: string;
    description: string;
    location: string;
    priority: string;
    status: string;
    assignedResponders: { name: string; email: string; _id: string }[];
    createdAt: string;
}

const API = "http://localhost:5000/api";

export default function OrganizationDashboard() {
    const [activeNav, setActiveNav] = useState("dashboard");
    const [requestTab, setRequestTab] = useState<"incoming" | "outgoing">("incoming");
    const [resources, setResources] = useState<Resource[]>([]);
    const [incomingRequests, setIncomingRequests] = useState<IncomingRequest[]>([]);
    const [myRequests, setMyRequests] = useState<OutgoingRequest[]>([]);
    const [responders, setResponders] = useState<Responder[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [user, setUser] = useState<{ name: string; organizationName: string; status: string } | null>(null);

    // Add / Edit Resource modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);
    const [newResource, setNewResource] = useState({ name: "", category: "Food", quantity: 0, unit: "", location: "" });
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [selectedResponderIds, setSelectedResponderIds] = useState<string[]>([]);
    const [selectedResources, setSelectedResources] = useState<{ resourceId: string; name: string; quantity: number; unit: string }[]>([]);
    const [isAssigning, setIsAssigning] = useState(false);

    useEffect(() => {
        const name = getAuthItem("name") || "Admin";
        const organizationName = getAuthItem("organizationName") || "Organization";
        const status = getAuthItem("status") || "verified";
        setUser({ name, organizationName, status });
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const token = getAuthToken();
            const h = { "Authorization": `Bearer ${token}` };

            const [resRes, inReqRes, myReqRes, respRes, taskRes] = await Promise.all([
                fetch(`${API}/resources`, { headers: h }),
                fetch(`${API}/requests/incoming`, { headers: h }),
                fetch(`${API}/requests/my`, { headers: h }),
                fetch(`${API}/tasks/responders`, { headers: h }),
                fetch(`${API}/tasks`, { headers: h })
            ]);

            const [resData, inReqData, myReqData, respData, taskData] = await Promise.all([
                resRes.json(), inReqRes.json(), myReqRes.json(), respRes.json(), taskRes.json()
            ]);

            if (resData.success) setResources(resData.data);
            if (inReqData.success) setIncomingRequests(inReqData.data);
            if (myReqData.success) setMyRequests(myReqData.data);
            if (respData.success) setResponders(respData.data);
            if (taskData.success) setTasks(taskData.data);
        } catch {
            setError("Failed to load data. Please ensure the backend is running.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleRequestAction = async (id: string, status: "Approved" | "Rejected") => {
        const token = getAuthToken();
        const res = await fetch(`${API}/requests/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ status })
        });
        const data = await res.json();
        if (data.success) {
            fetchData();
            toast.success(`Request ${status}`);
        } else toast.error(data.error);
    };

    const handleAddResource = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = getAuthToken();
        const res = await fetch(`${API}/resources`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify(newResource)
        });
        const data = await res.json();
        if (data.success) {
            setShowAddModal(false);
            setNewResource({ name: "", category: "Food", quantity: 0, unit: "", location: "" });
            fetchData();
            toast.success("Resource added successfully!");
        } else toast.error(data.error);
    };

    const handleUpdateResource = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingResource) return;
        const token = getAuthToken();
        const res = await fetch(`${API}/resources/${editingResource._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify(editingResource)
        });
        const data = await res.json();
        if (data.success) {
            setEditingResource(null);
            fetchData();
            toast.success("Resource updated successfully!");
        } else toast.error(data.error);
    };

    const handleDeleteResource = async (id: string) => {
        if (!confirm("Delete this resource?")) return;
        const token = getAuthToken();
        const res = await fetch(`${API}/resources/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
        const data = await res.json();
        if (data.success) {
            fetchData();
            toast.success("Resource deleted");
        } else toast.error(data.error);
    };

    const handleLogout = () => { clearAuth(); window.location.href = "/landingPage"; };

    const handleAssignResponders = async () => {
        if (!selectedTask) return;
        setIsAssigning(true);
        try {
            const token = getAuthToken();
            const res = await fetch(`${API}/tasks/${selectedTask._id}/assign`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({
                    responderIds: selectedResponderIds,
                    assignedResources: selectedResources
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Responders assigned!");
                setIsAssignModalOpen(false);
                fetchData();
            } else toast.error(data.error);
        } catch (err) {
            toast.error("Failed to assign responders");
        } finally {
            setIsAssigning(false);
        }
    };

    const getTimeAgo = (d: string) => {
        const diff = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
        if (diff < 1) return "Just now";
        if (diff < 60) return `${diff}m ago`;
        if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
        return `${Math.floor(diff / 1440)}d ago`;
    };

    const getStockColor = (s: string) => s === "Available" ? "bg-green-100 text-green-700" : s === "Low Stock" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700";
    const getStatusColor = (s: string) => s === "Approved" || s === "Completed" ? "bg-green-100 text-green-700" : s === "Rejected" ? "bg-red-100 text-red-700" : s === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700";
    const getPriorityColor = (p: string) => p === "Critical" || p === "High" ? "bg-red-100 text-red-700" : p === "Medium" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700";

    const myResources = resources.filter(r => r.organizationName === user?.organizationName);
    const donorResources = resources.filter(r => r.organizationName === "Individual Donor");

    const pendingIn = incomingRequests.filter(r => r.status === "Pending").length;
    const activeTasks = tasks.filter(t => t.status !== "Completed").length;

    const navItems = [
        { id: "dashboard", label: "Overview", icon: FiGrid },
        { id: "resources", label: "Resources", icon: FiPackage },
        { id: "requests", label: "Requests", icon: FiInbox, badge: pendingIn },
        { id: "responders", label: "Responders", icon: FiUsers },
        { id: "tasks", label: "My Tasks", icon: FiCheck, badge: activeTasks },
        { id: "history", label: "History", icon: FiClock },
    ];

    const CATEGORIES = ["Food", "Water", "Medical", "Shelter", "Tools", "SOPs", "Other"];

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Edit Resource Modal */}
            {editingResource && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Edit Resource</h3>
                            <button onClick={() => setEditingResource(null)} className="text-slate-400 hover:text-slate-600"><FiX /></button>
                        </div>
                        <form onSubmit={handleUpdateResource} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
                                <input type="text" required value={editingResource.name}
                                    onChange={e => setEditingResource({ ...editingResource, name: e.target.value })}
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                                    <select value={editingResource.category} onChange={e => setEditingResource({ ...editingResource, category: e.target.value })}
                                        className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Quantity</label>
                                    <input type="number" required value={editingResource.quantity}
                                        onChange={e => setEditingResource({ ...editingResource, quantity: parseInt(e.target.value) || 0 })}
                                        className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                                <select value={editingResource.status} onChange={e => setEditingResource({ ...editingResource, status: e.target.value })}
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>Available</option><option>Low Stock</option><option>Out of Stock</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                                <FiCheck /> Update Resource
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Resource Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Add New Resource</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><FiX /></button>
                        </div>
                        <form onSubmit={handleAddResource} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Resource Name</label>
                                <input type="text" required value={newResource.name}
                                    onChange={e => setNewResource({ ...newResource, name: e.target.value })}
                                    placeholder="e.g. Emergency Food Packs"
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                                    <select value={newResource.category} onChange={e => setNewResource({ ...newResource, category: e.target.value })}
                                        className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Quantity</label>
                                    <input type="number" required value={newResource.quantity || ""}
                                        onChange={e => setNewResource({ ...newResource, quantity: parseInt(e.target.value) || 0 })}
                                        className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Unit</label>
                                    <input type="text" value={newResource.unit} onChange={e => setNewResource({ ...newResource, unit: e.target.value })}
                                        placeholder="kg, liters, boxes..."
                                        className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Location</label>
                                    <input type="text" value={newResource.location} onChange={e => setNewResource({ ...newResource, location: e.target.value })}
                                        placeholder="Warehouse A..."
                                        className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                                <FiPlus /> Add Resource
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-slate-200">
                    <Link href="/landingPage" className="flex items-center gap-2">
                        <Image src="/images/logo.png" alt="Logo" width={100} height={35} className="h-7 w-auto" priority unoptimized />
                    </Link>
                    {user && (
                        <div className="mt-3">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Organization</p>
                            <p className="text-sm font-bold text-slate-900 mt-0.5">{user.organizationName}</p>
                        </div>
                    )}
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(item => (
                        <button key={item.id} onClick={() => setActiveNav(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeNav === item.id ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"}`}>
                            <item.icon className="text-lg flex-shrink-0" />
                            <span className="font-medium flex-1 text-left">{item.label}</span>
                            {item.badge != null && item.badge > 0 && (
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
                            )}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-200">
                    <div className="px-4 py-3 rounded-lg bg-slate-50 mb-2">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Logged in as</p>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">{user?.name || "Admin"}</p>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <FiLogOut /><span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            {activeNav === "dashboard" && "Dashboard Overview"}
                            {activeNav === "resources" && "Resource Inventory"}
                            {activeNav === "requests" && "Resource Requests"}
                            {activeNav === "responders" && "My Responders"}
                            {activeNav === "tasks" && "Active Tasks"}
                            {activeNav === "history" && "Task History"}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">{user?.organizationName} — Organization Admin</p>
                    </div>
                    <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium">
                        <FiRefreshCw className={isLoading ? "animate-spin" : ""} /> Refresh
                    </button>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                        <FiAlertCircle /> {error}
                    </div>
                )}

                {/* OVERVIEW */}
                {activeNav === "dashboard" && (
                    <>
                        {/* Top Stats / Banner */}
                        {user?.status === "pending" && (
                            <div className="mb-8 p-6 bg-amber-50 border border-amber-100 rounded-3xl flex items-center gap-6 animate-pulse-subtle">
                                <div className="w-14 h-14 bg-amber-400/20 rounded-2xl flex items-center justify-center text-amber-600">
                                    <FiAlertCircle className="text-2xl" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-amber-900 font-bold text-lg">Verification Protocol Initiated</h3>
                                    <p className="text-amber-700/80 text-sm font-medium">Your organization is currently being reviewed by the Super Admin. Resource contributions and coordination tools will be activated upon official verification.</p>
                                </div>
                                <div className="px-5 py-2.1 bg-amber-100 rounded-full text-[10px] font-black text-amber-600 uppercase tracking-widest">
                                    Status: Pending Verification
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[
                                { label: "My Resources", value: myResources.length, color: "text-blue-600", bg: "bg-blue-50", nav: "resources" },
                                { label: "Pending Requests", value: pendingIn, color: "text-orange-600", bg: "bg-orange-50", nav: "requests" },
                                { label: "Active Tasks", value: activeTasks, color: "text-green-600", bg: "bg-green-50", nav: "tasks" },
                            ].map(stat => (
                                <button key={stat.label} onClick={() => setActiveNav(stat.nav)}
                                    className={`${stat.bg} rounded-2xl p-6 text-left border border-white hover:shadow-md transition-all`}>
                                    <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                                    <p className="text-xs text-slate-500 font-medium mt-2">{stat.label}</p>
                                </button>
                            ))}
                        </div>

                        {/* Recent Resources */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-slate-900">Recent Resources</h2>
                                <button onClick={() => setActiveNav("resources")} className="text-sm text-blue-600 font-medium hover:underline">View all</button>
                            </div>
                            {resources.length === 0
                                ? <p className="text-sm text-slate-400 italic">No resources added yet.</p>
                                : resources.slice(0, 5).map(r => (
                                    <div key={r._id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{r.name}</p>
                                            <p className="text-xs text-slate-400">{r.category} · {r.quantity} {r.unit}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${getStockColor(r.status)}`}>{r.status}</span>
                                    </div>
                                ))}
                        </div>

                        {/* Pending Incoming Requests */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">Pending Incoming Requests</h2>
                            {incomingRequests.filter(r => r.status === "Pending").length === 0
                                ? <p className="text-sm text-slate-400 italic">No pending requests.</p>
                                : incomingRequests.filter(r => r.status === "Pending").slice(0, 5).map(req => (
                                    <div key={req._id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{req.requester?.organizationName} requested {req.quantity}x {req.resource?.name || "resource"}</p>
                                            <p className="text-xs text-slate-400">By {req.requester?.name} · {getTimeAgo(req.createdAt)}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleRequestAction(req._id, "Approved")}
                                                className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg font-bold hover:bg-green-100"><FiCheck /></button>
                                            <button onClick={() => handleRequestAction(req._id, "Rejected")}
                                                className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-bold hover:bg-red-100"><FiX /></button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </>
                )}

                {/* RESOURCES */}
                {activeNav === "resources" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Organization Inventory</h2>
                            <button
                                onClick={() => {
                                    if (user?.status !== "verified") {
                                        toast.error("Resource creation restricted until verification is complete.");
                                        return;
                                    }
                                    setNewResource({ name: "", category: "Food", quantity: 0, unit: "", location: "" });
                                    setEditingResource(null);
                                    setShowAddModal(true);
                                }}
                                className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${user?.status !== "verified" ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-blue-600 shadow-xl shadow-slate-200'}`}
                            >
                                <FiPlus className="text-lg" />
                                Add Resource
                            </button>
                        </div>

                        {myResources.length === 0
                            ? (
                                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                                    <FiPackage className="text-4xl text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-400">No organization resources added yet.</p>
                                </div>
                            )
                            : (
                                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr>
                                                {["Resource", "Category", "Quantity", "Status", ""].map(h => (
                                                    <th key={h} className="text-left text-xs font-black text-slate-400 uppercase tracking-widest px-5 py-3">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {myResources.map(r => (
                                                <tr key={r._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-5 py-3 text-sm font-bold text-slate-900">{r.name}</td>
                                                    <td className="px-5 py-3 text-sm text-slate-500">{r.category}</td>
                                                    <td className="px-5 py-3 text-sm font-bold">{r.quantity} {r.unit}</td>
                                                    <td className="px-5 py-3">
                                                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${getStockColor(r.status)}`}>{r.status}</span>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <div className="flex gap-2 justify-end">
                                                            <button onClick={() => setEditingResource(r)}
                                                                className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">
                                                                <FiEdit2 />
                                                            </button>
                                                            <button onClick={() => handleDeleteResource(r._id)}
                                                                className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors font-medium">
                                                                <FiX />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                        {donorResources.length > 0 && (
                            <div className="mt-8">
                                <div className="mb-4">
                                    <h2 className="text-xl font-bold text-slate-900">Available Community Contributions</h2>
                                    <p className="text-xs text-slate-500 mt-1">Resources shared by Individual Donors that you can claim or coordinate</p>
                                </div>
                                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr>
                                                {["Resource", "Category", "Quantity", "Status", ""].map(h => (
                                                    <th key={h} className="text-left text-xs font-black text-slate-400 uppercase tracking-widest px-5 py-3">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {donorResources.map(r => (
                                                <tr key={r._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-5 py-3 text-sm font-bold text-slate-900">{r.name}</td>
                                                    <td className="px-5 py-3 text-sm text-slate-500">{r.category}</td>
                                                    <td className="px-5 py-3 text-sm font-bold">{r.quantity} {r.unit}</td>
                                                    <td className="px-5 py-3">
                                                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${getStockColor(r.status)}`}>{r.status}</span>
                                                    </td>
                                                    <td className="px-5 py-3 text-right">
                                                        <button onClick={() => handleDeleteResource(r._id)}
                                                            className="text-xs bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors font-bold flex items-center gap-2 ml-auto">
                                                            <FiX /> Remove from List
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* REQUESTS */}
                {activeNav === "requests" && (
                    <div className="space-y-4">
                        <div className="flex gap-2 bg-white rounded-xl border border-slate-100 p-1 w-fit">
                            <button onClick={() => setRequestTab("incoming")}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${requestTab === "incoming" ? "bg-blue-600 text-white shadow" : "text-slate-500 hover:text-slate-700"}`}>
                                Incoming {pendingIn > 0 && <span className="ml-1 bg-white text-blue-600 text-xs px-1.5 rounded-full">{pendingIn}</span>}
                            </button>
                            <button onClick={() => setRequestTab("outgoing")}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${requestTab === "outgoing" ? "bg-blue-600 text-white shadow" : "text-slate-500 hover:text-slate-700"}`}>
                                Outgoing
                            </button>
                        </div>

                        {requestTab === "incoming" && (
                            <div className="space-y-3">
                                {incomingRequests.length === 0
                                    ? <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center"><p className="text-slate-400">No incoming requests.</p></div>
                                    : incomingRequests.map(req => (
                                        <div key={req._id} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{req.quantity}x {req.resource?.name || "resource"} requested by {req.requester?.organizationName}</p>
                                                <p className="text-xs text-slate-400 mt-1">By {req.requester?.name} · {getTimeAgo(req.createdAt)}</p>
                                            </div>
                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                <span className={`text-xs px-2 py-1 rounded-full font-bold ${getStatusColor(req.status)}`}>{req.status}</span>
                                                {req.status === "Pending" && (
                                                    <>
                                                        <button onClick={() => handleRequestAction(req._id, "Approved")}
                                                            className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg hover:bg-green-100 flex items-center gap-1">
                                                            <FiCheck /> Approve
                                                        </button>
                                                        <button onClick={() => handleRequestAction(req._id, "Rejected")}
                                                            className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 flex items-center gap-1">
                                                            <FiX /> Reject
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}

                        {requestTab === "outgoing" && (
                            <div className="space-y-3">
                                {myRequests.length === 0
                                    ? <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center"><p className="text-slate-400">No outgoing requests.</p></div>
                                    : myRequests.map(req => (
                                        <div key={req._id} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{req.quantity}x {req.resource?.name || "resource"} from {req.ownerOrganization}</p>
                                                <p className="text-xs text-slate-400 mt-1">{getTimeAgo(req.createdAt)}</p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${getStatusColor(req.status)}`}>{req.status}</span>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                )}

                {/* RESPONDERS */}
                {activeNav === "responders" && (
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <p className="text-sm text-slate-500 mb-4">
                                These are all responders registered under <strong>{user?.organizationName}</strong>.
                                Responders register themselves — they can be assigned to tasks by the Super Admin.
                            </p>
                            {responders.length === 0
                                ? (
                                    <div className="py-8 text-center">
                                        <FiUsers className="text-4xl text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-400">No responders registered yet.</p>
                                    </div>
                                )
                                : (
                                    <div className="space-y-3">
                                        {responders.map(r => (
                                            <div key={r._id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black text-sm">
                                                    {r.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{r.name}</p>
                                                    <p className="text-xs text-slate-400">{r.email}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                        </div>
                    </div>
                )}

                {/* TASKS */}
                {activeNav === "tasks" && (
                    <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
                            <strong>Note:</strong> Active tasks assigned to your organization by the Super Admin. Complete them to move to history.
                        </div>
                        {tasks.filter(t => t.status !== "Completed").length === 0
                            ? (
                                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                                    <FiCheck className="text-4xl text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-400">No active tasks assigned yet.</p>
                                </div>
                            )
                            : tasks.filter(t => t.status !== "Completed").map(task => (
                                <div key={task._id} className="bg-white rounded-2xl border border-slate-100 p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-xs px-2 py-1 rounded-full font-bold ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                                                <span className={`text-xs px-2 py-1 rounded-full font-bold ${getStatusColor(task.status)}`}>{task.status}</span>
                                            </div>
                                            <p className="font-bold text-slate-900 text-sm">{task.title}</p>
                                            <p className="text-xs text-slate-500 mt-1">{task.description}</p>
                                            {task.location && (
                                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><FiMapPin className="text-[10px]" />{task.location}</p>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-400 flex-shrink-0 flex items-center gap-1">
                                            <FiClock className="text-[10px]" />{getTimeAgo(task.createdAt)}
                                        </p>
                                    </div>
                                    {task.assignedResponders?.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {task.assignedResponders.map(r => (
                                                <span key={r._id} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">{r.name}</span>
                                            ))}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => {
                                            setSelectedTask(task);
                                            setSelectedResponderIds(task.assignedResponders.map(r => r._id));
                                            setSelectedResources([]);
                                            setIsAssignModalOpen(true);
                                        }}
                                        className="mt-4 w-full py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all flex items-center justify-center gap-2"
                                    >
                                        <FiUsers className="text-sm" />
                                        {task.assignedResponders?.length > 0 ? "Update Assignment" : "Assign Team"}
                                    </button>
                                </div>
                            ))}
                    </div>
                )}

                {/* HISTORY */}
                {activeNav === "history" && (
                    <div className="space-y-4">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600">
                            <strong>Archive:</strong> History of all tasks completed by your organization.
                        </div>
                        {tasks.filter(t => t.status === "Completed").length === 0
                            ? (
                                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                                    <FiClock className="text-4xl text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-400">No completed tasks in history yet.</p>
                                </div>
                            )
                            : tasks.filter(t => t.status === "Completed").map(task => (
                                <div key={task._id} className="bg-white rounded-2xl border border-slate-100 p-5 opacity-80 hover:opacity-100 transition-opacity">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Completed</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                                            </div>
                                            <p className="font-bold text-slate-900 text-sm">{task.title}</p>
                                            <p className="text-xs text-slate-500 mt-1">{task.description}</p>
                                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><FiMapPin className="text-[10px]" />{task.location}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Finished</p>
                                            <p className="text-xs text-slate-900 font-black mt-1">{getTimeAgo(task.createdAt)}</p>
                                        </div>
                                    </div>
                                    {task.assignedResponders?.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {task.assignedResponders.map(r => (
                                                <span key={r._id} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-1 rounded-full font-bold border border-slate-100">{r.name}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                )}
            </main>

            {/* Assign Responder Modal */}
            {isAssignModalOpen && selectedTask && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
                        <div className="p-8 bg-slate-950 text-white flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black tracking-tighter">Assign Team</h3>
                                <p className="text-slate-400 text-[10px] mt-1 font-bold uppercase tracking-widest">Select Team Responders</p>
                            </div>
                            <button onClick={() => setIsAssignModalOpen(false)} className="bg-white/10 p-2 rounded-xl hover:bg-white/20 transition-all">
                                <FiX className="text-xl" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Responders</h4>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                    {responders.length === 0 ? (
                                        <p className="text-center text-slate-400 text-sm py-4">No responders registered.</p>
                                    ) : responders.map(r => (
                                        <label key={r._id} className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${selectedResponderIds.includes(r._id) ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800 text-xs">{r.name}</span>
                                                <span className="text-[10px] text-slate-500 font-medium">{r.email}</span>
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                checked={selectedResponderIds.includes(r._id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) setSelectedResponderIds([...selectedResponderIds, r._id]);
                                                    else setSelectedResponderIds(selectedResponderIds.filter(id => id !== r._id));
                                                }}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Assign Resources</h4>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                    {myResources.filter(r => r.quantity > 0).length === 0 ? (
                                        <p className="text-center text-slate-400 text-sm py-4">No available resources.</p>
                                    ) : myResources.filter(r => r.quantity > 0).map(r => {
                                        const selected = selectedResources.find(sr => sr.resourceId === r._id);
                                        return (
                                            <div key={r._id} className={`p-3 rounded-xl border transition-all ${selected ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-800 text-xs">{r.name}</span>
                                                        <span className="text-[10px] text-slate-500 font-medium">Available: {r.quantity} {r.unit}</span>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                        checked={!!selected}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedResources([...selectedResources, { resourceId: r._id, name: r.name, quantity: 0, unit: r.unit }]);
                                                            } else {
                                                                setSelectedResources(selectedResources.filter(sr => sr.resourceId !== r._id));
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                {selected && (
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max={r.quantity}
                                                            value={selected.quantity || ""}
                                                            placeholder="Qty"
                                                            onChange={(e) => {
                                                                const val = Math.min(r.quantity, Math.max(0, parseInt(e.target.value) || 0));
                                                                setSelectedResources(selectedResources.map(sr => sr.resourceId === r._id ? { ...sr, quantity: val } : sr));
                                                            }}
                                                            className="w-20 border border-slate-200 rounded-lg px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                        <span className="text-[10px] text-slate-500 font-medium">{r.unit}</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                onClick={handleAssignResponders}
                                disabled={isAssigning || selectedResponderIds.length === 0}
                                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isAssigning ? <FiLoader className="animate-spin" /> : <FiCheck />}
                                Confirm Assignment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
