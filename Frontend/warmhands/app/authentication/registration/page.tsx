"use client";

import { useState } from "react";
import { FiShield, FiStar, FiArrowRight, FiLock, FiAlertCircle, FiLoader, FiUsers, FiPackage } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  const [role, setRole] = useState<"admin" | "responder" | "donor">("admin");
  const [formData, setFormData] = useState({
    organizationName: "",
    name: "",
    email: "",
    password: "",
    location: "",
    contactNumber: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");

    // Manual Validation
    if (role !== 'donor' && !formData.organizationName.trim()) {
      toast.error("Organization Name is required");
      return;
    }
    if (!formData.location.trim()) {
      toast.error("Please provide your HQ Location");
      return;
    }
    if (!formData.name.trim()) {
      toast.error("Full Name is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Institutional Email is required");
      return;
    }
    if (!formData.password.trim()) {
      toast.error("Private Access Key is required");
      return;
    }
    if (!formData.contactNumber.trim()) {
      toast.error("Primary Contact Number is required");
      return;
    }

    setIsLoading(true);

    try {
      const registrationData = {
        ...formData,
        role
      };

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(registrationData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Redirect to login page - no automatic token storage
      toast.success("Enrollment Successful! Redirecting to Institutional Access Portal...");

      setTimeout(() => {
        router.push("/authentication/login");
      }, 2000);

    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || "Enrollment protocol failed");
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

      {/* Main Content: Focused Registration Card */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 pt-16">
        <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] max-w-6xl w-full flex flex-col md:flex-row overflow-hidden min-h-[600px] border border-slate-100">

          {/* Left Panel: Image with Card-Relative Overlay */}
          <div className="md:w-[40%] relative overflow-hidden h-[300px] md:h-auto border-r border-slate-50">
            <Image
              src="/images/authentnticationpic.jpg"
              alt="Social Coordination"
              fill
              className="object-cover scale-105 animate-slow-zoom"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />

            {/* Internal Toggle Overlay (Bottom of Image) */}
            <div className="absolute bottom-12 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex items-center justify-between shadow-2xl">
              <div>
                <p className="text-white text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">
                  Existing Member?
                </p>
                <p className="text-white text-sm font-semibold leading-tight">
                  Resume your operations
                </p>
              </div>
              <Link
                href="/authentication/login"
                className="bg-white text-blue-600 px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl"
              >
                Sign in
              </Link>
            </div>
          </div>

          {/* Right Panel: Registration Form */}
          <div className="md:w-[60%] p-8 md:p-12 overflow-y-auto max-h-[90vh] md:max-h-none flex flex-col justify-center">
            {/* logo2.png Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 relative hover:scale-105 transition-transform duration-500">
                <Image
                  src="/images/logo2.png"
                  alt="Institutional Emblem"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div className="max-w-3xl mx-auto w-full">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-slate-900 font-heading tracking-tighter mb-2">
                  Tell Us About Yourself!
                </h1>
                <p className="text-slate-500 text-sm font-semibold flex items-center justify-center gap-3">
                  <span className="w-8 h-[1.5px] bg-slate-300" />
                  Official Institutional Enrollment
                  <span className="w-8 h-[1.5px] bg-slate-300" />
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Organization Name */}
                  {role !== 'donor' && (
                    <div className="group space-y-1">
                      <label className="block text-sm font-bold text-slate-800 ml-1 transition-colors group-focus-within:text-blue-600">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleChange}
                        required
                        autoComplete="off"
                        placeholder="e.g. Red Cross"
                        className={`w-full bg-slate-50 border ${submitted && !formData.organizationName ? 'border-red-500 ring-4 ring-red-500/5' : 'border-slate-100'} rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-300 font-semibold shadow-inner-sm text-[15px]`}
                      />
                    </div>
                  )}

                  {/* Location */}
                  <div className="group space-y-1">
                    <label className="block text-sm font-bold text-slate-800 ml-1 transition-colors group-focus-within:text-blue-600">
                      HQ Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      autoComplete="off"
                      placeholder="City, Country"
                      className={`w-full bg-slate-50 border ${submitted && !formData.location ? 'border-red-500 ring-4 ring-red-500/5' : 'border-slate-100'} rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-300 font-semibold shadow-inner-sm text-[15px]`}
                    />
                  </div>

                  {/* Lead Name */}
                  <div className="group space-y-1">
                    <label className="block text-sm font-bold text-slate-800 ml-1 transition-colors group-focus-within:text-blue-600">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoComplete="off"
                      placeholder="Jane Cooper"
                      className={`w-full bg-slate-50 border ${submitted && !formData.name ? 'border-red-500 ring-4 ring-red-500/5' : 'border-slate-100'} rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-300 font-semibold shadow-inner-sm text-[15px]`}
                    />
                  </div>

                  {/* Email */}
                  <div className="group space-y-1">
                    <label className="block text-sm font-bold text-slate-800 ml-1 transition-colors group-focus-within:text-blue-600">
                      Institutional Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="off"
                      placeholder="jane@org.global"
                      className={`w-full bg-slate-50 border ${submitted && !formData.email ? 'border-red-500 ring-4 ring-red-500/5' : 'border-slate-100'} rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-300 font-semibold shadow-inner-sm text-[15px]`}
                    />
                  </div>

                  {/* Password */}
                  <div className="group space-y-1 md:col-span-2">
                    <label className="block text-sm font-bold text-slate-800 ml-1 transition-colors group-focus-within:text-blue-600">
                      Private Access Key
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className={`w-full bg-slate-50 border ${submitted && !formData.password ? 'border-red-500 ring-4 ring-red-500/5' : 'border-slate-100'} rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-300 font-semibold shadow-inner-sm text-[15px]`}
                    />
                  </div>

                  {/* Contact Number */}
                  <div className="group space-y-1 md:col-span-2">
                    <label className="block text-sm font-bold text-slate-800 ml-1 transition-colors group-focus-within:text-blue-600">
                      Primary Contact Number
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      required
                      autoComplete="off"
                      placeholder="+1 (555) 000-0000"
                      className={`w-full bg-slate-50 border ${submitted && !formData.contactNumber ? 'border-red-500 ring-4 ring-red-500/5' : 'border-slate-100'} rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-300 font-semibold shadow-inner-sm text-[15px]`}
                    />
                  </div>
                </div>

                {/* Role Designation */}
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm font-bold text-slate-800 mb-4 text-center">
                    Designated Functional Assignment
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { id: 'admin', label: 'Command Admin', desc: 'Strategy & teams.', icon: FiShield },
                      { id: 'responder', label: 'Field Responder', desc: 'Direct operations.', icon: FiStar },
                      { id: 'donor', label: 'Signal Donor', desc: 'Supply resources.', icon: FiPackage }
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id as any)}
                        className={`group relative rounded-xl p-4 border-2 transition-all text-left ${role === r.id
                          ? "border-blue-600 bg-blue-50/50 shadow-sm"
                          : "border-slate-100 bg-white hover:border-blue-200"
                          }`}
                      >
                        <r.icon className={`text-xl mb-1 transition-colors ${role === r.id ? 'text-blue-600' : 'text-slate-300 group-hover:text-slate-400'}`} />
                        <p className={`font-bold text-[11px] uppercase tracking-tighter ${role === r.id ? 'text-slate-900' : 'text-slate-500'}`}>
                          {r.label}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-semibold italic">{r.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex justify-center pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full md:w-auto md:px-16 bg-blue-600 text-white py-4 rounded-2xl font-bold text-[14px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 border-b-4 border-blue-800"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-4">
                        <FiLoader className="animate-spin" />
                        Processing
                      </div>
                    ) : (
                      "Enroll Account"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">
        © 2024 Warm Hands Network • Secure Enrollment Infrastructure
      </footer>
    </div>
  );
}
