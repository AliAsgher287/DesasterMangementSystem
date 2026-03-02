"use client";

import Link from "next/link";
import Image from "next/image";
import { HiCheckCircle, HiSignal, HiGlobeAlt, HiCpuChip } from "react-icons/hi2";

export default function StatusPage() {
    const services = [
        { name: "Resource Matching API", status: "Operational", uptime: "99.98%" },
        { name: "Global Database", status: "Operational", uptime: "100%" },
        { name: "Notification Engine", status: "Operational", uptime: "99.95%" },
        { name: "Auth Service", status: "Operational", uptime: "99.99%" },
    ];

    return (
        <main className="w-full bg-slate-50 text-slate-900 min-h-screen flex flex-col">
            {/* ================= NAVBAR ================= */}
            <header className="sticky top-0 z-50 w-full bg-white border-b">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
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
                    <nav className="hidden items-center gap-8 text-sm md:flex">
                        <Link href="/landingPage" className="text-slate-600 hover:text-blue-600 transition-colors">Home</Link>
                        <Link href="/about" className="text-slate-600 hover:text-blue-600 transition-colors">About</Link>
                        <Link href="/documentation" className="text-slate-600 hover:text-blue-600 transition-colors">Documentation</Link>
                    </nav>
                </div>
            </header>

            {/* ================= STATUS CONTENT ================= */}
            <section className="flex-1 py-16 px-6">
                <div className="mx-auto max-w-3xl">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 mb-12 flex items-center justify-between shadow-sm">
                        <div>
                            <h1 className="text-2xl font-extrabold text-emerald-900 flex items-center gap-2">
                                <HiCheckCircle /> All Systems Operational
                            </h1>
                            <p className="text-emerald-700 mt-1">Status as of February 9, 2024 at 14:18 GMT</p>
                        </div>
                        <div className="hidden md:block">
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-emerald-800 text-sm font-bold animate-pulse">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Live
                            </div>
                        </div>
                    </div>

                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 ml-4">System Components</h2>
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-12">
                        {services.map((service, idx) => (
                            <div key={idx} className={`p-6 flex items-center justify-between ${idx !== services.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                <div className="font-semibold text-slate-700">{service.name}</div>
                                <div className="flex items-center gap-8">
                                    <div className="text-xs text-slate-400 hidden sm:block">Uptime: {service.uptime}</div>
                                    <div className="text-emerald-600 text-sm font-bold">{service.status}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                            <div className="text-slate-400 text-2xl mb-2 flex justify-center"><HiSignal /></div>
                            <div className="text-2xl font-bold font-mono text-slate-800">14ms</div>
                            <div className="text-xs uppercase font-bold text-slate-400 mt-1">Latency</div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                            <div className="text-slate-400 text-2xl mb-2 flex justify-center"><HiGlobeAlt /></div>
                            <div className="text-2xl font-bold font-mono text-slate-800">6</div>
                            <div className="text-xs uppercase font-bold text-slate-400 mt-1">Global Regions</div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                            <div className="text-slate-400 text-2xl mb-2 flex justify-center"><HiCpuChip /></div>
                            <div className="text-2xl font-bold font-mono text-slate-800">Normal</div>
                            <div className="text-xs uppercase font-bold text-slate-400 mt-1">CPU Load</div>
                        </div>
                    </div>

                    <Link href="/landingPage" className="block text-center text-blue-600 font-bold hover:underline">
                        Return to Dashboard
                    </Link>
                </div>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className="bg-white border-t mt-auto py-10">
                <div className="mx-auto max-w-7xl px-6 text-center text-xs text-slate-400">
                    Powered by Warm Hands Reliability Engineering Team
                </div>
            </footer>
        </main>
    );
}
