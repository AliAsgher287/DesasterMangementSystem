"use client";

import Link from "react-icons/fi";
import { useState } from "react";
import LinkNext from "next/link";
import Image from "next/image";
import { HiEnvelope, HiPhone, HiMapPin, HiChatBubbleLeftRight, HiShieldCheck } from "react-icons/hi2";
import { FiArrowRight, FiShield } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        toast.success("Thank you for your message. Our team will get back to you shortly.");
    };

    return (
        <main className="w-full bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans selection:bg-blue-100 selection:text-blue-600">
            {/* ================= NAVBAR ================= */}
            <header className="fixed top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-slate-100">
                <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4">
                    <LinkNext href="/landingPage" className="hover:opacity-80 transition-opacity">
                        <Image
                            src="/images/logo.png"
                            alt="Warm Hands Logo"
                            width={110}
                            height={35}
                            className="h-8 w-auto object-contain"
                            priority
                            unoptimized
                        />
                    </LinkNext>
                    <nav className="hidden lg:flex items-center gap-10 text-[13px] font-semibold uppercase tracking-widest md:flex">
                        <LinkNext href="/landingPage" className="text-slate-500 hover:text-blue-600 transition-colors">Home</LinkNext>
                        <LinkNext href="/about" className="text-slate-500 hover:text-blue-600 transition-colors">About</LinkNext>
                        <LinkNext href="/documentation" className="text-slate-500 hover:text-blue-600 transition-colors">Docs</LinkNext>
                        <LinkNext href="/authentication/login" className="px-6 py-2.5 bg-slate-900 text-white rounded-full hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all duration-300">
                            Log In
                        </LinkNext>
                    </nav>
                </div>
            </header>

            {/* ================= HERO SECTION ================= */}
            <section className="pt-32 pb-12 bg-white border-b border-slate-100">
                <div className="mx-auto max-w-4xl px-6 text-center">
                    <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black uppercase tracking-[0.2em] bg-blue-100 text-blue-700 rounded-full">
                        Warm Hands Support
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-4 font-heading">
                        Get in <span className="text-blue-600">Touch</span>
                    </h1>
                    <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto tracking-tight">
                        Connecting humanitarian hearts across Pakistan. Reach out for any inquiries or institutional support.
                    </p>
                </div>
            </section>

            {/* ================= CONTENT SECTION ================= */}
            <section className="py-20 flex-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10 -translate-y-1/2 translate-x-1/2" />

                <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-12 gap-12 items-start">

                    {/* Left: Pakistan Emergency Contacts */}
                    <div className="lg:col-span-5 bg-gradient-to-br from-red-500 to-rose-600 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl shadow-red-200 relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-16 h-16 bg-white shadow-xl shadow-red-900/10 rounded-3xl flex items-center justify-center text-3xl text-red-600">
                                    <FiShield />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black tracking-tight leading-none mb-1">Emergency</h2>
                                    <p className="text-red-100 text-xs font-bold uppercase tracking-widest opacity-80">Pakistan National Hotlines</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { title: "Police Emergency Hotline", number: "15", desc: "For immediate police intervention" },
                                    { title: "Rescue / Ambulance", number: "1122", desc: "For medical & disaster rescue" },
                                    { title: "Fire Brigade", number: "16", desc: "For fire related emergencies" },
                                    { title: "National Highway Police", number: "130", desc: "For highway-related help" },
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-[2rem] hover:bg-white/20 transition-all duration-300">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="font-bold text-lg">{item.title}</h3>
                                            <span className="text-2xl font-black tracking-tighter">{item.number}</span>
                                        </div>
                                        <p className="text-sm text-red-100 opacity-80">{item.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 bg-white/5 border border-white/10 p-6 rounded-3xl">
                                <p className="text-xs font-medium text-red-50 opacity-70 italic leading-relaxed">
                                    Notice: These are official Pakistan public service numbers. For platform-specific issues, please use the contact form or admin email provided.
                                </p>
                            </div>
                        </div>
                        <FiShield className="absolute -bottom-10 -right-10 text-[18rem] opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-700" />
                    </div>

                    {/* Right: Contact Form & Admin Info */}
                    <div className="lg:col-span-7 space-y-10 focus-within:z-10">
                        {/* Admin Contact Info Section */}
                        <div className="grid md:grid-cols-2 gap-6 pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-5 p-6 bg-white rounded-[2rem] border border-slate-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <HiEnvelope />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Official Email</p>
                                    <p className="text-[15px] font-bold text-slate-900 truncate">muhammadzohab44@gmail.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-5 p-6 bg-white rounded-[2rem] border border-slate-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
                                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-green-600 group-hover:text-white transition-all">
                                    <HiPhone />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Contact Number</p>
                                    <p className="text-[15px] font-bold text-slate-900">03445529287</p>
                                </div>
                            </div>
                        </div>

                        {/* Custom Form */}
                        <div className="bg-white p-8 md:p-14 rounded-[3rem] shadow-sm border border-slate-100 relative shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)]">
                            <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-4">
                                Contact Us <span className="w-12 h-1 bg-blue-600 rounded-full" />
                            </h2>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-800 ml-1">Your Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Zohab Ahmed"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 font-semibold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-800 ml-1">Institutional Email</label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="zohab@pakistan-aid.org"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 font-semibold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-800 ml-1">Message Subject</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-semibold"
                                    >
                                        <option>Organization Verification Inquiry</option>
                                        <option>Technical Platform Support</option>
                                        <option>Partnership/Donation Queries</option>
                                        <option>Report a Safety Violation</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-800 ml-1">What can we help you with?</label>
                                    <textarea
                                        required
                                        placeholder="Please provide as much detail as possible..."
                                        rows={5}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-5 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 font-semibold resize-none"
                                    />
                                </div>

                                <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-slate-900 transition-all shadow-[0_20px_40px_-12px_rgba(37,99,235,0.3)] hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-4">
                                    <HiChatBubbleLeftRight className="text-2xl" /> Send Request
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Subtle Footer */}
            <footer className="py-12 bg-slate-950 text-center rounded-t-[4rem] relative overflow-hidden">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-6 flex items-center justify-center gap-4">
                    <span className="w-8 h-[1px] bg-slate-800" />
                    Secure Coordination Infrastructure
                    <span className="w-8 h-[1px] bg-slate-800" />
                </p>
                <LinkNext href="/landingPage">
                    <Image src="/images/logo.png" alt="Warm Hands" width={100} height={30} className="h-6 w-auto brightness-0 invert opacity-40 mx-auto" unoptimized />
                </LinkNext>
                <p className="text-[11px] font-bold text-slate-700 mt-6 uppercase tracking-widest">© 2024 Warm Hands Resilience Network Pakistan</p>
            </footer>
        </main>
    );
}
