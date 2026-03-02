"use client";

import { useState, useEffect, useCallback } from "react";
import { getAuthToken, clearAuth } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import {
    FiGrid, FiUsers, FiFileText, FiPackage, FiAlertCircle,
    FiRefreshCw, FiPlus, FiCheck, FiX, FiLoader, FiLogOut,
    FiShield, FiMapPin, FiClock, FiChevronDown
} from "react-icons/fi";
import { toast } from "react-hot-toast";

interface CitizenHelpRequest {
    _id: string;
    description: string;
    severity: number;
    contactNumber: string;
    location?: string;
    status: string;
    createdAt: string;
    helpTypes: string[];
    isInjured: boolean;
    isImmediateDanger: boolean;
    peopleAffected: number;
}

interface FieldReport {
    _id: string;
    responder: { name: string; organizationName: string };
    location: string;
    priority: string;
    description: string;
    resourcesNeeded?: string;
    status: string;
    createdAt: string;
}

interface Resource {
    _id: string;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    status: string;
    organizationName: string;
}

interface Organization {
    _id: string;
    name: string;
    organizationName: string;
    email: string;
    location?: string;
    status?: string;
}

interface Responder {
    _id: string;
    name: string;
    email: string;
    organizationName?: string;
}

interface Task {
    _id: string;
    title: string;
    description: string;
    location: string;
    priority: string;
    status: string;
    assignedResponders: { name: string; email: string; _id: string }[];
    organization: { organizationName?: string } | string;
    createdAt: string;
}

const API = "http://localhost:5000/api";

