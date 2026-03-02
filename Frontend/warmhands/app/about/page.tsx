"use client";

import Link from "next/link";
import Image from "next/image";
import { HiShieldCheck, HiUserGroup, HiRocketLaunch, HiHeart, HiGlobeAmericas, HiLightBulb } from "react-icons/hi2";
import { FiArrowRight } from "react-icons/fi";

export default function AboutPage() {
    return (
        <main className="w-full bg-white text-slate-900 min-h-screen flex flex-col font-sans selection:bg-blue-100 selection:text-blue-600 overflow-x-hidden">
            {/* ================= NAVBAR ================= */}
            <header className="fixed top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-slate-100 transition-all">
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
                        <Link href="/about" className="text-blue-600 underline underline-offset-8 decoration-2 decoration-blue-600">About</Link>
                        <Link href="/contact" className="text-slate-500 hover:text-blue-600 transition-colors">Contact</Link>
                        <Link href="/documentation" className="text-slate-500 hover:text-blue-600 transition-colors">Docs</Link>
                        <Link href="/authentication/login" className="px-6 py-2.5 bg-slate-900 text-white rounded-full hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all duration-300">
                            Log In
                        </Link>
                    </nav>
                </div>
            </header>

            {/* ================= HERO SECTION ================= */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10" />

                <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black uppercase tracking-[0.2em] bg-blue-100 text-blue-700 rounded-full">
                            Our Mission & Values
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-8">
                            Humanity, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 italic">amplified by technology.</span>
                        </h1>
                        <p className="text-xl text-slate-500 leading-relaxed mb-10 max-w-lg">
                            Warm Hands isn’t just a tool; it’s a global bridge. We connect verified organizations to ensure that no resource goes to waste when lives are on the line.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/authentication/registration" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 transition-all flex items-center gap-3">
                                Join the Network <FiArrowRight className="text-lg" />
                            </Link>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 relative">
                        <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-900/10 rotate-2 group transition-transform duration-700 hover:rotate-0">
                            <Image
                                src="/images/aboutus.png"
                                alt="Disaster Response Specialists"
                                width={800}
                                height={600}
                                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                                priority
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent pointer-events-none" />
                        </div>
                        {/* Decorative floating elements */}
                        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl z-20 border border-slate-100 animate-bounce-slow">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                                    <HiShieldCheck className="text-2xl" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase">Status</p>
                                    <p className="text-sm font-bold text-slate-900">Verified Secure</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= CORE VISION ================= */}
            <section className="py-24 bg-slate-50/50">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-6">Built to solve the "Supply Chain Gap"</h2>
                        <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full mb-8" />
                        <p className="text-lg text-slate-500 font-medium">
                            We believe that in disaster relief, efficiency equals survival. Our platform replaces fragmented spreadsheets with a synchronized ecosystem.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <HiGlobeAmericas />,
                                title: "Global Reach",
                                desc: "Connecting local NGOs with international aid organizations seamlessly across borders.",
                                color: "bg-blue-50 text-blue-600"
                            },
                            {
                                icon: <HiRocketLaunch />,
                                title: "Instant Dispatch",
                                desc: "Match critical resources to areas of need in real-time using our intelligent lookup system.",
                                color: "bg-purple-50 text-purple-600"
                            },
                            {
                                icon: <HiHeart />,
                                title: "Human Centered",
                                desc: "We simplify the logistics so you can focus on the people who need your help the most.",
                                color: "bg-red-50 text-red-600"
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group">
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform ${item.color}`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
                                <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= STORY SECTION ================= */}
            <section className="py-24 md:py-32">
                <div className="mx-auto max-w-5xl px-6 text-center">
                    <div className="inline-block p-4 bg-indigo-50 rounded-full mb-8 text-indigo-600">
                        <HiLightBulb className="text-4xl" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-10 leading-[1.2]">
                        Our Story Started with a Single Question: <br />
                        <span className="text-slate-400">"Why is aid still trapped in silos?"</span>
                    </h2>
                    <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-loose mx-auto">
                        <p className="mb-8">
                            Warm Hands was born from the observation that during crises, the world doesn't lack resources—it lacks the coordination to move them. We saw verified organizations sitting on excess supplies while nearby centers struggled with shortages.
                        </p>
                        <p className="mb-12">
                            We leveraged intelligent data matching to create a platform where institutions can share inventory in real-time, reducing waste and amplifying the impact of every donation. Today, Warm Hands powers the coordination layer for disaster resilience, ensuring that when humanity reaches out, the right "hands" are always there to meet the need.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-slate-100">
                        {[
                            { label: "Founded", val: "2024" },
                            { label: "Network", val: "Verified Only" },
                            { label: "Motive", val: "Life/Death" },
                            { label: "Logic", val: "AI Driven" }
                        ].map((s, idx) => (
                            <div key={idx}>
                                <p className="text-4xl font-black text-blue-600 mb-1 tracking-tighter">{s.val}</p>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className="bg-slate-950 text-white rounded-t-[4rem] px-6 pt-24 pb-12 mt-auto relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

                <div className="mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-2 gap-16 mb-20 items-center">
                        <div>
                            <h2 className="text-5xl font-black tracking-tighter mb-6">Ready to join the <span className="text-blue-500 italic">resilience network?</span></h2>
                            <p className="text-slate-400 text-lg mb-8 max-w-md">Join over a hundred verified organizations making the world a safer place through coordination.</p>
                            <Link href="/authentication/registration" className="inline-flex h-14 items-center justify-center rounded-2xl bg-white px-8 text-sm font-black text-slate-950 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/5">
                                Register Now
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Navigation</p>
                                <nav className="flex flex-col gap-3 font-bold text-sm">
                                    <Link href="/landingPage" className="text-slate-300 hover:text-white transition-colors">Home</Link>
                                    <Link href="/about" className="text-white">About Us</Link>
                                    <Link href="/documentation" className="text-slate-300 hover:text-white transition-colors">Documentation</Link>
                                </nav>
                            </div>
                            <div className="space-y-4">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Platform</p>
                                <nav className="flex flex-col gap-3 font-bold text-sm">
                                    <Link href="/privacy" className="text-slate-300 hover:text-white transition-colors">Privacy Policy</Link>
                                    <Link href="/safety" className="text-slate-300 hover:text-white transition-colors">Safety Guides</Link>
                                    <Link href="/verification" className="text-slate-300 hover:text-white transition-colors">Verification Process</Link>
                                </nav>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/10 gap-8">
                        <Link href="/landingPage">
                            <Image src="/images/logo.png" alt="Warm Hands" width={120} height={40} className="h-8 w-auto brightness-0 invert opacity-60" unoptimized />
                        </Link>
                        <p className="text-sm font-medium text-slate-500">
                            © 2024 Warm Hands Resilience Project. All Rights Reserved.
                        </p>
                        <div className="flex gap-6">
                            {/* Social Icons Placeholder */}
                            <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition-colors" />
                            <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition-colors" />
                            <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition-colors" />
                        </div>
                    </div>
                </div>
            </footer>

            <style jsx global>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 4s ease-in-out infinite;
                }
                .text-transparent {
                    -webkit-background-clip: text;
                }
            `}</style>
        </main>
    );
}
