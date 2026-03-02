"use client";

import Link from "next/link";
import Image from "next/image";
import { HiShieldCheck, HiOutlineCheckBadge, HiOutlineClipboardDocumentCheck, HiOutlineScale } from "react-icons/hi2";
import { FiArrowRight } from "react-icons/fi";

export default function VerificationPage() {
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
                    <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black uppercase tracking-[0.2em] bg-indigo-100 text-indigo-700 rounded-full">
                        Warm Hands Trust Network
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-4">
                        Verification Process
                    </h1>
                    <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                        We maintain a "Verified-Only" network to ensure that every resource shared is legitimate and every coordinating organization is genuine.
                    </p>
                </div>
            </section>

            {/* ================= CONTENT SECTION ================= */}
            <section className="py-20 flex-1">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        {/* Process Steps */}
                        <div className="space-y-8">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">How we vet institutions</h2>
                            <div className="space-y-6">
                                {[
                                    {
                                        icon: <HiOutlineClipboardDocumentCheck />,
                                        title: "Documentation Review",
                                        desc: "Organizations must provide valid registration credentials and humanitarian certificates for their respective jurisdictions."
                                    },
                                    {
                                        icon: <HiShieldCheck />,
                                        title: "Manual Sovereignty Check",
                                        desc: "Our Super Admin team manually reviews each application to confirm the institutional identity and past disaster response history."
                                    },
                                    {
                                        icon: <HiOutlineCheckBadge />,
                                        title: "Network Induction",
                                        desc: "Once verified, organizations receive their Institutional Access Key and are granted permission to add resources to the global inventory."
                                    }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-6 p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                                            {step.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                                            <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quality Assurance */}
                        <div className="bg-slate-900 p-10 md:p-14 rounded-[3rem] text-white sticky top-32">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl">
                                    <HiOutlineScale />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight">Our Guarantee</h3>
                            </div>
                            <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10">
                                The "Verified" badge isn't just a label; it's a promise to the network. It means the organization has been background-checked for humanitarian compliance and technical integrity.
                            </p>
                            <ul className="space-y-6 mb-12">
                                {[
                                    "Anti-waste resource logic",
                                    "Verified institutional emails only",
                                    "Real-time location audits",
                                    "Super-admin oversight of all trades"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 font-bold text-blue-400">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/authentication/registration" className="block w-full text-center py-4 bg-white text-slate-950 font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 hover:text-white transition-all">
                                Start Enrollment
                            </Link>
                        </div>
                    </div>

                    <div className="text-center py-24">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                            Built for Trust • Warm Hands Global Verification Standard
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
