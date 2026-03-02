"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    HiBookOpen, HiCommandLine, HiMap, HiAcademicCap, HiRectangleStack,
    HiUserGroup, HiShieldCheck, HiOutlineMagnifyingGlass, HiCloudArrowUp,
    HiChevronRight, HiChevronLeft, HiBars3BottomLeft, HiXMark,
    HiHandThumbUp, HiHandThumbDown
} from "react-icons/hi2";

export default function DocumentationPage() {
    const [activeSection, setActiveSection] = useState("getting-started");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = [
        { id: "getting-started", title: "Getting Started", icon: <HiBookOpen /> },
        { id: "user-roles", title: "User Roles", icon: <HiUserGroup /> },
        { id: "inventory", title: "Resource Inventory", icon: <HiRectangleStack /> },
        { id: "matching", title: "AI Matching Logic", icon: <HiCloudArrowUp /> },
        { id: "protocols", title: "Emergency Protocols", icon: <HiShieldCheck /> },
        { id: "api", title: "API Reference", icon: <HiCommandLine /> },
    ];

    const content: Record<string, { title: string; subtitle: string; body: React.ReactNode }> = {
        "getting-started": {
            title: "Getting Started",
            subtitle: "Onboarding your organization to the resilience network.",
            body: (
                <div className="space-y-6">
                    <p>Welcome to <strong>Warm Hands</strong>. Our platform is designed to provide institutional-grade coordination during disaster response. To get started, follow these three essential steps:</p>
                    <div className="grid gap-4 mt-6">
                        {[
                            { step: "1", title: "Account Registration", text: "Register your agency, government office, or verified NGO. Select the role that best fits your operational scope." },
                            { step: "2", title: "Profile Verification", text: "Our Super Admins will review your documentation to ensure the security and integrity of the sharing network." },
                            { step: "3", title: "Initial Inventory", text: "Add your first set of resources—whether supplies, personnel, or logistics assets—to make them visible to the network." }
                        ].map(s => (
                            <div key={s.step} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                <span className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">{s.step}</span>
                                <div>
                                    <h4 className="font-semibold text-slate-900">{s.title}</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">{s.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        "user-roles": {
            title: "Platform Roles",
            subtitle: "Understanding the hierarchy and permissions system.",
            body: (
                <div className="space-y-6">
                    <p>Warm Hands uses a precise Permission-Based Access Control (PBAC) system to ensure data privacy and operational focus.</p>
                    <div className="space-y-4">
                        {[
                            { role: "Super Admin", color: "text-red-600 bg-red-50", desc: "Oversees the entire network. Can verify new organizations, manage all users, and view global resource heatmaps." },
                            { role: "Organization Admin", color: "text-blue-600 bg-blue-50", desc: "Manages their organization's inventory, assigns tasks to responders, and coordinates with other verified agencies." },
                            { role: "Signal Donor", color: "text-indigo-600 bg-indigo-50", desc: "Verified individuals who contribute personal resources (e.g., residential shelter, vehicles) to the community pool." },
                            { role: "Responder", color: "text-green-600 bg-green-50", desc: "Field specialists who receive tasks, report mission status, and coordinate logistics on the ground." }
                        ].map(r => (
                            <div key={r.role} className="p-6 border border-slate-100 rounded-2xl hover:border-blue-100/50 transition-colors">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3 ${r.color}`}>{r.role}</span>
                                <p className="text-slate-600 text-sm leading-relaxed">{r.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        "inventory": {
            title: "Resource Management",
            subtitle: "Tracking and categorizing institutional assets.",
            body: (
                <div className="space-y-6">
                    <p>Maintaining a clear "Common Operating Picture" starts with accurate inventory. Resources are divided into six critical categories:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {['Food & Water', 'Medical Kits', 'Shelter/Housing', 'Tools/Heavy Machinery', 'Personnel/Support', 'Specialized SOPs'].map(cat => (
                            <div key={cat} className="p-4 bg-slate-50 rounded-xl text-xs font-bold text-slate-700 border border-slate-100 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500" /> {cat}
                            </div>
                        ))}
                    </div>
                    <h4 className="font-semibold text-slate-900 mt-8 mb-2 italic">Standardized Reporting Protocol</h4>
                    <p className="text-sm text-slate-500">Every resource added must include a precise location, current stock count, and measurement unit (e.g., Kg, Liters, Boxes). This allows our AI to calculate dispatch feasibility based on travel distance and urgency.</p>
                </div>
            )
        },
        "matching": {
            title: "AI Matching Logic",
            subtitle: "How we coordinate cross-institutional sharing.",
            body: (
                <div className="space-y-6">
                    <p>The core of Warm Hands is our <strong>Real-Time Matching Engine</strong>. When a disaster occurs, our system automatically correlates available resources with reports from the ground.</p>
                    <div className="p-8 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="text-blue-400 font-semibold mb-4 flex items-center gap-2">Match Parameters:</h4>
                            <ul className="space-y-3 text-sm font-medium">
                                <li className="flex items-center gap-2 opacity-80"><HiChevronRight /> Proximity (km distance between stock and site)</li>
                                <li className="flex items-center gap-2 opacity-80"><HiChevronRight /> Resource Compatibility (e.g., Medical vs Trauma)</li>
                                <li className="flex items-center gap-2 opacity-80"><HiChevronRight /> Organization Capacity & Transport Lead Time</li>
                            </ul>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
                    </div>
                </div>
            )
        },
        "protocols": {
            title: "Emergency Protocols",
            subtitle: "Standard operating procedures for critical events.",
            body: (
                <div className="space-y-6">
                    <p>During an active crisis, the Super Admin can activate **Response Mode**. This triggers the following automated protocols:</p>
                    <ul className="space-y-4">
                        <li className="flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">!</div>
                            <p className="text-sm text-slate-600"><strong>Incident Alert:</strong> Automated notifications sent to all Organization Admins within a 50km radius.</p>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">T</div>
                            <p className="text-sm text-slate-600"><strong>Tasking:</strong> Admins can immediately assign Responders to verify ground-truth data or distribute supplies.</p>
                        </li>
                    </ul>
                </div>
            )
        },
        "api": {
            title: "API Reference",
            subtitle: "Integrate your existing stock software with Warm Hands.",
            body: (
                <div className="space-y-6">
                    <p>Our RESTful API allows for seamless integration. Use our endpoints to push status updates from your legacy ERP systems directly into the coordination network.</p>
                    <div className="bg-slate-50 p-6 rounded-2xl font-mono text-xs text-slate-700 overflow-x-auto border border-slate-100">
                        <p className="text-blue-600 font-bold mb-2">// Fetch available resources near coordinates</p>
                        <code>GET /api/v1/resources/nearby?lat=...&long=...&radius=50</code>
                        <div className="h-4" />
                        <p className="text-blue-600 font-bold mb-2">// Update organization stock count</p>
                        <code>PATCH /api/v1/resources/update/:id</code>
                    </div>
                </div>
            )
        }
    };

    const currentIndex = menuItems.findIndex(item => item.id === activeSection);
    const prevItem = currentIndex > 0 ? menuItems[currentIndex - 1] : null;
    const nextItem = currentIndex < menuItems.length - 1 ? menuItems[currentIndex + 1] : null;

    return (
        <main className="w-full bg-white text-slate-900 min-h-screen flex flex-col font-sans selection:bg-blue-100 selection:text-blue-600">
            {/* ================= NAVBAR ================= */}
            <header className="fixed top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-slate-100">
                <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? <HiXMark className="text-2xl" /> : <HiBars3BottomLeft className="text-2xl" />}
                        </button>
                        <Link href="/landingPage">
                            <Image src="/images/logo.png" alt="Warm Hands Logo" width={110} height={35} className="h-8 w-auto object-contain" unoptimized />
                        </Link>
                    </div>
                    <nav className="hidden lg:flex items-center gap-10 text-[13px] font-semibold uppercase tracking-widest">
                        <Link href="/landingPage" className="text-slate-500 hover:text-blue-600 transition-colors">Home</Link>
                        <Link href="/about" className="text-slate-500 hover:text-blue-600 transition-colors">About</Link>
                        <Link href="/documentation" className="text-blue-600 underline underline-offset-8 decoration-2 decoration-blue-600">Docs</Link>
                        <Link href="/authentication/login" className="px-6 py-2.5 bg-slate-900 text-white rounded-full hover:bg-blue-600 transition-all">
                            Log In
                        </Link>
                    </nav>
                </div>
            </header>

            <div className="pt-20 flex flex-1 max-w-[1440px] mx-auto w-full relative">
                {/* ================= SIDEBAR ================= */}
                <aside className={`
                    fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-100 pt-24 px-6 transition-transform duration-300 transform
                    lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    <div className="mb-10">
                        <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/50 mb-8">
                            <HiOutlineMagnifyingGlass className="text-slate-400" />
                            <input type="text" placeholder="Search docs..." className="bg-transparent border-none text-xs font-bold outline-none w-full placeholder:text-slate-400" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 px-3">Main Documentation</h3>
                        <nav className="space-y-1">
                            {menuItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveSection(item.id);
                                        setIsSidebarOpen(false);
                                    }}
                                    className={`
                                        w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                                        ${activeSection === item.id
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                                    `}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    {item.title}
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* ================= MAIN CONTENT ================= */}
                <main className="flex-1 p-6 md:p-12 lg:p-20 overflow-y-auto">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 text-blue-600 font-semibold text-[11px] uppercase tracking-[0.2em] mb-8">
                            <HiAcademicCap className="text-lg opacity-80" /> Documentation
                            <HiChevronRight className="text-slate-200" />
                            <span className="text-slate-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis">{menuItems.find(i => i.id === activeSection)?.title}</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-5 leading-tight">
                            {content[activeSection].title}
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 font-medium mb-16 leading-relaxed border-l-2 border-blue-500/20 pl-6 py-1">
                            {content[activeSection].subtitle}
                        </p>

                        <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-[1.8] font-medium tracking-wide">
                            {content[activeSection].body}
                        </div>

                        {/* Improved Documentation Navigation */}
                        <div className="mt-32 border-t border-slate-100">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-12">
                                {prevItem ? (
                                    <button
                                        onClick={() => setActiveSection(prevItem.id)}
                                        className="group p-6 bg-slate-50 hover:bg-white border border-slate-100 hover:border-blue-200 rounded-2xl transition-all text-left flex flex-col gap-2"
                                    >
                                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest group-hover:text-blue-500 transition-colors">
                                            <HiChevronLeft className="text-sm" /> Previous
                                        </div>
                                        <div className="text-slate-900 font-bold group-hover:text-blue-600 transition-colors">
                                            {prevItem.title}
                                        </div>
                                    </button>
                                ) : <div />}

                                {nextItem ? (
                                    <button
                                        onClick={() => setActiveSection(nextItem.id)}
                                        className="group p-6 bg-slate-50 hover:bg-white border border-slate-100 hover:border-blue-200 rounded-2xl transition-all text-right flex flex-col items-end gap-2"
                                    >
                                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest group-hover:text-blue-500 transition-colors">
                                            Next <HiChevronRight className="text-sm" />
                                        </div>
                                        <div className="text-slate-900 font-bold group-hover:text-blue-600 transition-colors">
                                            {nextItem.title}
                                        </div>
                                    </button>
                                ) : <div />}
                            </div>

                            {/* Polished Feedback Section */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-10 px-8 bg-blue-50/50 rounded-3xl border border-blue-100/30">
                                <div>
                                    <h4 className="text-slate-900 font-bold mb-1">Was this page helpful?</h4>
                                    <p className="text-slate-500 text-xs">Help us improve the response network guides.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all active:scale-95">
                                        <HiHandThumbUp className="text-sm" /> Yes
                                    </button>
                                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all active:scale-95">
                                        <HiHandThumbDown className="text-sm" /> No
                                    </button>
                                    <div className="h-4 w-px bg-slate-200 mx-2" />
                                    <Link href="/citizenHelp" className="text-xs font-bold text-blue-600 hover:text-blue-700 underline underline-offset-4">
                                        Need direct help?
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* ================= FOOTER ================= */}
            <footer className="bg-slate-50 border-t border-slate-100 mt-auto z-50 relative">
                <div className="mx-auto max-w-[1440px] px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <Image src="/images/logo.png" alt="Warm Hands" width={110} height={35} className="h-7 w-auto transition-all cursor-pointer" unoptimized />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Resilient Infrastructure for Disaster Coordination • v1.2.0</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        <Link href="/about" className="hover:text-blue-600 transition-colors">Mission</Link>
                        <Link href="/citizenHelp" className="hover:text-blue-600 transition-colors">Support</Link>
                        <Link href="#" className="hover:text-blue-600 transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-blue-600 transition-colors">Terms</Link>
                        <div className="flex items-center gap-2 text-emerald-500 font-black">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Systems Operational
                        </div>
                    </div>
                </div>
            </footer>

            {/* Backdrop for mobile menu */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </main>
    );
}