export default function SuperAdminDashboard() {
    const [activeNav, setActiveNav] = useState("dashboard");
    const [citizenRequests, setCitizenRequests] = useState<CitizenHelpRequest[]>([]);
    const [fieldReports, setFieldReports] = useState<FieldReport[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [responders, setResponders] = useState<Responder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Task dispatch modal state
    const [isDispatchOpen, setIsDispatchOpen] = useState(false);
    const [dispatchData, setDispatchData] = useState({
        title: "", description: "", location: "", priority: "Medium",
        sourceRef: "", sourceType: "Manual" as "CitizenHelp" | "FieldReport" | "Manual",
        targetOrganizationId: ""
    });
    const [selectedResponders, setSelectedResponders] = useState<string[]>([]);
    const [dispatchLocations, setDispatchLocations] = useState<string[]>([""]);

    const token = getAuthToken();

    const headers = { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };

    const handleVerify = async (id: string, status: string) => {
        try {
            const res = await fetch(`${API}/super-admin/verify/${id}`, {
                method: "PUT",
                headers,
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            // Re-fetch to update UI
            fetchData();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const [citizenRes, fieldRes, resourceRes, orgsRes, tasksRes] = await Promise.all([
                fetch(`${API}/citizen-help`, { headers }),
                fetch(`${API}/field-reports`, { headers }),
                fetch(`${API}/resources`, { headers }),
                fetch(`${API}/super-admin/organizations`, { headers }),
                fetch(`${API}/tasks`, { headers })
            ]);

            const [citizenData, fieldData, resourceData, orgsData, tasksData] = await Promise.all([
                citizenRes.json(), fieldRes.json(), resourceRes.json(), orgsRes.json(), tasksRes.json()
            ]);

            if (citizenData.success) setCitizenRequests(citizenData.data);
            if (fieldData.success) setFieldReports(fieldData.data);
            if (resourceData.success) setResources(resourceData.data);
            if (orgsData.success) setOrganizations(orgsData.data);
            if (tasksData.success) setTasks(tasksData.data);
        } catch {
            setError("Failed to load data. Check backend connection.");
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, [fetchData]);

    // Load responders when a target org is selected
    const loadResponders = async (orgId: string) => {
        if (!orgId) { setResponders([]); return; }
        try {
            const res = await fetch(`${API}/tasks/responders?orgId=${orgId}`, { headers });
            const data = await res.json();
            if (data.success) setResponders(data.data);
        } catch { setResponders([]); }
    };

    const handleUpdateCitizenStatus = async (id: string, status: string) => {
        try {
            await fetch(`${API}/citizen-help/${id}`, {
                method: "PUT", headers,
                body: JSON.stringify({ status })
            });
            fetchData();
        } catch { toast.error("Error updating status"); }
    };

    const openDispatchFromCitizen = (req: CitizenHelpRequest) => {
        setDispatchData({
            title: `Citizen Assistance: ${req.contactNumber}`,
            description: req.description,
            location: req.location || "Citizen Reported Location",
            priority: "Medium",
            sourceRef: req._id,
            sourceType: "CitizenHelp",
            targetOrganizationId: ""
        });
        setSelectedResponders([]);
        setResponders([]);
        setDispatchLocations([req.location || ""]);
        setIsDispatchOpen(true);
    };

    const openDispatchFromFieldReport = (report: FieldReport) => {
        setDispatchData({
            title: `Field Action: ${report.location}`,
            description: report.description,
            location: report.location,
            priority: report.priority,
            sourceRef: report._id,
            sourceType: "FieldReport",
            targetOrganizationId: ""
        });
        setSelectedResponders([]);
        setResponders([]);
        setDispatchLocations([report.location || ""]);
        setIsDispatchOpen(true);
    };

    const handleDispatchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dispatchData.targetOrganizationId) {
            toast.error("Please select a target organization");
            return;
        }

        const validLocations = dispatchLocations.filter(l => l.trim() !== "");
        if (validLocations.length === 0) {
            toast.error("Please provide at least one location");
            return;
        }

        try {
            const res = await fetch(`${API}/tasks/bulk`, {
                method: "POST", headers,
                body: JSON.stringify({
                    ...dispatchData,
                    locations: validLocations,
                    assignedResponders: selectedResponders,
                    assignedResources: []
                })
            });
            const data = await res.json();
            if (data.success) {
                setIsDispatchOpen(false);
                setSelectedResponders([]);
                fetchData();
                toast.success("Task dispatched successfully!");
            } else {
                toast.error(data.error || "Failed to create task");
            }
        } catch { toast.error("Connection error"); }
    };

    const handleLogout = () => {
        clearAuth();
        window.location.href = "/landingPage";
    };

    const getTimeAgo = (dateStr: string) => {
        const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
        if (diff < 1) return "Just now";
        if (diff < 60) return `${diff}m ago`;
        if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
        return `${Math.floor(diff / 1440)}d ago`;
    };

    const getSeverityColor = (s: number) => {
        if (s >= 8) return "bg-red-100 text-red-700 border-red-200";
        if (s >= 5) return "bg-orange-100 text-orange-700 border-orange-200";
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    };

    const getPriorityColor = (p: string) => {
        if (p === "Critical" || p === "High") return "bg-red-100 text-red-700";
        if (p === "Medium") return "bg-orange-100 text-orange-700";
        return "bg-green-100 text-green-700";
    };

    const getStatusColor = (s: string) => {
        if (s === "Resolved" || s === "Completed") return "bg-green-100 text-green-700";
        if (s === "Actioned" || s === "In Progress") return "bg-blue-100 text-blue-700";
        return "bg-slate-100 text-slate-600";
    };

    const pendingCitizen = citizenRequests.filter(r => r.status === "Pending").length;
    const pendingReports = fieldReports.filter(r => r.status === "Pending").length;
    const totalResources = resources.length;
    const activeTasks = tasks.filter(t => t.status !== "Completed").length;

    const navItems = [
        { id: "dashboard", label: "Overview", icon: FiGrid },
        { id: "citizen", label: "Citizen Help", icon: FiAlertCircle, badge: pendingCitizen },
        { id: "fieldreports", label: "Field Reports", icon: FiFileText, badge: pendingReports },
        { id: "resources", label: "All Resources", icon: FiPackage },
        { id: "tasks", label: "Task Management", icon: FiUsers },
        { id: "history", label: "History", icon: FiClock },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Dispatch Modal */}
            {isDispatchOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 bg-indigo-600 text-white flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold">Assign Task to Organization</h3>
                                <p className="text-indigo-200 text-xs mt-1">Super Admin dispatch</p>
                            </div>
                            <button onClick={() => setIsDispatchOpen(false)} className="text-indigo-200 hover:text-white">
                                <FiX className="text-2xl" />
                            </button>
                        </div>
                        <form onSubmit={handleDispatchSubmit} className="p-6 space-y-4">
                            <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 text-sm text-slate-700">
                                <p className="font-bold text-slate-900">{dispatchData.title}</p>
                                <p className="text-xs text-slate-500 mt-1 italic">"{dispatchData.description}"</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Task Title</label>
                                <input type="text" required value={dispatchData.title}
                                    onChange={e => setDispatchData({ ...dispatchData, title: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-bold text-slate-700">Distribution Locations</label>
                                    <button type="button" onClick={() => setDispatchLocations([...dispatchLocations, ""])}
                                        className="text-xs text-indigo-600 font-bold flex items-center gap-1 hover:text-indigo-700">
                                        <FiPlus /> Add Location
                                    </button>
                                </div>
                                <div className="space-y-2 max-h-32 overflow-y-auto p-1">
                                    {dispatchLocations.map((loc, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <div className="relative flex-1">
                                                <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                                                <input type="text" required value={loc}
                                                    onChange={e => {
                                                        const newLocs = [...dispatchLocations];
                                                        newLocs[idx] = e.target.value;
                                                        setDispatchLocations(newLocs);
                                                    }}
                                                    placeholder="Enter location address..."
                                                    className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                                            </div>
                                            {dispatchLocations.length > 1 && (
                                                <button type="button" onClick={() => setDispatchLocations(dispatchLocations.filter((_, i) => i !== idx))}
                                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                                    <FiX />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Priority</label>
                                <select value={dispatchData.priority}
                                    onChange={e => setDispatchData({ ...dispatchData, priority: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Target Organization</label>
                                <select required value={dispatchData.targetOrganizationId}
                                    onChange={e => {
                                        setDispatchData({ ...dispatchData, targetOrganizationId: e.target.value });
                                        loadResponders(e.target.value);
                                    }}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="">Select organization...</option>
                                    {organizations.map(o => (
                                        <option key={o._id} value={o._id}>{o.organizationName} ({o.name})</option>
                                    ))}
                                </select>
                            </div>

                            {responders.length > 0 && (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Assign Responders (optional)</label>
                                    <div className="space-y-2 max-h-36 overflow-y-auto">
                                        {responders.map(r => (
                                            <label key={r._id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedResponders.includes(r._id) ? "bg-indigo-50 border-indigo-300" : "border-slate-200 hover:bg-slate-50"}`}>
                                                <input type="checkbox" className="hidden"
                                                    checked={selectedResponders.includes(r._id)}
                                                    onChange={e => setSelectedResponders(e.target.checked
                                                        ? [...selectedResponders, r._id]
                                                        : selectedResponders.filter(id => id !== r._id))} />
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${selectedResponders.includes(r._id) ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"}`}>
                                                    {r.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{r.name}</p>
                                                    <p className="text-xs text-slate-400">{r.email}</p>
                                                </div>
                                                {selectedResponders.includes(r._id) && <FiCheck className="text-indigo-600 ml-auto" />}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                                <FiShield /> Dispatch Task
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-slate-100">
                    <Link href="/landingPage" className="flex items-center gap-2">
                        <Image src="/images/logo.png" alt="Logo" width={120} height={40} className="h-9 w-auto" priority unoptimized />
                    </Link>
                    <div className="mt-3 flex items-center gap-2">
                        <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                            Super Admin
                        </span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(item => (
                        <button key={item.id} onClick={() => setActiveNav(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeNav === item.id ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"}`}>
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
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Logged in as</p>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">Super Admin</p>
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
                        <h1 className="text-3xl font-black text-slate-900 font-heading tracking-tighter">
                            {activeNav === "dashboard" && "Platform Overview"}
                            {activeNav === "citizen" && <><span className="text-gradient">Citizen</span> Help Requests</>}
                            {activeNav === "fieldreports" && "Field Reports"}
                            {activeNav === "resources" && "Organization Resources"}
                            {activeNav === "tasks" && "Active Task Management"}
                            {activeNav === "history" && "Overall Task History"}
                        </h1>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-blue-600" />
                            Warm Hands Control Center
                        </p>
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

                {/* --- OVERVIEW --- */}
                {activeNav === "dashboard" && (
                    <div className="space-y-8">
                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: "Pending Citizen Requests", value: pendingCitizen, color: "text-red-600", bg: "bg-red-50", nav: "citizen" },
                                { label: "Pending Field Reports", value: pendingReports, color: "text-orange-600", bg: "bg-orange-50", nav: "fieldreports" },
                                { label: "Total Resources (All Orgs)", value: totalResources, color: "text-blue-600", bg: "bg-blue-50", nav: "resources" },
                                { label: "Active Tasks", value: activeTasks, color: "text-indigo-600", bg: "bg-indigo-50", nav: "tasks" },
                            ].map(stat => (
                                <button key={stat.label} onClick={() => setActiveNav(stat.nav)}
                                    className={`${stat.bg} rounded-2xl p-6 text-left border border-white hover:shadow-md transition-all`}>
                                    <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                                    <p className="text-xs text-slate-500 font-medium mt-2">{stat.label}</p>
                                </button>
                            ))}
                        </div>

                        {/* Org summary */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">Registered Organizations ({organizations.length})</h2>
                            {organizations.length === 0 ? (
                                <p className="text-sm text-slate-400 italic">No organizations registered yet.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {organizations.map(org => (
                                        <div key={org._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-black text-sm">
                                                    {org.organizationName?.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-bold text-slate-900">{org.organizationName}</p>
                                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest ${org.status === 'verified' ? 'bg-green-100 text-green-700' :
                                                            org.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                'bg-amber-100 text-amber-700'
                                                            }`}>
                                                            {org.status || 'verified'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-400">{org.email}</p>
                                                </div>
                                            </div>
                                            {org.status === 'pending' && (
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => handleVerify(org._id, 'verified')}
                                                        className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all" title="Approve">
                                                        <FiCheck />
                                                    </button>
                                                    <button onClick={() => handleVerify(org._id, 'rejected')}
                                                        className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all" title="Reject">
                                                        <FiX />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recent citizen requests */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Citizen Requests</h2>
                            {citizenRequests.slice(0, 5).map(req => (
                                <div key={req._id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs px-2 py-1 rounded-full border font-bold ${getSeverityColor(req.severity)}`}>
                                            Sev {req.severity}
                                        </span>
                                        <p className="text-sm text-slate-700 truncate max-w-xs">{req.description}</p>
                                    </div>
                                    <span className="text-xs text-slate-400">{getTimeAgo(req.createdAt)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- CITIZEN HELP --- */}
                {activeNav === "citizen" && (
                    <div className="space-y-4">
                        {citizenRequests.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                                <FiAlertCircle className="text-4xl text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500">No citizen help requests yet.</p>
                            </div>
                        ) : citizenRequests.map(req => (
                            <div key={req._id} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-sm transition-all">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`text-xs px-2 py-1 rounded-full border font-bold ${getSeverityColor(req.severity)}`}>
                                                Severity {req.severity}/10
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${getStatusColor(req.status)}`}>
                                                {req.status}
                                            </span>
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <FiClock className="text-[10px]" />{getTimeAgo(req.createdAt)}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-bold">
                                                Types: {req.helpTypes && req.helpTypes.length > 0 ? req.helpTypes.join(" / ") : "Other"}
                                            </span>
                                            {req.isInjured && (
                                                <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[11px] font-bold">
                                                    Injured
                                                </span>
                                            )}
                                            {req.isImmediateDanger && (
                                                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[11px] font-bold animate-pulse">
                                                    Immediate Danger
                                                </span>
                                            )}
                                            {req.peopleAffected > 1 && (
                                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[11px] font-bold">
                                                    {req.peopleAffected} People
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-800 mb-1">{req.description}</p>
                                        <p className="text-xs text-slate-500">Contact: <span className="font-bold">{req.contactNumber}</span></p>
                                        {req.location && (
                                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                                <FiMapPin className="text-[10px]" />{req.location}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 flex-shrink-0">
                                        {req.status === "Pending" && (
                                            <>
                                                <button onClick={() => openDispatchFromCitizen(req)}
                                                    className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1">
                                                    <FiPlus /> Dispatch
                                                </button>
                                                <button onClick={() => handleUpdateCitizenStatus(req._id, "Resolved")}
                                                    className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1">
                                                    <FiCheck /> Resolve
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- FIELD REPORTS --- */}
                {activeNav === "fieldreports" && (
                    <div className="space-y-4">
                        {fieldReports.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                                <FiFileText className="text-4xl text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500">No field reports submitted yet.</p>
                            </div>
                        ) : fieldReports.map(report => (
                            <div key={report._id} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-sm transition-all">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${getPriorityColor(report.priority)}`}>
                                                {report.priority}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${getStatusColor(report.status)}`}>
                                                {report.status}
                                            </span>
                                            <span className="text-xs text-slate-400">{getTimeAgo(report.createdAt)}</span>
                                        </div>
                                        <p className="text-sm text-slate-800 mb-1">{report.description}</p>
                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                            <FiMapPin className="text-[10px]" />{report.location}
                                        </p>
                                        {report.responder && (
                                            <p className="text-xs text-slate-400 mt-1">
                                                By: <span className="font-bold text-slate-600">{report.responder.name}</span>
                                                {report.responder.organizationName && ` — ${report.responder.organizationName}`}
                                            </p>
                                        )}
                                        {report.resourcesNeeded && (
                                            <p className="text-xs text-orange-600 mt-1 font-medium">Resources needed: {report.resourcesNeeded}</p>
                                        )}
                                    </div>
                                    {report.status === "Pending" && (
                                        <button onClick={() => openDispatchFromFieldReport(report)}
                                            className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1 flex-shrink-0">
                                            <FiPlus /> Dispatch
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- ALL RESOURCES --- */}
                {activeNav === "resources" && (
                    <div className="space-y-4">
                        {/* Group by org */}
                        {organizations.length === 0 && resources.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                                <FiPackage className="text-4xl text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500">No resources registered yet.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
                                        <p className="text-2xl font-black text-blue-600">{resources.length}</p>
                                        <p className="text-xs text-slate-500 mt-1">Total Resources</p>
                                    </div>
                                    <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
                                        <p className="text-2xl font-black text-green-600">{resources.filter(r => r.status === "Available").length}</p>
                                        <p className="text-xs text-slate-500 mt-1">Available</p>
                                    </div>
                                    <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
                                        <p className="text-2xl font-black text-red-600">{resources.filter(r => r.status === "Out of Stock").length}</p>
                                        <p className="text-xs text-slate-500 mt-1">Out of Stock</p>
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr>
                                                {["Resource", "Organization", "Category", "Quantity", "Status"].map(h => (
                                                    <th key={h} className="text-left text-xs font-black text-slate-500 uppercase tracking-widest px-5 py-3">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {resources.map(res => (
                                                <tr key={res._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-5 py-3 text-sm font-bold text-slate-900">{res.name}</td>
                                                    <td className="px-5 py-3 text-sm text-slate-600">{res.organizationName}</td>
                                                    <td className="px-5 py-3 text-sm text-slate-500">{res.category}</td>
                                                    <td className="px-5 py-3 text-sm font-bold text-slate-900">{res.quantity} {res.unit}</td>
                                                    <td className="px-5 py-3">
                                                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${res.status === "Available" ? "bg-green-100 text-green-700" : res.status === "Low Stock" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}>
                                                            {res.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* --- TASKS --- */}
                {activeNav === "tasks" && (
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <button onClick={() => {
                                setDispatchData({ title: "", description: "", location: "", priority: "Medium", sourceRef: "", sourceType: "Manual", targetOrganizationId: "" });
                                setSelectedResponders([]);
                                setResponders([]);
                                setIsDispatchOpen(true);
                            }} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100">
                                <FiPlus /> Create Task
                            </button>
                        </div>
                        {tasks.filter(t => t.status !== "Completed").length === 0 ? (
                            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                                <FiUsers className="text-4xl text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500">No active tasks in progress.</p>
                            </div>
                        ) : tasks.filter(t => t.status !== "Completed").map(task => (
                            <div key={task._id} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-sm transition-all">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${getStatusColor(task.status)}`}>{task.status}</span>
                                        </div>
                                        <p className="font-bold text-slate-900 text-sm">{task.title}</p>
                                        <p className="text-xs text-slate-500 mt-1">{task.description}</p>
                                        {task.location && (
                                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                <FiMapPin className="text-[10px]" />{task.location}
                                            </p>
                                        )}
                                        {typeof task.organization === "object" && task.organization?.organizationName && (
                                            <p className="text-xs text-indigo-600 font-bold mt-1">Org: {task.organization.organizationName}</p>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 flex-shrink-0">{getTimeAgo(task.createdAt)}</p>
                                </div>
                                {task.assignedResponders?.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {task.assignedResponders.map(r => (
                                            <span key={r._id} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full font-medium">{r.name}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* OVERALL HISTORY */}
                {activeNav === "history" && (
                    <div className="space-y-4">
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-700">
                            <strong>Global Archive:</strong> Visualizing all completed missions across every organization.
                        </div>
                        {tasks.filter(t => t.status === "Completed").length === 0 ? (
                            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                                <FiClock className="text-4xl text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500">No tasks have been completed yet.</p>
                            </div>
                        ) : tasks.filter(t => t.status === "Completed").map(task => (
                            <div key={task._id} className="bg-white rounded-2xl border border-slate-100 p-5 opacity-80 hover:opacity-100 transition-opacity">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-green-200">Archive</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                                        </div>
                                        <p className="font-bold text-slate-900 text-sm">{task.title}</p>
                                        <p className="text-xs text-slate-500 mt-1">{task.description}</p>
                                        {task.location && (
                                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                <FiMapPin className="text-[10px]" />{task.location}
                                            </p>
                                        )}
                                        {typeof task.organization === "object" && task.organization?.organizationName && (
                                            <p className="text-[10px] text-indigo-600 font-black mt-2 uppercase tracking-widest">Org: {task.organization.organizationName}</p>
                                        )}
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Finalized</p>
                                        <p className="text-xs text-slate-900 font-black mt-1">{getTimeAgo(task.createdAt)}</p>
                                    </div>
                                </div>
                                {task.assignedResponders?.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {task.assignedResponders.map(r => (
                                            <span key={r._id} className="text-[10px] bg-slate-50 text-slate-500 px-2.5 py-1 rounded-lg font-bold border border-slate-100">{r.name}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
