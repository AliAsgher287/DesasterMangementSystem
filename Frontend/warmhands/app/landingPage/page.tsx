"use client";

import Image from "next/image";
import Link from "next/link";
import { HiShieldCheck, HiRectangleStack, HiUserGroup } from "react-icons/hi2";

export default function HomePage() {
  return (
    <main className="w-full bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
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
              unoptimized
              priority
            />
          </Link>
          <nav className="hidden lg:flex items-center gap-10 text-[13px] font-semibold uppercase tracking-widest">
            <Link href="/about" className="text-slate-600 hover:text-blue-600 transition-colors">About</Link>
            <Link href="/citizenHelp" className="text-slate-600 hover:text-blue-600 transition-colors">Get Help</Link>
            <Link href="/contact" className="text-slate-600 hover:text-blue-600 transition-colors">Contact</Link>
            <Link href="/documentation" className="text-slate-600 hover:text-blue-600 transition-colors">Docs</Link>
            <div className="h-4 w-[1px] bg-slate-200" />
            <Link href="/authentication/login" className="text-slate-700 hover:text-blue-600 transition-colors">
              Login
            </Link>
            <Link href="/authentication/registration" className="rounded-full bg-slate-900 px-6 py-2.5 text-white hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 hover:scale-105 active:scale-95">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-slate-900">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/dashboardpic.jpg"
            alt="Warm Hands Backdrop"
            fill
            className="object-cover opacity-40 mix-blend-overlay scale-110 animate-slow-zoom"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/60 to-slate-900" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-[10px] font-black uppercase tracking-[0.2em] mb-10 animate-fade-in backdrop-blur-md">
            <span className="flex h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            Next-Gen Coordination
          </div>

          <h1 className="text-6xl font-black tracking-tighter text-white sm:text-8xl mb-6 font-heading leading-[0.9] text-balance">
            Intelligent Disaster <br />
            <span className="text-gradient drop-shadow-2xl">Coordination</span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-xl text-slate-300 leading-relaxed px-4 italic font-medium tracking-tight">
            Empowering NGOs and global relief agencies to synchronize logistics, track multi-point distributions, and reach those in need faster than ever.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link href="/authentication/registration" className="rounded-full bg-blue-600 px-10 py-5 text-lg font-black text-white hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/40 hover:-translate-y-1">
              Register Organization
            </Link>
            <Link href="/citizenHelp" className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-10 py-5 text-lg font-black text-white hover:bg-white/20 transition-all">
              Public Help Request
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">Unified Response. Decentralized Impact.</h2>
            <p className="mt-4 text-slate-500 max-w-2xl mx-auto italic">Engineered for institutional efficiency and high-stakes coordination.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: <HiShieldCheck />,
                title: "Verified Onboarding",
                desc: "Secure registration for NGOs and agencies ensures a trusted network for sensitive disaster data."
              },
              {
                icon: <HiRectangleStack />,
                title: "Multi-Point Logistics",
                desc: "Track supplies and distribution across multiple disaster zones with real-time field reporting."
              },
              {
                icon: <HiUserGroup />,
                title: "Smart Dispatching",
                desc: "AI-assisted matching pairs urgent public help requests with the nearest available organization."
              }
            ].map((feature, i) => (
              <div key={i} className="group relative bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100 hover:border-blue-200 transition-all hover:shadow-xl hover:-translate-y-2">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors rotate-3 group-hover:rotate-0">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 text-center">
            <div>
              <p className="text-4xl font-black text-blue-600 mb-1">500+</p>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Global Partners</p>
            </div>
            <div>
              <p className="text-4xl font-black text-blue-600 mb-1">10M+</p>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Resources Tracked</p>
            </div>
            <div>
              <p className="text-4xl font-black text-blue-600 mb-1">24/7</p>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Intelligence</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[3rem] px-8 py-20 text-center text-white shadow-2xl overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-blue-400/20 rounded-full blur-[60px] -translate-x-1/4 translate-y-1/4" />
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl font-black sm:text-5xl mb-6 leading-tight">
                Strengthening Global Resilience <br className="hidden sm:block" /> Through Coordination.
              </h2>
              <p className="mx-auto max-w-xl text-lg text-blue-50 font-medium mb-10 leading-relaxed">
                Join our network of elite responders. Deploy your resources with surgical precision and make every second count.
              </p>
              <Link href="/authentication/registration" className="inline-block rounded-full bg-white px-10 py-5 text-lg font-black text-blue-600 hover:bg-slate-100 transition-all shadow-xl shadow-blue-900/20 hover:scale-105 active:scale-95">
                Register Your Organization
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white pt-20 pb-10 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="max-w-xs">
              <Link href="/landingPage">
                <Image
                  src="/images/logo.png"
                  alt="Warm Hands"
                  width={140}
                  height={45}
                  className="h-8 w-auto mb-6"
                />
              </Link>
              <p className="text-sm text-slate-500 leading-relaxed">
                The world's leading institutional platform for disaster response synchronization and resource optimization.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-24">
              <div>
                <h4 className="font-black text-sm text-slate-900 uppercase tracking-widest mb-6 border-b border-blue-600 w-fit pb-1">Platform</h4>
                <ul className="space-y-4 text-sm text-slate-500 font-semibold">
                  <li><Link href="/about" className="hover:text-blue-600">Company</Link></li>
                  <li><Link href="/documentation" className="hover:text-blue-600">Documentation</Link></li>
                  <li><Link href="/status" className="hover:text-blue-600">System Status</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900 uppercase tracking-widest mb-6 border-b border-blue-600 w-fit pb-1">Action</h4>
                <ul className="space-y-4 text-sm text-slate-500 font-semibold">
                  <li><Link href="/citizenHelp" className="hover:text-blue-600">Get Help</Link></li>
                  <li><Link href="/authentication/registration" className="hover:text-blue-600">Register</Link></li>
                  <li><Link href="/authentication/login" className="hover:text-blue-600">Login</Link></li>
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <h4 className="font-black text-sm text-slate-900 uppercase tracking-widest mb-6 border-b border-blue-600 w-fit pb-1">Legal</h4>
                <ul className="space-y-4 text-sm text-slate-500 font-semibold">
                  <li><Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-blue-600">Terms of Use</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
              © 2024 Warm Hands Coordination Platform. Built for resilience.
            </p>
            <div className="flex gap-6 grayscale opacity-40">
              <div className="w-8 h-8 rounded-full bg-slate-200" />
              <div className="w-8 h-8 rounded-full bg-slate-200" />
              <div className="w-8 h-8 rounded-full bg-slate-200" />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
