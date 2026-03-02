"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiFileText, FiUser, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { HiShieldCheck } from "react-icons/hi2";
import { toast } from "react-hot-toast";

interface Request {
    id: number;
    date: string;
    description: string;
    urgency: number;
    status: "Actioned" | "Pending" | "Resolved";
}

export default function Page() {
    const [helpTypes, setHelpTypes] = useState<string[]>([]);
    const [isInjured, setIsInjured] = useState(false);
    const [isImmediateDanger, setIsImmediateDanger] = useState(false);
    const [peopleAffected, setPeopleAffected] = useState(1);
    const [description, setDescription] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showGuidelines, setShowGuidelines] = useState(false);

    const toggleHelpType = (type: string) => {
        setHelpTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    // Load local history on mount
    useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("citizen_help_history");
            if (saved) setRequests(JSON.parse(saved));
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !contactNumber || helpTypes.length === 0) {
            toast.error("Please provide a description, contact number, and select at least one type of help.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/citizen-help", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    description,
                    contactNumber,
                    helpTypes,
                    isInjured,
                    isImmediateDanger,
                    peopleAffected
                })
            });

            const data = await response.json();
            if (data.success) {
                const newRequest: Request = {
                    id: data.data._id,
                    date: new Date(data.data.createdAt).toLocaleString(),
                    description: data.data.description,
                    urgency: data.data.severity,
                    status: data.data.status
                };

                const updatedRequests = [newRequest, ...requests];
                setRequests(updatedRequests);
                localStorage.setItem("citizen_help_history", JSON.stringify(updatedRequests));

                setDescription("");
                setContactNumber("");
                // Reset new fields
                setHelpTypes([]);
                setIsInjured(false);
                setIsImmediateDanger(false);
                setPeopleAffected(1);

                setIsSuccess(true);
                setTimeout(() => setIsSuccess(false), 5000);
            }
        } catch (err) {
            toast.error("Failed to submit request. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    const getUrgencyColor = (level: number) => {
        if (level <= 2) return "bg-blue-100 text-blue-700";
        if (level <= 3) return "bg-yellow-100 text-yellow-700";
        if (level === 4) return "bg-orange-100 text-orange-700";
        return "bg-red-100 text-red-700";
    };

    const getStatusColor = (status: string) => {
        if (status === "Resolved") return "bg-green-100 text-green-700";
        if (status === "Pending") return "bg-yellow-100 text-yellow-700";
        return "bg-blue-100 text-blue-700";
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Navbar */}
            <header className="w-full bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link href="/landingPage" className="flex items-center gap-2">
                        <Image
                            src="/images/logo.png"
                            alt="Warm Hands Logo"
                            width={120}
                            height={40}
                            className="h-8 w-auto"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm text-slate-700">
                        <Link href="/landingPage" className="hover:text-blue-600 transition-colors">
                            Home
                        </Link>
                        <Link href="/help-centers" className="hover:text-blue-600 transition-colors">
                            Help Centers
                        </Link>
                        <Link href="/contact" className="hover:text-blue-600 transition-colors">
                            Contact
                        </Link>
                        <Link
                            href="/authentication/login"
                            className="text-blue-600 hover:text-blue-700 transition-colors font-medium border border-blue-600 px-5 py-2 rounded-lg"
                        >
                            Organization Login
                        </Link>
                        <Link
                            href="/authentication/registration"
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md shadow-blue-100"
                        >
                            Register Org
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 text-slate-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading tracking-tighter">
                        Citizen <span className="text-gradient">Help Request</span>
                    </h1>
                    <p className="text-slate-500 mt-4 text-sm sm:text-lg max-w-2xl italic font-medium tracking-tight leading-relaxed">
                        Your safety is our priority. Provide details about your emergency situation to coordinate assistance.
                    </p>
                    <button
                        onClick={() => setShowGuidelines(true)}
                        className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                    >
                        <FiFileText />
                        View Guidelines
                    </button>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">
                        New Help Request
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                Describe your situation
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Please provide details like what happened, who is involved, and what immediate help is needed..."
                                rows={6}
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Type of Help */}
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-2">
                                    What type of help is needed?
                                </label>
                                <p className="text-xs text-slate-500 mb-4">(Select all that apply)</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {["Food", "Medical", "Shelter", "Rescue", "Other"].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => toggleHelpType(type)}
                                            className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all border-2 ${helpTypes.includes(type)
                                                ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
                                                : "bg-white text-slate-600 border-slate-100 hover:border-blue-200 hover:bg-blue-50/30"
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Contact Number */}
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-4">
                                    Emergency Contact Number
                                </label>
                                <input
                                    type="tel"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-medium bg-slate-50/50"
                                />
                            </div>

                            {/* Yes/No Toggles */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-900 mb-4">
                                        Is someone injured?
                                    </label>
                                    <div className="flex gap-4">
                                        {[true, false].map((val) => (
                                            <button
                                                key={String(val)}
                                                type="button"
                                                onClick={() => setIsInjured(val)}
                                                className={`flex-1 py-3 rounded-xl font-bold transition-all border-2 ${isInjured === val
                                                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xl shadow-emerald-100"
                                                    : "bg-white text-slate-600 border-slate-100 hover:border-slate-200"
                                                    }`}
                                            >
                                                {val ? "Yes, Injured" : "No Injuries"}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-900 mb-4">
                                        Is life in immediate danger?
                                    </label>
                                    <div className="flex gap-4">
                                        {[true, false].map((val) => (
                                            <button
                                                key={String(val)}
                                                type="button"
                                                onClick={() => setIsImmediateDanger(val)}
                                                className={`flex-1 py-3 rounded-xl font-bold transition-all border-2 ${isImmediateDanger === val
                                                    ? "bg-red-600 text-white border-red-600 shadow-xl shadow-red-100"
                                                    : "bg-white text-slate-600 border-slate-100 hover:border-slate-200"
                                                    }`}
                                            >
                                                {val ? "Critical Danger" : "Stable Situation"}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* People Affected */}
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-4">
                                    Approximate number of people affected?
                                </label>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setPeopleAffected(Math.max(1, peopleAffected - 1))}
                                        className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center font-bold text-xl hover:bg-slate-50"
                                    >-</button>
                                    <input
                                        type="number"
                                        value={peopleAffected}
                                        onChange={(e) => setPeopleAffected(parseInt(e.target.value) || 1)}
                                        className="w-24 text-center border-2 border-slate-100 rounded-xl py-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-xl font-bold bg-slate-50/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPeopleAffected(peopleAffected + 1)}
                                        className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center font-bold text-xl hover:bg-slate-50"
                                    >+</button>
                                </div>
                                <p className="text-xs text-slate-500 mt-4 leading-relaxed bg-blue-50 p-3 rounded-lg border border-blue-100">
                                    Note: Your priority level will be determined automatically based on these answers to ensure the most critical cases are handled first.
                                </p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            {isSuccess && (
                                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-8 py-5 rounded-[2rem] font-bold animate-fade-in flex items-center gap-4 shadow-xl shadow-emerald-900/5">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-50 shrink-0">
                                        <FiCheckCircle className="text-xl" />
                                    </div>
                                    <p className="text-sm leading-tight leading-relaxed">
                                        Request submitted successfully! <br className="hidden md:block" />
                                        <span className="text-emerald-500/80 font-medium">Organizations have been notified and will reach out soon.</span>
                                    </p>
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full sm:w-auto bg-blue-600 text-white px-10 py-4 rounded-xl font-extrabold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? "Processing..." : "Submit Help Request"}
                                {!isLoading && <FiArrowRight />}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Previous Requests */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">
                        My Previous Requests
                    </h2>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Date Submitted
                                    </th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Description Snippet
                                    </th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Urgency
                                    </th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {requests.map((request) => (
                                    <tr key={request.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-4 text-sm text-slate-900">
                                            {request.date}
                                        </td>
                                        <td className="py-4 px-4 text-sm text-slate-600">
                                            {request.description}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(request.urgency)}`}>
                                                Level {request.urgency}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-6 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-xs text-slate-500">
                        © 2023 Warm Hands Coordination Platform. For life-threatening emergencies, please call local emergency services immediately.
                    </p>
                </div>
            </footer>

            {/* Guidelines Modal */}
            {showGuidelines && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-500"
                        onClick={() => setShowGuidelines(false)}
                    />
                    <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-slate-100 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                        {/* Decorative Header */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 to-indigo-700 -z-10" />

                        <div className="p-8 sm:p-12">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-white shadow-xl shadow-blue-900/10 rounded-[1.5rem] flex items-center justify-center text-3xl text-blue-600 transition-transform hover:scale-110">
                                        <FiFileText />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-white tracking-tight">Citizen Safety Guidelines</h2>
                                        <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-1 opacity-80">Protocol v1.2 • Institutional Support</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowGuidelines(false)}
                                    className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4 pt-4">
                                {[
                                    {
                                        title: "Stay Calm & Find Cover",
                                        desc: "The first priority is your physical safety. Move to the highest accessible ground or stable structures.",
                                        icon: "🏔️"
                                    },
                                    {
                                        title: "Conserve Private Resources",
                                        desc: "Preserve mobile battery and clean water. Only use devices for essential coordination.",
                                        icon: "🔋"
                                    },
                                    {
                                        title: "Wait for Verified Personnel",
                                        desc: "Ask for credentials. Only coordinate with responders verified by the Warm Hands platform.",
                                        icon: "🛡️"
                                    },
                                    {
                                        title: "Signal Positioning",
                                        desc: "Stay in areas with reception. This allows our automated dispatch to find you faster.",
                                        icon: "📡"
                                    }
                                ].map((g, i) => (
                                    <div key={i} className="flex gap-6 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 group hover:border-blue-400 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
                                        <div className="w-12 h-12 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                                            {g.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-900 mb-1 tracking-tight text-lg">{g.title}</h3>
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed">{g.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowGuidelines(false)}
                                className="w-full mt-10 py-5 bg-slate-900 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 hover:-translate-y-1 active:translate-y-0"
                            >
                                I Acknowledge & Understand
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
