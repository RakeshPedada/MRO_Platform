'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  Search,
  Menu,
  X,
  Sparkles,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');

  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          affiliation: affiliation,
          role: 'author',
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      setSuccessMsg('Account created successfully! Redirecting to author dashboard...');
      setTimeout(() => {
        router.push('/dashboard/author');
      }, 1200);
    } else {
      setLoading(false);
    }
  };

  const handleHeaderSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      router.push(`/articles?q=${encodeURIComponent(headerSearch.trim())}`);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/articles', label: 'Research Feed' },
    { href: '/community', label: 'Social Feed' },
    { href: '/community', label: 'Communities' },
    { href: '/editorial-board', label: 'Editorial Board' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      {/* 1. TOP NAVIGATION BAR */}
      <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#0b1b3d] text-white flex items-center justify-center font-bold text-xs tracking-wider font-mono shadow-xs group-hover:bg-[#1d63ed] transition">
              MRO
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-extrabold text-[#0b1b3d] tracking-tight leading-none">
                MANI Research Organization
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-normal mt-0.5">
                Multidisciplinary Open Science
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-medium text-slate-600">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="px-2.5 py-1.5 rounded-md hover:text-[#1d63ed] hover:bg-slate-50 transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Utility Strip */}
        <div className="flex items-center gap-3">
          {/* Integrated Search Bar */}
          <form
            onSubmit={handleHeaderSearchSubmit}
            className="relative hidden sm:block"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              id="header-search-bar"
              name="headerQuery"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder="Search papers, researchers..."
              autoComplete="off"
              suppressHydrationWarning
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-full w-44 md:w-56 lg:w-64 focus:w-72 focus:bg-white focus:border-[#1d63ed] outline-none transition-all placeholder:text-slate-400"
            />
          </form>

          {/* Login Link */}
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-600 hover:text-[#1d63ed] px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition"
          >
            Login
          </Link>

          {/* Solid Rounded Blue Register Button (Active) */}
          <Link
            href="/register"
            className="text-xs font-semibold bg-[#1d63ed] hover:bg-[#1554cf] text-white px-4 py-1.5 rounded-full shadow-xs transition"
          >
            Register
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 text-xs shadow-md">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-[#1d63ed]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* 2. MAIN LAYOUT: LEFT-ALIGNED AUTH CONTAINER + EXPANSIVE CANVAS */}
      <div className="flex-1 flex w-full relative">
        {/* Left-Aligned Auth Container (Flush against the left boundary) */}
        <div className="max-w-md w-full min-h-[calc(100vh-64px)] bg-white shadow-xl rounded-r-3xl p-8 md:p-10 flex flex-col justify-center border-r border-slate-200/80 z-10">
          {/* Centered Logo: MANI Research Organization Insignia Badge */}
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0b1b3d] to-[#1d63ed] text-white flex items-center justify-center shadow-md shadow-blue-500/20 font-serif font-black text-lg tracking-wider border border-blue-400/30">
              MRO
            </div>
          </div>

          {/* Title & Subtitle */}
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight text-center mt-3">
            Create Researcher Account
          </h1>
          <p className="text-xs text-slate-500 text-center mb-6">
            Join MANI Research Organization&apos;s open-access network
          </p>

          {/* Error & Success Messages */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg flex items-start gap-2">
              <span className="font-bold">Error:</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label
                htmlFor="register-fullName"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Full Name
              </label>
              <input
                id="register-fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                suppressHydrationWarning
                placeholder="Dr. Rajesh Pedada"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50/60 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#1d63ed] focus:border-transparent outline-none transition placeholder:text-slate-400"
              />
            </div>

            <div>
              <label
                htmlFor="register-affiliation"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Primary Affiliation
              </label>
              <input
                id="register-affiliation"
                name="affiliation"
                type="text"
                autoComplete="organization"
                required
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                suppressHydrationWarning
                placeholder="National Institute of Technology"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50/60 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#1d63ed] focus:border-transparent outline-none transition placeholder:text-slate-400"
              />
            </div>

            <div>
              <label
                htmlFor="register-email"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Institutional Email
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                suppressHydrationWarning
                placeholder="researcher@institution.edu"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50/60 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#1d63ed] focus:border-transparent outline-none transition placeholder:text-slate-400"
              />
            </div>

            <div>
              <label
                htmlFor="register-password"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Password
              </label>
              <input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                suppressHydrationWarning
                placeholder="Choose a strong password"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50/60 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#1d63ed] focus:border-transparent outline-none transition placeholder:text-slate-400"
              />
            </div>

            {/* Primary Button: Solid blue Create Account */}
            <button
              type="submit"
              disabled={loading}
              suppressHydrationWarning
              className="w-full py-2.5 bg-[#1d63ed] hover:bg-[#1554cf] text-white font-semibold text-sm rounded-lg shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer Link: Already have an account? Sign in here */}
          <p className="mt-6 text-center text-xs text-slate-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-[#1d63ed] font-semibold hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Right Expansive Scholarly Canvas */}
        <div className="flex-1 hidden lg:flex flex-col justify-center items-center p-12 text-center relative overflow-hidden bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]">
          {/* Subtle Watermark Grid & Circles */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0b1b3d_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="max-w-xl space-y-6 relative z-10">
            {/* Academic Capsule Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#1d63ed]" />
              <span>Multidisciplinary Open Science Platform</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl font-extrabold text-[#0b1b3d] tracking-tight font-serif leading-tight">
              Join the Global Community of Multidisciplinary Innovators
            </h2>

            {/* Sub-text */}
            <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
              Submit manuscripts, participate in double-blind peer evaluations, and publish your research open-access with international Crossref DOI indexing.
            </p>

            {/* Feature Stat Cards */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-xl p-3.5 shadow-xs text-left">
                <span className="block text-xl font-bold font-mono text-[#0b1b3d]">17</span>
                <span className="text-[11px] font-medium text-slate-500">Research Domains</span>
              </div>
              <div className="bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-xl p-3.5 shadow-xs text-left">
                <span className="block text-xl font-bold font-mono text-emerald-700">100%</span>
                <span className="text-[11px] font-medium text-slate-500">Double-Blind</span>
              </div>
              <div className="bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-xl p-3.5 shadow-xs text-left">
                <span className="block text-xl font-bold font-mono text-[#1d63ed]">CC BY 4.0</span>
                <span className="text-[11px] font-medium text-slate-500">Open Access</span>
              </div>
            </div>

            {/* Institutional Attribution Footer */}
            <p className="text-[11px] text-slate-400 pt-6">
              MANI Research Organization (MRO) &bull; Multidisciplinary Advanced Network for Innovation and Research Organization
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}