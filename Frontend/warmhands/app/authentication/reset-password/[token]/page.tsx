"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiLoader, FiAlertCircle, FiLock, FiCheckCircle, FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = use(params);
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!password.trim()) {
            toast.error("Please enter a new password");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:5000/api/auth/resetpassword/${token}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Reset failed. Your link may have expired.");
            }

            setIsSuccess(true);
            toast.success("Security access restored! Redirecting to login...");

            setTimeout(() => {
                router.push("/authentication/login");
            }, 3000);

        } catch (err: any) {
            setError(err.message);
            toast.error(err.message || "Failed to reset password");
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

                    {!isSuccess ? (
                        <>
                            <div className="text-center mb-10">
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tighter mb-3">
                                    Restore Access
                                </h1>
                                <p className="text-slate-500 text-xs font-semibold px-4 italic leading-relaxed">
                                    Security protocol initiated. Please choose a high-strength access key to secure your institution.
                                </p>
                            </div>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {error && (
                                    <div className="bg-red-50 border border-red-100 text-red-500 px-6 py-4 rounded-2xl text-[11px] font-black animate-shake flex items-center gap-4">
                                        <FiAlertCircle className="flex-shrink-0 text-lg text-red-400" />
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-5">
                                    <div className="group space-y-2">
                                        <div className="flex justify-between items-center ml-1">
                                            <label className="block text-sm font-bold text-slate-800">
                                                New Access Key
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="text-[10px] text-slate-400 hover:text-blue-600 font-extrabold uppercase tracking-widest"
                                            >
                                                {showPassword ? <FiEyeOff /> : <FiEye />}
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <FiLock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                placeholder="••••••••"
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4.5 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-300 font-semibold shadow-inner-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="group space-y-2">
                                        <label className="block text-sm font-bold text-slate-800 ml-1">
                                            Confirm New Access Key
                                        </label>
                                        <div className="relative">
                                            <FiLock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                placeholder="••••••••"
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4.5 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-300 font-semibold shadow-inner-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-[14px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 border-b-4 border-slate-700 hover:border-blue-800"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-4">
                                            <FiLoader className="animate-spin" />
                                            Syncing Key
                                        </div>
                                    ) : (
                                        "Finalize Restoration"
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100 animate-bounce">
                                <FiCheckCircle className="text-3xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Restored</h2>
                            <p className="text-slate-500 text-sm font-medium mb-8">
                                Your account security has been updated successfully. Proceeding to authentication portal...
                            </p>
                            <div className="w-8 h-1 bg-emerald-500 mx-auto rounded-full animate-pulse" />
                        </div>
                    )}
                </div>
            </main>

            <footer className="py-6 text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">
                © 2024 Warm Hands Logistics Infrastructure • Adaptive Security Protocol
            </footer>
        </div>
    );
}
