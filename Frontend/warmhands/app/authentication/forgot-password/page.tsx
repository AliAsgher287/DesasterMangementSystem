"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMail, FiArrowLeft, FiCheckCircle } from "react-icons/fi";

export default function Page() {
    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate sending email
        setEmailSent(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
            {/* Navbar */}
            <header className="w-full bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link href="/landingPage" className="flex items-center gap-2">
                        <Image
                            src="/images/logo.png"
                            alt="Warm Hands Logo"
                            width={120}
                            height={40}
                            className="h-8 w-auto"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm text-slate-600">
                        <Link href="/landingPage" className="hover:text-blue-600 transition-colors">
                            Home
                        </Link>
                        <Link href="/landingPage#about" className="hover:text-blue-600 transition-colors">
                            About
                        </Link>
                        <Link href="/landingPage#resources" className="hover:text-blue-600 transition-colors">
                            Resources
                        </Link>
                        <Link
                            href="/authentication/login"
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Contact Us
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 text-slate-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-12">
                    {!emailSent ? (
                        <>
                            {/* Header */}
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                    <FiMail className="text-3xl text-blue-600" />
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                    Forgot Password?
                                </h1>
                                <p className="text-sm text-slate-500 mt-3">
                                    No worries! Enter your email address and we'll send you a link to reset your password.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Address */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@organization.org"
                                        required
                                        className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                                >
                                    Send Reset Link
                                </button>

                                {/* Back to Login */}
                                <Link
                                    href="/authentication/login"
                                    className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors pt-2"
                                >
                                    <FiArrowLeft className="text-base" />
                                    Back to Login
                                </Link>
                            </form>
                        </>
                    ) : (
                        <>
                            {/* Success State */}
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                    <FiCheckCircle className="text-3xl text-green-600" />
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                    Check Your Email
                                </h1>
                                <p className="text-sm text-slate-500 mt-3 mb-8">
                                    We've sent a password reset link to <span className="font-semibold text-slate-700">{email}</span>.
                                    Please check your inbox and follow the instructions.
                                </p>

                                {/* Resend Button */}
                                <button
                                    onClick={() => setEmailSent(false)}
                                    className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-all text-sm sm:text-base mb-4"
                                >
                                    Didn't receive it? Resend
                                </button>

                                {/* Back to Login */}
                                <Link
                                    href="/authentication/login"
                                    className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors"
                                >
                                    <FiArrowLeft className="text-base" />
                                    Back to Login
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Footer Links */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-xs sm:text-sm text-slate-500 uppercase tracking-wide">
                        <Link href="/docs" className="hover:text-blue-600 transition-colors">
                            Documentation
                        </Link>
                        <Link href="/privacy" className="hover:text-blue-600 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/status" className="hover:text-blue-600 transition-colors">
                            System Status
                        </Link>
                    </div>

                    {/* Copyright */}
                    <div className="mt-6 text-center text-xs text-slate-400">
                        © 2024 Warm Hands Coordination Platform. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
