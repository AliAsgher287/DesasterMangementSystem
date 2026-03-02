"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiSearch, FiUser, FiSend, FiShield, FiAlertTriangle, FiAlertCircle } from "react-icons/fi";

export default function Page() {
    const [targetOrg, setTargetOrg] = useState("");
    const [resourceType, setResourceType] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unitOfMeasure, setUnitOfMeasure] = useState("");
    const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
    const [additionalContext, setAdditionalContext] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ targetOrg, resourceType, quantity, unitOfMeasure, priority, additionalContext });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/landingPage" className="flex items-center gap-2">
                            <Image
                                src="/images/logo.png"
                                alt="Warm Hands Logo"
                                width={120}
                                height={40}
                                className="h-10 w-auto object-contain"
                                unoptimized
                                priority
                            />

                        </Link>

                        {/* Search Bar */}
                        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                            <div className="relative w-full">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search resources..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/organizationDashboard" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                                Dashboard
                            </Link>
                            <Link href="/resource-map" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                                Resource Map
                            </Link>
                            <Link href="/resourceRequest" className="text-sm text-blue-600 font-semibold">
                                New Request
                            </Link>
                            <Link href="/inventory" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                                Inventory
                            </Link>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                Profile
                            </button>
                            <button className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                                <FiUser className="text-orange-700" />
                            </button>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-6">
                    <Link href="/resources" className="hover:text-blue-600">Resources</Link>
                    <span>/</span>
                    <span className="text-slate-900 font-medium">New Request</span>
                </div>

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                        Resource Request Form
                    </h1>
                    <p className="text-slate-600 text-sm sm:text-base">
                        Specify the requirements for emergency supplies or personnel needed from partner organizations.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Target Organization & Resource Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-2">
                                    Target Organization
                                </label>
                                <div className="relative">
                                    <select
                                        value={targetOrg}
                                        onChange={(e) => setTargetOrg(e.target.value)}
                                        className="w-full appearance-none border border-slate-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm bg-white"
                                    >
                                        <option value="">Select an organization...</option>
                                        <option value="red-cross">Red Cross</option>
                                        <option value="fema">FEMA</option>
                                        <option value="local-fire">Local Fire Department</option>
                                        <option value="shelter">Community Shelter</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-2">
                                    Resource Type
                                </label>
                                <div className="relative">
                                    <select
                                        value={resourceType}
                                        onChange={(e) => setResourceType(e.target.value)}
                                        className="w-full appearance-none border border-slate-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm bg-white"
                                    >
                                        <option value="">Select resource category...</option>
                                        <option value="medical">Medical Supplies</option>
                                        <option value="food">Food & Water</option>
                                        <option value="shelter">Shelter Supplies</option>
                                        <option value="energy">Energy/Power</option>
                                        <option value="personnel">Personnel</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quantity & Unit of Measure */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-2">
                                    Quantity Needed
                                </label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="e.g. 500"
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-2">
                                    Unit of Measure
                                </label>
                                <input
                                    type="text"
                                    value={unitOfMeasure}
                                    onChange={(e) => setUnitOfMeasure(e.target.value)}
                                    placeholder="e.g. Liters, Units, Boxes"
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                                />
                            </div>
                        </div>

                        {/* Request Priority */}
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-3">
                                Request Priority
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                                {/* Low */}
                                <button
                                    type="button"
                                    onClick={() => setPriority("low")}
                                    className={`flex flex-col items-center justify-center py-6 rounded-lg border-2 transition-all ${priority === "low"
                                        ? "border-green-500 bg-green-50"
                                        : "border-slate-200 bg-slate-50 hover:border-slate-300"
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${priority === "low" ? "bg-green-500" : "bg-green-100"
                                        }`}>
                                        <FiShield className={`text-xl ${priority === "low" ? "text-white" : "text-green-600"}`} />
                                    </div>
                                    <span className={`font-semibold text-sm ${priority === "low" ? "text-green-700" : "text-slate-700"}`}>
                                        Low
                                    </span>
                                </button>

                                {/* Medium */}
                                <button
                                    type="button"
                                    onClick={() => setPriority("medium")}
                                    className={`flex flex-col items-center justify-center py-6 rounded-lg border-2 transition-all ${priority === "medium"
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-slate-200 bg-slate-50 hover:border-slate-300"
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${priority === "medium" ? "bg-blue-500" : "bg-blue-100"
                                        }`}>
                                        <FiAlertCircle className={`text-xl ${priority === "medium" ? "text-white" : "text-blue-600"}`} />
                                    </div>
                                    <span className={`font-semibold text-sm ${priority === "medium" ? "text-blue-700" : "text-slate-700"}`}>
                                        Medium
                                    </span>
                                </button>

                                {/* High */}
                                <button
                                    type="button"
                                    onClick={() => setPriority("high")}
                                    className={`flex flex-col items-center justify-center py-6 rounded-lg border-2 transition-all ${priority === "high"
                                        ? "border-red-500 bg-red-50"
                                        : "border-slate-200 bg-slate-50 hover:border-slate-300"
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${priority === "high" ? "bg-red-500" : "bg-red-100"
                                        }`}>
                                        <FiAlertTriangle className={`text-xl ${priority === "high" ? "text-white" : "text-red-600"}`} />
                                    </div>
                                    <span className={`font-semibold text-sm ${priority === "high" ? "text-red-700" : "text-slate-700"}`}>
                                        High
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Additional Context */}
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">
                                Additional Context <span className="text-slate-500 font-normal">(Optional)</span>
                            </label>
                            <textarea
                                value={additionalContext}
                                onChange={(e) => setAdditionalContext(e.target.value)}
                                placeholder="Describe the specific need, delivery address, or timeframe..."
                                rows={5}
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-base hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            <FiSend />
                            Submit Request
                        </button>

                        <p className="text-sm text-center text-slate-500">
                            Once submitted, the target organization will receive an immediate alert.
                        </p>
                    </form>
                </div>

                {/* Security Policy Notice */}
                <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 flex items-start gap-3">
                    <FiShield className="text-blue-600 text-xl flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-blue-900 text-sm mb-1">Warm Hands Security Policy</h3>
                        <p className="text-sm text-blue-700">
                            All requests are logged and encrypted. Please ensure the quantity is accurate to avoid supply chain disruptions.
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-6 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>© 2024 Warm Hands Disaster Coordination</span>
                        </div>
                        <div className="flex items-center gap-6 text-xs text-slate-500">
                            <Link href="/emergency-protocol" className="hover:text-blue-600">Emergency Protocol</Link>
                            <Link href="/contact-admin" className="hover:text-blue-600">Contact Admin</Link>
                            <Link href="/privacy" className="hover:text-blue-600">Privacy</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
