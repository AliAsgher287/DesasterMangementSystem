"use client";

import Link from "next/link";
import Image from "next/image";
import { HiEnvelope, HiPhone, HiMapPin, HiChatBubbleLeftRight } from "react-icons/hi2";

export default function ContactPage() {
    return (
        <main className="w-full bg-white text-slate-900 min-h-screen flex flex-col">
            {/* ================= NAVBAR ================= */}
            <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur border-b">
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
                        <Link href="/authentication/login" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition shadow-sm">
                            Login
                        </Link>
                    </nav>
                </div>
            </header>

            {/* ================= CONTACT CONTENT ================= */}
            <section className="flex-1 py-16 md:py-24 bg-slate-50 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 -skew-x-12 transform translate-x-1/2 pointer-events-none" />

                <div className="mx-auto max-w-7xl px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                        {/* Left: Contact Form */}
                        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100">
                            <header className="mb-10">
                                <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Send us a Message</h1>
                                <p className="text-slate-500 font-medium">Have questions about joining the network? Our coordination team is ready to help.</p>
                            </header>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                                        <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="John" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                                        <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Doe" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Work Email</label>
                                    <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="john@organization.org" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                                        <option>Organization Registration</option>
                                        <option>Technical Support</option>
                                        <option>Partnership Inquiry</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                                    <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[150px]" placeholder="How can we assist your organization?" />
                                </div>

                                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transform active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                    <HiChatBubbleLeftRight className="text-xl" /> Send Message
                                </button>
                            </form>
                        </div>

                        {/* Right: Info */}
                        <div className="lg:pt-12">
                            <div className="space-y-12">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                        <span className="w-1.5 h-8 bg-blue-600 rounded-full" /> Contact Details
                                    </h2>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-5 group">
                                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 text-xl border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <HiEnvelope />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Us</p>
                                                <p className="font-bold text-slate-700">support@warmhands.org</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-5 group">
                                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 text-xl border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <HiPhone />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Call Our Hotline</p>
                                                <p className="font-bold text-slate-700">+1 (888) WARM-HANDS</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-5 group">
                                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 text-xl border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <HiMapPin />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Headquarters</p>
                                                <p className="font-bold text-slate-700">Geneva, Switzerland</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-lg overflow-hidden relative">
                                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                                    <h3 className="text-xl font-bold mb-4">Emergency Support?</h3>
                                    <p className="text-blue-100 mb-6 leading-relaxed">Verified responders can access a 24/7 priority line directly through the Responder Dashboard.</p>
                                    <Link href="/authentication/login" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-slate-50 transition shadow-md">Login to Responder Area</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className="bg-white border-t mt-auto py-10">
                <div className="mx-auto max-w-7xl px-6 text-center text-xs text-slate-400">
                    © 2024 Warm Hands Coordination Platform. Institutional Grade Humanitarian Tech.
                </div>
            </footer>
        </main>
    );
}
