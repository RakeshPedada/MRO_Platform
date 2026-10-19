'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  Search,
  Phone,
  GraduationCap,
  ShieldCheck,
  BookOpen,
  Layers,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [phoneMode, setPhoneMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');

  const router = useRouter();
  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      const role = profile?.role || 'author';

      const dashboardMap: Record<string, string> = {
        admin: '/dashboard/admin',
        editor_in_chief: '/dashboard/eic',
        editor: '/dashboard/editor',
        reviewer: '/dashboard/reviewer',
        author: '/dashboard/author',
      };

      router.push(dashboardMap[role] || '/dashboard/author');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard/author`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setErrorMsg('Please enter a valid mobile number with country code');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      setOtpSent(true);
      setSuccessMsg('6-digit OTP verification code sent to your phone');
      setLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setErrorMsg('Please enter the 6-digit OTP code');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else if (data.user) {
      router.push('/dashboard/author');
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
            className="text-xs font-semibold text-[#1d63ed] px-2.5 py-1.5 rounded-lg hover:bg-blue-50/60 transition"
          >
            Login
          </Link>

          {/* Solid Rounded Blue Register Button */}
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
            Welcome Back
          </h1>
          <p className="text-xs text-slate-500 text-center mb-6">
            Sign in to your MANI account
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

          {/* Social / OTP Action Buttons */}
          {!phoneMode ? (
            <>
              {/* Google Auth Button */}
              <button
                type="button"
                suppressHydrationWarning
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full border border-slate-200 rounded-lg py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Phone OTP Button */}
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => {
                  setPhoneMode(true);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="w-full border border-slate-200 rounded-lg py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 mt-2.5 transition shadow-xs"
              >
                <Phone className="w-4 h-4 text-slate-600" />
                <span>Continue with Phone OTP</span>
              </button>

              {/* Divider: or sign in with email */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                  <span className="bg-white px-3 text-slate-400 font-medium">
                    or sign in with email
                  </span>
                </div>
              </div>

              {/* Standard Email/Password Form */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="you@institution.edu"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    suppressHydrationWarning
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50/60 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#1d63ed] focus:border-transparent outline-none transition placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="login-password"
                      className="block text-xs font-semibold text-slate-700"
                    >
                      Password
                    </label>
                  </div>
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    placeholder="Your password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    suppressHydrationWarning
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50/60 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#1d63ed] focus:border-transparent outline-none transition placeholder:text-slate-400"
                  />
                </div>

                {/* Primary Button */}
                <button
                  type="submit"
                  disabled={loading}
                  suppressHydrationWarning
                  className="w-full py-2.5 bg-[#1d63ed] hover:bg-[#1554cf] text-white font-semibold text-sm rounded-lg shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            </>
          ) : (
            /* Phone OTP Interactive Form */
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendPhoneOtp} className="space-y-3">
                  <div>
                    <label
                      htmlFor="login-phone"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Phone Number (with country code)
                    </label>
                    <input
                      id="login-phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      suppressHydrationWarning
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50/60 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#1d63ed] focus:border-transparent outline-none transition"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    suppressHydrationWarning
                    className="w-full py-2.5 bg-[#1d63ed] hover:bg-[#1554cf] text-white font-semibold text-sm rounded-lg shadow-sm transition disabled:opacity-50"
                  >
                    {loading ? 'Sending Code...' : 'Send OTP Code'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyPhoneOtp} className="space-y-3">
                  <div>
                    <label
                      htmlFor="login-otp"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Enter 6-Digit OTP Code
                    </label>
                    <input
                      id="login-otp"
                      name="otp"
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      autoComplete="one-time-code"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      suppressHydrationWarning
                      className="w-full px-3.5 py-2.5 text-center text-base tracking-widest font-mono bg-slate-50/60 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#1d63ed] focus:border-transparent outline-none transition"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    suppressHydrationWarning
                    className="w-full py-2.5 bg-[#1d63ed] hover:bg-[#1554cf] text-white font-semibold text-sm rounded-lg shadow-sm transition disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify &amp; Sign In'}
                  </button>
                </form>
              )}

              <button
                type="button"
                suppressHydrationWarning
                onClick={() => {
                  setPhoneMode(false);
                  setOtpSent(false);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800 transition py-1"
              >
                &larr; Back to Email Sign In
              </button>
            </div>
          )}

          {/* Bottom text: Don't have an account? Register here */}
          <p className="mt-6 text-center text-xs text-slate-600">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-[#1d63ed] font-semibold hover:underline"
            >
              Register here
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
              Empowering Next-Generation Scientific Discovery &amp; Innovation
            </h2>

            {/* Sub-text */}
            <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
              Access 17 multidisciplinary research categories, double-blind peer reviews, and full open-access publications under Creative Commons Attribution 4.0 International.
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