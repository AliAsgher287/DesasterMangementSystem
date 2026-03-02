"use client";

import { useState, useEffect } from "react";
import { getAuthToken } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import {
    FiSearch,
    FiBell,
    FiClock,
    FiCheckCircle,
    FiRefreshCw,
    FiMapPin,
    FiPlus,
    FiLoader
} from "react-icons/fi";
import { toast } from "react-hot-toast";

interface Task {
    _id: string;
    title: string;
    description: string;
    location: string;
    priority: string;
    status: string;
    organization: {
        organizationName: string;
    };
    assignedResources?: {
        name: string;
        quantity: number;
        unit: string;
    }[];
    createdAt: string;
}

export default function ResponderDashboard() {
    const [activeTab, setActiveTab] = useState("Active Tasks");
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastSynced, setLastSynced] = useState("Just now");

    const fetchTasks = async () => {
        try {
            const token = getAuthToken();
            const response = await fetch("http://localhost:5000/api/tasks/my", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setTasks(data.data);
                setLastSynced("Just now");
            }
        } catch (err) {
            console.error("Failed to fetch tasks");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
        const interval = setInterval(fetchTasks, 30000); // Auto-sync every 30s
        return () => clearInterval(interval);
    }, []);

    const handleStatusUpdate = async (taskId: string, status: string) => {
        try {
            const token = getAuthToken();
            const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            const data = await response.json();
            if (data.success) {
                fetchTasks();
                toast.success(`Task status updated to ${status}`);
            }
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const getSummaryStats = () => {
        const total = tasks.length;
        const inProgress = tasks.filter(t => t.status === 'In Progress').length;
        const completed = tasks.filter(t => t.status === 'Completed').length;
        return { total, inProgress, completed };
    };

    const stats = getSummaryStats();

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            {/* Top Navigation */}
            <header className="flex items-center justify-between px-8 py-4 border-b border-slate-200">
                <Link href="/landingPage" className="flex items-center gap-2">
                    <Image
                        src="/images/logo.png"
                        alt="Warm Hands Logo"
                        width={120}
                        height={40}
                        className="h-10 w-auto object-contain"
                        priority
                    />
                </Link>

                <div className="flex-1 max-w-md mx-8">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search resources..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>

                <nav className="flex items-center gap-8">
                    {["Active Tasks", "History", "Support"].map((item) => (
                        <button
                            key={item}
                            onClick={() => setActiveTab(item)}
                            className={`text-sm font-medium transition-colors ${activeTab === item ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                    <div className="relative ml-4">
                        <FiBell className="text-xl text-slate-600 cursor-pointer" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </div>
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-200 ml-4 cursor-pointer bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        <Image
                            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100"
                            alt="Profile"
                            width={40}
                            height={40}
                            className="object-cover"
                            unoptimized
                        />
                        <span className="text-xs absolute">JD</span>
                    </div>
                </nav>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-10">
                {/* Page Header */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">Responder Task Dashboard</h2>
                        <p className="text-slate-500 mt-1">Track and manage your field resource assignments in real-time.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/responderDashboard/fieldReport"
                            className="flex items-center gap-2 bg-rose-600 text-white px-5 py-2.5 rounded-xl hover:bg-rose-700 transition-all font-bold text-sm shadow-lg shadow-rose-100"
                        >
                            <FiPlus />
                            New Assessment
                        </Link>
                        <div className="flex items-center gap-2 text-slate-500 text-sm bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                            <FiClock />
                            <span>Last synced 2 minutes ago</span>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-slate-50 rounded-lg">
                                <FiClock className="text-slate-500 text-xl" />
                            </div>
                            <h3 className="text-slate-600 font-medium">Total Tasks</h3>
                        </div>
                        <p className="text-5xl font-bold">{stats.total}</p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <FiRefreshCw className="text-blue-500 text-xl" />
                            </div>
                            <h3 className="text-slate-600 font-medium">In Progress</h3>
                        </div>
                        <p className="text-5xl font-bold text-blue-600">{stats.inProgress}</p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <FiCheckCircle className="text-green-500 text-xl" />
                            </div>
                            <h3 className="text-slate-600 font-medium">Completed</h3>
                        </div>
                        <p className="text-5xl font-bold text-green-600">{stats.completed}</p>
                    </div>
                </div>

                {/* Active Task List */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-10">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-lg">Active Task List</h3>
                        <button className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                            <FiRefreshCw className="text-xs" />
                            Filter Tasks
                        </button>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mission & Supplies</th>
                                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Operational Area</th>
                                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">H.Q.</th>
                                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center">
                                        <FiLoader className="inline-block text-2xl text-blue-600 animate-spin mb-2" />
                                        <p className="text-sm text-slate-500 font-medium">Loading your missions...</p>
                                    </td>
                                </tr>
                            ) : tasks.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center text-slate-400 italic">
                                        No active tasks assigned to you.
                                    </td>
                                </tr>
                            ) : tasks.map((task) => (
                                <tr key={task._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <p className="font-bold text-slate-900">{task.title}</p>
                                            <p className="text-xs text-slate-400 mt-1 max-w-md italic">"{task.description}"</p>

                                            {task.assignedResources && task.assignedResources.length > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {task.assignedResources.map((res, i) => (
                                                        <div key={i} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-100 text-[10px] font-black uppercase tracking-tighter">
                                                            <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded-sm">{res.quantity}</span>
                                                            <span>{res.unit} {res.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <FiMapPin className="text-blue-500" />
                                            <span className="text-sm font-semibold">{task.location}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-bold text-slate-900">{task.organization?.organizationName}</p>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Coordinating Org</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="inline-flex bg-slate-100 p-1 rounded-xl">
                                            {["Pending", "In Progress", "Completed"].map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => handleStatusUpdate(task._id, status)}
                                                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${task.status === status
                                                        ? status === "Pending"
                                                            ? "bg-white text-slate-500 shadow-sm"
                                                            : status === "In Progress"
                                                                ? "bg-white text-blue-600 shadow-sm"
                                                                : "bg-green-500 text-white shadow-md"
                                                        : "text-slate-400 hover:text-slate-600"
                                                        }`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="px-8 py-4 bg-slate-50 flex items-center justify-between border-t border-slate-100">
                        <p className="text-sm text-slate-400">Showing 4 of 12 active tasks</p>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Previous</button>
                            <button className="px-4 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Next</button>
                        </div>
                    </div>
                </div>

                {/* Assigned Area Overview */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                    <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FiMapPin className="text-blue-600 text-xl" />
                            <h3 className="font-bold text-lg">Assigned Area Overview</h3>
                        </div>
                        <button className="text-blue-600 text-sm font-bold hover:underline">Open Full Map</button>
                    </div>
                    <div className="p-10 flex flex-col items-center justify-center h-full min-h-[300px] relative">
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
                            {/* Decorative dots grid */}
                            <div className="grid grid-cols-[repeat(40,minmax(0,1fr))] gap-4 p-4 text-blue-600 text-xs">
                                {Array.from({ length: 800 }).map((_, i) => (
                                    <span key={i}>.</span>
                                ))}
                            </div>
                        </div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200 mb-4 transition-transform hover:scale-110 cursor-pointer">
                                <FiMapPin className="text-white text-2xl" />
                            </div>
                            <h4 className="font-bold text-slate-900">Zone 7: North Relief Sector</h4>
                            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Current Headquarters</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
