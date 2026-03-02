"use client";

import { useState } from "react";
import { getAuthToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    FiArrowLeft,
    FiMapPin,
    FiAlertTriangle,
    FiFileText,
    FiPackage,
    FiSend,
    FiCheckCircle,
    FiLoader
} from "react-icons/fi";

export default function FieldReportPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [location, setLocation] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [description, setDescription] = useState("");
    const [resourcesNeeded, setResourcesNeeded] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const token = getAuthToken();
            const response = await fetch("http://localhost:5000/api/field-reports", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    location,
                    priority,
                    description,
                    resourcesNeeded
                })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/responderDashboard");
                }, 2000);
            } else {
                setError(data.error || "Failed to submit assessment");
            }
        } catch (err) {
            setError("Connection error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl shadow-blue-100 text-center">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiCheckCircle className="text-4xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Assessment Transmitted</h2>
                    <p className="text-slate-500 mb-8">Your report has been broadcasted to all relevant organizations. Emergency coordinators will be notified immediately.</p>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full animate-[progress_2s_ease-in-out]"></div>
                    </div>
                </div>
                <style jsx>{`
                    @keyframes progress {
                        0% { width: 0%; }
                        100% { width: 100%; }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link
                        href="/responderDashboard"
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-semibold py-2 px-3 rounded-xl hover:bg-slate-50"
                    >
                        <FiArrowLeft />
                        Back to Tasks
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center">
                            <FiAlertTriangle />
                        </div>
                        <h1 className="font-bold text-lg text-slate-900">Field Situational Assessment</h1>
                    </div>
                    <div className="w-24"></div> {/* Spacer for symmetry */}
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 mt-10">
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">New Site Assessment</h2>
                        <p className="text-slate-500">Provide accurate data from your current location to help prioritize relief resources.</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-3 text-sm font-medium">
                            <FiAlertTriangle className="flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Current Sector / Location</label>
                                <div className="relative">
                                    <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Zone 7 - North Relief Sector"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-medium placeholder:text-slate-400"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Urgency Level</label>
                                <div className="relative">
                                    <FiAlertTriangle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <select
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-bold appearance-none cursor-pointer"
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                    >
                                        <option value="Critical">🚨 Critical (Immediate Action)</option>
                                        <option value="High">⚠️ High Priority</option>
                                        <option value="Medium">⚡ Medium Priority</option>
                                        <option value="Low">✅ Low Priority</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Situational Description</label>
                            <div className="relative">
                                <FiFileText className="absolute left-4 top-5 text-slate-400" />
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Describe the current conditions, number of people affected, and immediate hazards..."
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-medium placeholder:text-slate-400 resize-none"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Immediate Resource Requirements</label>
                            <div className="relative">
                                <FiPackage className="absolute left-4 top-5 text-slate-400" />
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="e.g. 50 Medical Kits, 200 Gallons of Water, Heavy lifting equipment..."
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-medium placeholder:text-slate-400 resize-none"
                                    value={resourcesNeeded}
                                    onChange={(e) => setResourcesNeeded(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center gap-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full md:w-auto flex-1 bg-slate-900 text-white py-5 px-8 rounded-2xl font-black uppercase tracking-widest text-sm hover:shadow-2xl hover:shadow-slate-300 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {isLoading ? (
                                    <FiLoader className="animate-spin text-xl" />
                                ) : (
                                    <>
                                        Broadcast Assessment
                                        <FiSend className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </>
                                )}
                            </button>
                            <Link
                                href="/responderDashboard"
                                className="w-full md:w-auto text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest px-8 transition-colors"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>

                <div className="mt-8 flex items-center gap-3 justify-center">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-50 bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 overflow-hidden">
                                <Image
                                    src={`https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?auto=format&fit=cover&w=50&h=50`}
                                    alt="Responder"
                                    width={32}
                                    height={32}
                                    unoptimized
                                />
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Verified Responder Network active in this sector</p>
                </div>
            </main>
        </div>
    );
}
