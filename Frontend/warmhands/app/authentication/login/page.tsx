"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiLoader, FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function Page() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setError("");

        // Manual Validation
        if (!email.trim() && !password.trim()) {
            toast.error("Please provide your access credentials");
            return;
        }
        if (!email.trim()) {
            toast.error("Institutional Email is required");
            return;
        }
        if (!password.trim()) {
            toast.error("Private Access Key is required");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Invalid credentials");
            }

            // Save session token
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("role", data.role);
            sessionStorage.setItem("name", data.name);
            sessionStorage.setItem("organizationName", data.organizationName || "");

            toast.success(`Welcome back, ${data.name}!`);

            // Redirect based on role
            setTimeout(() => {
                if (data.role === "superadmin") {
                    router.push("/superAdminDashboard");
                } else if (data.role === "admin") {
                    router.push("/organizationDashboard");
                } else {
                    router.push("/responderDashboard");
                }
            }, 1000);

        } catch (err: any) {
            setError(err.message);
            toast.error(err.message || "Failed to sign in");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            {/* Global Header */}
            <header className="fixed top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-slate-100">
                <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-3">
                    <Link href="/landingPage" className="hover:opacity-80 transition-all active:scale-95">
                        <Image
                            src="/images/logo.png"
                            alt="Warm Hands Logo"
                            width={110}
                            height={35}
                            className="h-8 w-auto object-contain"
                            unoptimized
                            priority
                        />
                    </Link>
                    <nav className="hidden lg:flex items-center gap-10">
                        <Link href="/landingPage" className="text-[11px] font-semibold text-slate-500 hover:text-blue-600 tracking-[0.2em] transition-all uppercase">
                            Home
                        </Link>
                        <Link href="/about" className="text-[11px] font-semibold text-slate-500 hover:text-blue-600 tracking-[0.2em] transition-all uppercase">
                            About
                        </Link>
                        <Link href="/documentation" className="text-[11px] font-semibold text-slate-500 hover:text-blue-600 tracking-[0.2em] transition-all uppercase">
                            Docs
                        </Link>
                        <div className="flex items-center gap-5 ml-4">
                            <Link href="/authentication/login" className="px-6 py-2.5 rounded-full border-2 border-slate-100 text-[11px] font-bold text-slate-900 hover:bg-slate-50 transition-all uppercase tracking-widest">
                                Sign in
                            </Link>
                            <Link href="/authentication/registration" className="px-6 py-3 bg-slate-900 text-white rounded-full text-[11px] font-bold hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest">
                                Register
                            </Link>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Main Content: Focused Card */}
            <main className="flex-1 flex items-center justify-center p-4 md:p-8 pt-16">
                <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] max-w-5xl w-full flex flex-col md:flex-row overflow-hidden min-h-[500px] border border-slate-100">

                    {/* Left Panel: Image with Card-Relative Overlay */}
                    <div className="md:w-[42%] relative overflow-hidden h-[300px] md:h-auto border-r border-slate-50">
                        <Image
                            src="/images/authentnticationpic.jpg"
                            alt="Humanitarian Coordination"
                            fill
                            className="object-cover scale-105 animate-slow-zoom"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />

                        {/* Internal Toggle Overlay */}
                        <div className="absolute bottom-10 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex items-center justify-between shadow-2xl">
                            <div>
                                <p className="text-white text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">
                                    New organization?
                                </p>
                                <p className="text-white text-sm font-semibold leading-tight">
                                    Join the humanitarian network
                                </p>
                            </div>
                            <Link
                                href="/authentication/registration"
                                className="bg-white text-blue-600 px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl"
                            >
                                Register
                            </Link>
                        </div>
                    </div>

                    {/* Right Panel: Form Content */}
                    <div className="md:w-[58%] p-8 md:p-12 flex flex-col justify-center">
                        {/* logo2.png Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 relative hover:scale-105 transition-transform duration-500">
                                <Image
                                    src="/images/logo2.png"
                                    alt="Institutional Emblem"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>

                        <div className="max-w-lg mx-auto w-full">
                            <div className="text-center mb-8">
                                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 font-heading tracking-tighter mb-2">
                                    Welcome Back
                                </h1>
                                <p className="text-slate-500 text-xs font-semibold flex items-center justify-center gap-3">
                                    <span className="w-8 h-[1.5px] bg-slate-200" />
                                    Secure Institutional Access Portal
                                    <span className="w-8 h-[1.5px] bg-slate-200" />
                                </p>
                            </div>

                            {/* Form */}
                            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                                {error && (
                                    <div className="bg-red-50 border border-red-100 text-red-500 px-6 py-4 rounded-2xl text-[11px] font-black animate-shake flex items-center gap-4">
                                        <FiAlertCircle className="flex-shrink-0 text-lg text-red-400" />
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-5">
                                    <div className="group space-y-2">
                                        <label className="block text-sm font-bold text-slate-800 ml-1 transition-colors group-focus-within:text-blue-600">
                                            Institutional Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            autoComplete="off"
                                            placeholder="agent@org.global"
                                            className={`w-full bg-slate-50 border ${submitted && !email ? 'border-red-500 ring-4 ring-red-500/5' : 'border-slate-100'} rounded-2xl px-6 py-4.5 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-300 font-semibold shadow-inner-sm`}
                                        />
                                    </div>

                                    <div className="group space-y-2">
                                        <div className="flex items-center justify-between ml-1">
                                            <label className="block text-sm font-bold text-slate-800 transition-colors group-focus-within:text-blue-600">
                                                Private Access Key
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-blue-600 font-black uppercase tracking-[0.1em] transition-colors"
                                            >
                                                {showPassword ? (
                                                    <><FiEyeOff /> Hide Key</>
                                                ) : (
                                                    <><FiEye /> Show Key</>
                                                )}
                                            </button>
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            autoComplete="current-password"
                                            placeholder="••••••••"
                                            className={`w-full bg-slate-50 border ${submitted && !password ? 'border-red-500 ring-4 ring-red-500/5' : 'border-slate-100'} rounded-2xl px-6 py-4.5 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-300 font-semibold shadow-inner-sm`}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-center pt-6">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full md:w-auto md:px-20 bg-blue-600 text-white py-5 rounded-2xl font-bold text-[15px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-[0_20px_40px_-12px_rgba(37,99,235,0.3)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 border-b-4 border-blue-800"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center gap-4">
                                                <FiLoader className="animate-spin" />
                                                Verifying
                                            </div>
                                        ) : (
                                            "Sign in"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            {/* Subtle Legal Footer */}
            <footer className="py-6 text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">
                © 2024 Warm Hands Logistics Infrastructure • Secure Encryption Active
            </footer>
        </div>
    );
}
