"use client";

import Link from "next/link";
import Image from "next/image";
import { HiShieldCheck, HiLockClosed, HiEye, HiDocumentText } from "react-icons/hi2";

export default function PrivacyPage() {
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

            {/* ================= CONTENT ================= */}
            <section className="flex-1 py-16 md:py-24 bg-slate-50">
                <div className="mx-auto max-w-4xl px-6 bg-white p-8 md:p-16 rounded-3xl shadow-sm border border-slate-100">
                    <header className="mb-12 border-b border-slate-100 pb-8">
                        <div className="text-blue-600 text-sm font-bold uppercase mb-2 flex items-center gap-2">
                            <HiShieldCheck /> Legal & Compliance
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Privacy Policy</h1>
                        <p className="text-slate-500">Last updated: February 9, 2024</p>
                    </header>

                    <div className="prose prose-slate max-w-none">
                        <div className="flex items-start gap-4 mb-10">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl text-xl mt-1">
                                <HiLockClosed />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold mb-2">Data Protection Commitment</h2>
                                <p className="text-slate-600">At Warm Hands, we handle highly sensitive disaster coordination data. Our primary commitment is to ensure the security and privacy of the information shared by participating organizations.</p>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold mb-4">1. Information We Collect</h3>
                        <p className="text-slate-600 mb-6">We collect institutional data necessary for disaster coordination, including organization name, contact person details, resource inventory lists, and real-time location data for logistics optimization. We do not sell this data to third parties.</p>

                        <div className="flex items-start gap-4 mb-10">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl text-xl mt-1">
                                <HiEye />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold mb-2">Transparency</h2>
                                <p className="text-slate-600">All data sharing within the network is visible to participating verified agencies. You have full control over what inventory is shared and with whom.</p>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold mb-4">2. AI and Data Processing</h3>
                        <p className="text-slate-600 mb-6">Our AI algorithms process resource data to find matches and optimize delivery routes. This processing happens in a secured, encrypted environment and is used solely for humanitarian relief purposes.</p>

                        <h3 className="text-lg font-bold mb-4">3. Security Measures</h3>
                        <p className="text-slate-600 mb-6 font-medium bg-blue-50 p-4 rounded-xl border border-blue-100">
                            We employ industry-standard AES-256 encryption for data at rest and TLS 1.3 for data in transit. Regular security audits are conducted to ensure the integrity of the disaster coordination network.
                        </p>

                        <div className="flex items-start gap-4 mb-10 mt-12">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl text-xl mt-1">
                                <HiDocumentText />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold mb-2">Your Rights</h2>
                                <p className="text-slate-600">Organizations can request a full export of their data or permanent deletion of their account and all associated inventory history at any time.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className="bg-white border-t mt-auto">
                <div className="mx-auto max-w-7xl px-6 py-10 text-center text-slate-400">
                    <p className="text-xs">
                        © 2024 Warm Hands Project. Built for institutional disaster resilience.
                    </p>
                </div>
            </footer>
        </main>
    );
}
