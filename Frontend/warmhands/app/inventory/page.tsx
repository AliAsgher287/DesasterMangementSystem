"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiSearch, FiPlus, FiArrowDown, FiCheckCircle, FiBox, FiPackage, FiTruck, FiActivity } from "react-icons/fi";

export default function InventoryPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const inventoryItems = [
        { id: 1, name: "Surgical Masks", cat: "Medical", qty: 4500, unit: "Boxes", status: "In Stock" },
        { id: 2, name: "Drinking Water", cat: "Supplies", qty: 12000, unit: "Liters", status: "Critical" },
        { id: 3, name: "Portable Generators", cat: "Energy", qty: 25, unit: "Units", status: "In Stock" },
        { id: 4, name: "Canned Food Packs", cat: "Food", qty: 850, unit: "Packs", status: "Low" },
        { id: 5, name: "Mobile Radios", cat: "Comms", qty: 120, unit: "Units", status: "In Stock" },
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
                        <Link href="/resource-map" className="text-sm text-slate-600 hover:text-blue-600">Map</Link>
                        <Link href="/inventory" className="text-sm text-blue-600 font-bold">Inventory</Link>
                        <Link href="/resourceRequest" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">New Request</Link>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900">Inventory Management</h1>
                        <p className="text-slate-500 mt-1 uppercase text-xs font-bold tracking-widest">Real-time resource level tracking</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50">
                            <FiCheckCircle /> Mark All Checked
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-md">
                            <FiPlus /> Add Inventory
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 text-xl"><FiPackage /></div>
                        <p className="text-2xl font-black text-slate-900">1,248</p>
                        <p className="text-xs font-bold text-slate-400 uppercase">Total Categories</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mb-4 text-xl"><FiActivity /></div>
                        <p className="text-2xl font-black text-slate-900">14</p>
                        <p className="text-xs font-bold text-slate-400 uppercase">Critical Low Stock</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4 text-xl"><FiTruck /></div>
                        <p className="text-2xl font-black text-slate-900">82%</p>
                        <p className="text-xs font-bold text-slate-400 uppercase">Supply Fulfillment</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4 text-xl"><FiBox /></div>
                        <p className="text-2xl font-black text-slate-900">CHF 45k</p>
                        <p className="text-xs font-bold text-slate-400 uppercase">Inventory Value</p>
                    </div>
                </div>

                {/* Table Controls */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search resources by name or category..."
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-500 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase">Sort by:</span>
                            <button className="px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-1 border border-slate-200">
                                Quantity <FiArrowDown />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Resource Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Stock Level</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {inventoryItems.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900">{item.name}</p>
                                            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">ID-{item.id}2024</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-slate-100 rounded-md text-[10px] uppercase font-black text-slate-500">{item.cat}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <p className="font-black text-slate-800">{item.qty.toLocaleString()}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{item.unit}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600' :
                                                    item.status === 'Critical' ? 'bg-red-50 text-red-600 animate-pulse' :
                                                        'bg-orange-50 text-orange-600'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-sm">Update</button>
                                                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm">Report</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-400 font-medium">Viewing 5 of 1,248 inventory records</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
