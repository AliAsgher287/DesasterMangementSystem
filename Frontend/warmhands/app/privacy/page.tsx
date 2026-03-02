"use client";

import Link from "next/link";
import Image from "next/image";
import { HiShieldCheck, HiLockClosed, HiEye, HiDocumentText } from "react-icons/hi2";

export default function PrivacyPage() {
    return (
        <main className="w-full bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans">
            {/* ================= NAVBAR ================= */}
            <header className="fixed top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-slate-100">
                <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4">
                    <Link href="/landingPage" className="hover:opacity-80 transition-opacity">
                        <Image
                            src="/images/logo.png"
                            alt="Warm Hands Logo"
                            width={110}
                            height={35}
                            className="h-8 w-auto object-contain"
                            priority
                            unoptimized
                        />
                    </Link>
                    <nav className="hidden lg:flex items-center gap-10 text-[13px] font-semibold uppercase tracking-widest md:flex">
                        <Link href="/landingPage" className="text-slate-500 hover:text-blue-600 transition-colors">Home</Link>
                        <Link href="/about" className="text-slate-500 hover:text-blue-600 transition-colors">About</Link>
                        <Link href="/documentation" className="text-slate-500 hover:text-blue-600 transition-colors">Docs</Link>
                        <Link href="/authentication/login" className="px-6 py-2.5 bg-slate-900 text-white rounded-full hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all duration-300">
                            Log In
                        </Link>
                    </nav>
                </div>
            </header>

            {/* ================= HERO SECTION ================= */}
            <section className="pt-32 pb-12 bg-white border-b border-slate-100">
                <div className="mx-auto max-w-4xl px-6 text-center">
                    <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black uppercase tracking-[0.2em] bg-blue-100 text-blue-700 rounded-full">
                        Warm Hands Legal
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                        Your data security is our highest priority. We handle coordination data with extreme care to maintain the integrity of our disaster response network.
                    </p>
                </div>
            </section>

            {/* ================= CONTENT SECTION ================= */}
            <section className="py-20 flex-1">
                <div className="mx-auto max-w-4xl px-6">
                    <div className="bg-white p-8 md:p-16 rounded-[2.5rem] shadow-sm border border-slate-100 mb-12">
                        <div className="prose prose-slate max-w-none">
                            <div className="flex items-start gap-6 mb-12">
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                                    <HiLockClosed />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Data Protection Commitment</h2>
                                    <p className="text-slate-600 leading-relaxed font-medium">At Warm Hands, we handle highly sensitive disaster coordination data. Our primary commitment is to ensure the security and privacy of the information shared by participating organizations.</p>
                                </div>
                            </div>

                            <header className="mb-10 text-slate-400 text-sm font-bold uppercase tracking-widest border-b border-slate-50 pb-4">
                                Section 1: Collection
                            </header>

                            <h3 className="text-xl font-bold text-slate-900 mb-4">What Information We Collect</h3>
                            <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                                We focus solely on institutional data necessary for humanitarian coordination. This includes:
                            </p>
                            <ul className="space-y-4 mb-12 list-none p-0">
                                {[
                                    "Organizational identifiers and institutional contact details",
                                    "Real-time resource inventory and status updates",
                                    "Logistical location data for coordination mapping",
                                    "System interaction logs for security auditing",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-600 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <header className="mb-10 text-slate-400 text-sm font-bold uppercase tracking-widest border-b border-slate-50 pb-4">
                                Section 2: Transparency
                            </header>

                            <div className="flex items-start gap-6 mb-12">
                                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                                    <HiEye />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Full Visibility</h2>
                                    <p className="text-slate-600 leading-relaxed font-medium">All data sharing within the network is strictly limited to verified humanitarian agencies. You maintain absolute control over which inventory items are visible to the network and which remained private to your organization.</p>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-4 text-center mt-12 mb-8 bg-blue-50 p-8 rounded-[2rem] border border-blue-100">
                                "We do not sell institutional data. Your infrastructure details are used solely to save lives."
                            </h3>

                            <header className="mb-10 text-slate-400 text-sm font-bold uppercase tracking-widest border-b border-slate-50 pb-4">
                                Section 3: Security Gear
                            </header>

                            <div className="flex items-start gap-6 mb-12">
                                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                                    <HiShieldCheck />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Enterprise-Grade Armor</h2>
                                    <p className="text-slate-600 leading-relaxed font-medium">We employ industry-standard AES-256 encryption at rest and TLS 1.3 in transit. Our architecture is designed to withstand high-stress environments, ensuring availability when it matters most.</p>
                                </div>
                            </div>

                            <div className="bg-slate-950 text-white p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                                    <HiDocumentText className="text-8xl" />
                                </div>
                                <h4 className="text-xl font-black mb-4 relative z-10">Data Portability & Erasure</h4>
                                <p className="text-slate-400 font-medium relative z-10">
                                    Verified organizations can request a full institutional data export or execute a "Right to be Forgotten" protocol at any time, which permanently wipes their record from our global registry.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center pb-20">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                            Official Warm Hands Logistics Protocol • Last Updated Feb 2024
                        </p>
                    </div>
                </div>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className="bg-slate-950 text-white rounded-t-[4rem] px-6 pt-24 pb-12 relative overflow-hidden">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/10 gap-8 text-center md:text-left">
                        <div>
                            <Link href="/landingPage">
                                <Image src="/images/logo.png" alt="Warm Hands" width={120} height={40} className="h-8 w-auto brightness-0 invert opacity-60 mx-auto md:mx-0" unoptimized />
                            </Link>
                            <p className="text-sm font-medium text-slate-500 mt-4">
                                © 2024 Warm Hands Resilience Project. All Rights Reserved.
                            </p>
                        </div>
                        <div className="flex gap-10 text-xs font-black uppercase tracking-widest text-slate-500">
                            <Link href="/landingPage" className="hover:text-blue-500 transition-colors">Home</Link>
                            <Link href="/about" className="hover:text-blue-500 transition-colors">About</Link>
                            <Link href="/documentation" className="hover:text-blue-500 transition-colors">Docs</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
