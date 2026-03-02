"use client";

import Link from "next/link";
import Image from "next/image";
import { HiShieldCheck, HiOutlineExclamationTriangle, HiMiniUserGroup, HiOutlineLifebuoy } from "react-icons/hi2";
import { FiArrowRight } from "react-icons/fi";

export default function SafetyPage() {
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
                    <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black uppercase tracking-[0.2em] bg-orange-100 text-orange-700 rounded-full">
                        Warm Hands Safety Protocol
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-4">
                        Safety Guidance
                    </h1>
                    <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                        In disaster response, coordination is critical, but safety is paramount. Follow these institutional best practices to ensure secure operations.
                    </p>
                </div>
            </section>

            {/* ================= CONTENT SECTION ================= */}
            <section className="py-20 flex-1">
                <div className="mx-auto max-w-4xl px-6">
                    <div className="grid gap-8">
                        {/* Core Rules */}
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                            <div className="flex items-start gap-6 mb-8">
                                <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                                    <HiOutlineExclamationTriangle />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Institutional Safety First</h2>
                                    <p className="text-slate-600 leading-relaxed font-medium">Verify identifying credentials of all coordinating personnel. Warm Hands only facilitates the logistics; physical rendezvous and asset exchange must follow your organization's internal safety SOPs.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { title: "Verification of Assets", desc: "Always inspect physical resources upon arrival. Ensure medical supplies or food items are within expiration and undamaged before distribution." },
                                    { title: "Secure Communication", desc: "Use the internal task assignment system for all coordination. Avoid sharing private contact details on public channels." },
                                    { title: "Escalation Protocol", desc: "If any coordination request appears suspicious or violates humanitarian principles, report it immediately to the Super Admin." }
                                ].map((step, idx) => (
                                    <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <h4 className="font-black text-slate-900 mb-2 text-sm uppercase tracking-wider">{idx + 1}. {step.title}</h4>
                                        <p className="text-sm text-slate-600 font-medium leading-relaxed">{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Personel Guidance */}
                        <div className="bg-blue-600 p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-2xl">
                                        <HiMiniUserGroup />
                                    </div>
                                    <h2 className="text-2xl font-black tracking-tight">Field Responder Safety</h2>
                                </div>
                                <p className="text-blue-100 font-medium mb-8 max-w-lg leading-relaxed">
                                    Responders should always operate in teams of at least two. Ensure GPS tracking is enabled on the responder dashboard for real-time safety monitoring during active field reports.
                                </p>
                                <Link href="/documentation" className="inline-flex items-center gap-2 font-black text-xs uppercase tracking-widest bg-white text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
                                    View Detailed Deployment SOP <FiArrowRight />
                                </Link>
                            </div>
                            <HiMiniUserGroup className="absolute -bottom-8 -right-8 text-[12rem] opacity-10 rotate-12" />
                        </div>

                        {/* Support Block */}
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8">
                            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center text-4xl flex-shrink-0">
                                <HiOutlineLifebuoy />
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="text-xl font-black text-slate-900 mb-2">Emergency Assistance</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    Encountering an issue with the platform during an active disaster? Our response team is available 24/7 for institutional technical support.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center py-20">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                            Safety is a shared responsibility • Warm Hands Safety Guild
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
