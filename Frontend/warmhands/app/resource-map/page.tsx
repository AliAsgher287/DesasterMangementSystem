"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiSearch, FiMapPin, FiLayers, FiFilter, FiNavigation, FiZap } from "react-icons/fi";

export default function ResourceMapPage() {
    const [activeCategory, setActiveCategory] = useState("all");

    const resourceLocations = [
        { id: 1, name: "Medical Supply Depot", type: "medical", city: "Geneva", status: "high-stock" },
        { id: 2, name: "Food Reserve Warehouse", type: "food", city: "Lausanne", status: "low-stock" },
        { id: 3, name: "Emergency Personnel Base", type: "personnel", city: "Zurich", status: "ready" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link href="/landingPage">
                        <Image
                            src="/images/logo.png"
                            alt="Warm Hands Logo"
                            width={120}
                            height={40}
                            className="h-10 w-auto object-contain"
                            priority
                        />
                    </Link>
                    <nav className="flex items-center gap-6">
                        <Link href="/organizationDashboard" className="text-sm text-slate-600 hover:text-blue-600">Dashboard</Link>
                        <Link href="/resource-map" className="text-sm text-blue-600 font-bold">Map</Link>
                        <Link href="/inventory" className="text-sm text-slate-600 hover:text-blue-600">Inventory</Link>
                        <Link href="/resourceRequest" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">New Request</Link>
                    </nav>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-80 bg-white border-r border-slate-200 p-6 overflow-y-auto hidden lg:block">
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <FiFilter /> Filters
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">Resource Category</label>
                                <div className="space-y-2">
                                    {["all", "medical", "food", "energy", "personnel"].map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-all ${activeCategory === cat ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <FiZap /> Active Deployments
                        </h2>
                        <div className="space-y-3">
                            {resourceLocations.map(loc => (
                                <div key={loc.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <p className="font-bold text-slate-800 text-sm">{loc.name}</p>
                                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><FiMapPin /> {loc.city}</p>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{loc.type}</span>
                                        <span className="text-[10px] uppercase font-bold text-slate-400">{loc.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Map View Placeholder */}
                <div className="flex-1 relative bg-slate-200">
                    <div className="absolute inset-0 bg-[#e5e7eb] flex items-center justify-center">
                        <div className="text-center">
                            <FiNavigation className="text-6xl text-slate-400 mx-auto mb-4 animate-bounce" />
                            <h3 className="text-xl font-bold text-slate-600">Interactive Map Interface</h3>
                            <p className="text-slate-500">Real-time resource coordination dashboard</p>
                        </div>
                    </div>

                    {/* Map Controls */}
                    <div className="absolute top-6 right-6 flex flex-col gap-2">
                        <button className="p-3 bg-white rounded-xl shadow-lg hover:bg-slate-50 text-slate-600 text-xl"><FiLayers /></button>
                        <button className="p-3 bg-white rounded-xl shadow-lg hover:bg-slate-50 text-slate-600 text-xl">+</button>
                        <button className="p-3 bg-white rounded-xl shadow-lg hover:bg-slate-50 text-slate-600 text-xl">-</button>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 lg:left-6 lg:right-auto md:w-96">
                        <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-xl border border-white/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl">
                                    <FiMapPin />
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-slate-900">Coordination Zone A-1</h4>
                                    <p className="text-xs text-slate-500">Central Logistics Sector</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 mb-4">Displaying all verified resource hubs within a 50km radius of your current operational base.</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-100 p-3 rounded-xl text-center">
                                    <p className="text-lg font-bold text-slate-800">12</p>
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Total Hubs</p>
                                </div>
                                <div className="bg-slate-100 p-3 rounded-xl text-center">
                                    <p className="text-lg font-bold text-blue-600">Active</p>
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Status</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
