"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiLoader, FiAlertCircle, FiArrowLeft, FiMail, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSendOTP = async (e: React.FormEvent) => {
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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Failed to send OTP");

            setStep(2);
            toast.success("Verification code sent to your email!");
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message || "Failed to send OTP");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (otp.length !== 6) {
            toast.error("Please enter the 6-digit code");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/auth/verifyresetotp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Invalid verification code");

            setStep(3);
            toast.success("Code verified! You can now reset your password.");
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message || "Invalid or expired code");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/auth/resetpassword", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, password })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Failed to reset password");

            toast.success("Password reset successfully! Redirecting to login...");
            setTimeout(() => {
                window.location.href = "/authentication/login";
            }, 2000);
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message || "Failed to reset password");
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
                        <Image src="/images/logo.png" alt="Warm Hands Logo" width={110} height={35} className="h-8 w-auto object-contain" unoptimized priority />
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-4 pt-20 overflow-y-auto">
                <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] max-w-md w-full p-8 md:p-12 border border-slate-100 my-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 relative">
                            <Image src="/images/logo2.png" alt="Emblem" fill className="object-contain" priority />
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                            {step === 1 ? "Forgot Password" : step === 2 ? "Verify Identity" : "New Password"}
                        </h1>
                        <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest px-4">
                            {step === 1 ? "Start the secure recovery process" : step === 2 ? "Check your email for the code" : "Establish a new access key"}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-100 text-red-500 px-5 py-3 rounded-2xl text-[10px] font-black animate-shake flex items-center gap-3">
                            <FiAlertCircle className="flex-shrink-0 text-base text-red-400" />
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <form className="space-y-6" onSubmit={handleSendOTP}>
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative">
                                    <FiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="agent@org.global"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-300 font-bold shadow-inner-sm"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] hover:bg-slate-900 transition-all shadow-[0_20px_40px_-12px_rgba(37,99,235,0.3)] disabled:opacity-50"
                            >
                                {isLoading ? <FiLoader className="animate-spin mx-auto text-xl" /> : "Send Code"}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form className="space-y-6" onSubmit={handleVerifyOTP}>
                            <div className="space-y-2 text-center">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Verification Code</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                                    required
                                    placeholder="0 0 0 0 0 0"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-200 font-black text-center text-3xl tracking-[0.5em] shadow-inner-sm"
                                />
                                <p className="text-[10px] text-slate-400 font-bold mt-2 italic">A secure 6-digit code was sent to your email.</p>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                            >
                                {isLoading ? <FiLoader className="animate-spin mx-auto text-xl" /> : "Verify Identity"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-blue-600 transition-colors"
                            >
                                <FiArrowLeft className="inline mr-2" /> Change Email
                            </button>
                        </form>
                    )}

                    {step === 3 && (
                        <form className="space-y-6" onSubmit={handleResetPassword}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">New Access Key</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-900 font-bold shadow-inner-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Access Key</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-900 font-bold shadow-inner-sm"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] hover:bg-emerald-700 transition-all shadow-[0_20px_40px_-12px_rgba(16,185,129,0.3)] disabled:opacity-50"
                            >
                                {isLoading ? <FiLoader className="animate-spin mx-auto text-xl" /> : "Update Security Key"}
                            </button>
                        </form>
                    )}

                    <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                        <Link href="/authentication/login" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-[.2em] transition-colors">
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
