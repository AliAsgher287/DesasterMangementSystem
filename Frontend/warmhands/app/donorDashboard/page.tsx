"use client";

import { useState, useEffect, useCallback } from "react";
import { getAuthToken, clearAuth } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import {
    FiGrid, FiPackage, FiPlus, FiEdit2, FiTrash2,
    FiLogOut, FiRefreshCw, FiLoader, FiAlertCircle,
    FiMapPin, FiCheck, FiX, FiBox
} from "react-icons/fi";
import { toast } from "react-hot-toast";

interface Resource {
    _id: string;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    location: string;
    status: string;
    organizationName: string;
    createdAt: string;
}

const API = "http://localhost:5000/api";

export default function DonorDashboard() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        category: "Food",
        quantity: 0,
        unit: "",
        location: "",
        status: "Available"
    });

    const token = getAuthToken();
    const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };

    const fetchResources = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const response = await fetch(`${API}/resources`, { headers });
            const data = await response.json();
            if (data.success) {
                setResources(data.data);
            } else {
                setError(data.error || "Failed to fetch resources");
            }
        } catch (err) {
            setError("Connection error. Ensure backend is running.");
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    const handleLogout = () => {
        clearAuth();
        window.location.href = "/landingPage";
    };

    const handleOpenModal = (resource?: Resource) => {
        if (resource) {
            setEditingResource(resource);
            setFormData({
                name: resource.name,
                category: resource.category,
                quantity: resource.quantity,
                unit: resource.unit,
                location: resource.location,
                status: resource.status
            });
        } else {
            setEditingResource(null);
            setFormData({
                name: "",
                category: "Food",
                quantity: 0,
                unit: "",
                location: "",
                status: "Available"
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingResource ? `${API}/resources/${editingResource._id}` : `${API}/resources`;
            const method = editingResource ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                setIsModalOpen(false);
                fetchResources();
                toast.success(editingResource ? "Resource updated!" : "Resource registered!");
            } else {
                toast.error(data.error || "Operation failed");
            }
        } catch (err) {
            toast.error("Connection error");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this resource?")) return;
        try {
            const response = await fetch(`${API}/resources/${id}`, {
                method: "DELETE",
                headers
            });
            const data = await response.json();
            if (data.success) {
                fetchResources();
                toast.success("Resource deleted");
            } else {
                toast.error(data.error || "Failed to delete");
            }
        } catch (err) {
            toast.error("Connection error");
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-slate-100">
                    <Link href="/landingPage" className="flex items-center gap-2">
                        <Image src="/images/logo.png" alt="Logo" width={120} height={40} className="h-9 w-auto" priority unoptimized />
                    </Link>
                    <div className="mt-3 flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                            Signal Donor
                        </span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600">
                        <FiPackage className="text-lg" />
                        <span className="font-bold">My Resources</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <FiLogOut /><span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">My Resource Inventory</h1>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-blue-600" />
                            Manage your contributions
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={fetchResources} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all">
                            <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
                        </button>
                        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 uppercase tracking-widest text-[11px]">
                            <FiPlus /> Add Resource
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-100 text-red-500 px-6 py-4 rounded-2xl text-[12px] font-bold flex items-center gap-3">
                        <FiAlertCircle /> {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                        <FiLoader className="text-4xl animate-spin mb-4" />
                        <p className="text-sm font-medium">Fetching your resources...</p>
                    </div>
                ) : resources.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-sm">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiBox className="text-3xl text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No resources listed</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">Start contributing by adding your first resource to help in disaster relief operations.</p>
                        <button onClick={() => handleOpenModal()} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all">
                            Add Your First Resource
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {resources.map(resource => (
                            <div key={resource._id} className="bg-white rounded-[2rem] border border-slate-100 p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`p-3 rounded-2xl ${resource.category === 'Food' ? 'bg-orange-50 text-orange-600' :
                                        resource.category === 'Water' ? 'bg-blue-50 text-blue-600' :
                                            resource.category === 'Medical' ? 'bg-red-50 text-red-600' :
                                                'bg-slate-50 text-slate-600'
                                        }`}>
                                        <FiPackage className="text-2xl" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleOpenModal(resource)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                            <FiEdit2 />
                                        </button>
                                        <button onClick={() => handleDelete(resource._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 mb-1">{resource.name}</h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{resource.category}</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">{resource.status}</span>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-slate-50">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-400">Stock Level</span>
                                        <span className="text-sm font-black text-slate-900">{resource.quantity} {resource.unit}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                        <FiMapPin className="text-blue-500" />
                                        {resource.location}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
                        <div className="p-8 bg-slate-950 text-white flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black tracking-tighter">{editingResource ? "Edit Resource" : "Add New Resource"}</h3>
                                <p className="text-slate-400 text-xs mt-1 font-bold uppercase tracking-widest">Inventory Management</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="bg-white/10 p-2 rounded-xl hover:bg-white/20 transition-all">
                                <FiX className="text-xl" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Resource Name</label>
                                    <input type="text" required value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-bold"
                                        placeholder="e.g., Bottled Water Case" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                    <select value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-bold">
                                        {['Food', 'Water', 'Medical', 'Shelter', 'Tools', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                                    <select value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-bold">
                                        <option value="Available">Available</option>
                                        <option value="Out of Stock">Out of Stock</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Quantity</label>
                                    <input type="number" required value={formData.quantity}
                                        onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Unit</label>
                                    <input type="text" required value={formData.unit}
                                        onChange={e => setFormData({ ...formData, unit: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-bold"
                                        placeholder="e.g., Boxes" />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Pickup Location</label>
                                    <div className="relative">
                                        <FiMapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input type="text" required value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-bold"
                                            placeholder="Enter full address..." />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-[13px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2">
                                <FiCheck /> {editingResource ? "Save Changes" : "Register Resource"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
