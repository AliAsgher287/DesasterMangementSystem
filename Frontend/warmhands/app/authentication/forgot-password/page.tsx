"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiLoader, FiAlertCircle, FiArrowLeft, FiMail, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
            toast.error("Please enter your email address");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/auth/forgotpassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to process request");
            }

            setIsSent(true);
            toast.success("Reset link sent! Please check your email inbox.");
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message || "Failed to send reset link");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            {/* Header */}
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
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-4 pt-20">
                <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] max-w-md w-full p-8 md:p-12 border border-slate-100">
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 relative">
                            <Image
                                src="/images/logo2.png"
                                alt="Emblem"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    {!isSent ? (
                        <>
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tighter mb-3">
                                    Reset Password
                                </h1>
                                <p className="text-slate-500 text-xs font-semibold px-4 italic">
                                    Enter the institutional email associated with your account and we'll send a secure reset link.
                                </p>
                            </div>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {error && (
                                    <div className="bg-red-50 border border-red-100 text-red-500 px-6 py-4 rounded-2xl text-[11px] font-black animate-shake flex items-center gap-4">
                                        <FiAlertCircle className="flex-shrink-0 text-lg text-red-400" />
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-800 ml-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <FiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            placeholder="agent@org.global"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4.5 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-300 font-semibold shadow-inner-sm"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-[14px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50 border-b-4 border-blue-800"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-4">
                                            <FiLoader className="animate-spin" />
                                            Authorizing
                                        </div>
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                                <FiCheckCircle className="text-3xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Email Dispatched</h2>
                            <p className="text-slate-500 text-sm font-medium mb-8">
                                A secure transmission was sent to <strong>{email}</strong>. Please follow the instructions to reset your access key.
                            </p>
                            <button
                                onClick={() => setIsSent(false)}
                                className="text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline"
                            >
                                Didn't receive it? Try again
                            </button>
                        </div>
                    )}

                    <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                        <Link
                            href="/authentication/login"
                            className="inline-flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors"
                        >
                            <FiArrowLeft /> Back to Security Portal
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="py-6 text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">
                © 2024 Warm Hands Logistics Infrastructure • High Precision Security
            </footer>
        </div>
    );
}
