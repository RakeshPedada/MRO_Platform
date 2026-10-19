'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  GraduationCap,
  Send,
  ShieldCheck,
  Menu,
  X,
  BookOpen,
} from 'lucide-react';

export default function InstitutionalHeader() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>('author');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (currentUser) {
        setUser(currentUser);
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single();
        if (profile?.role) {
          setRole(profile.role);
        }
      }
    }
    checkAuth();
  }, [supabase]);

  const getDashboardHref = () => {
    if (role === 'admin') return '/dashboard/admin';
    if (role === 'editor_in_chief') return '/dashboard/eic';
    if (role === 'editor') return '/dashboard/editor';
    if (role === 'reviewer') return '/dashboard/reviewer';
    return '/dashboard/author';
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/articles', label: 'Browse Articles' },
    { href: '/guidelines', label: 'Author Guidelines' },
    { href: '/ethics', label: 'Publication Ethics' },
    { href: '/editorial-board', label: 'Editorial Board' },
    { href: '/about', label: 'About MRO' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* 1. Top Corporate Bar */}
      <div className="bg-[#0b1b3d] text-slate-300 text-[11px] border-b border-slate-800 py-1.5 px-4 sm:px-8 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span>
            MANI Research Organization (MRO) &bull; An academic publishing initiative of{' '}
            <strong className="text-white">MANI Market Private Limited</strong>
          </span>
          <span className="text-slate-400 hidden lg:inline font-mono">
            | CIN: U58130AP2026PTC127065 &bull; GSTIN: 37AAVCM2351A1ZI
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <Link href="/about" className="hover:text-white transition-colors">
            About MRO
          </Link>
          <Link href="/guidelines" className="hover:text-white transition-colors">
            Author Guidelines
          </Link>
          <Link href="/ethics" className="hover:text-white transition-colors">
            Publication Ethics
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-emerald-400 font-semibold hidden sm:flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            COPE Compliant
          </span>
        </div>
      </div>

      {/* 2. Institutional Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="bg-[#0b1b3d] text-white font-black text-lg px-2.5 py-1 rounded tracking-wider shadow-sm">
                MRO
              </span>
              <div>
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#0b1b3d] block leading-tight">
                  MANI Research Organization
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block">
                  Multidisciplinary Open Access Publishing
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-slate-700">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors py-1 border-b-2 ${
                    isActive
                      ? 'border-[#0284c7] text-[#0284c7] font-bold'
                      : 'border-transparent hover:text-sky-700'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={getDashboardHref()}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded border border-slate-300 transition"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-sky-700" />
                  <span className="capitalize">{role.replace('_', ' ')} Dashboard</span>
                </Link>
                <Link
                  href="/submit"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded shadow-sm transition"
                >
                  <Send className="w-3 h-3" />
                  <span>Submit Paper</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs text-slate-700 hover:text-[#0b1b3d] font-semibold border border-slate-300 rounded hover:bg-slate-50 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/submit"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded shadow-sm transition"
                >
                  <Send className="w-3 h-3" />
                  <span>Submit Paper</span>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 text-xs font-semibold text-slate-700 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-1.5 px-2 rounded ${
                  pathname === link.href
                    ? 'bg-sky-50 text-[#0284c7] font-bold'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                href={getDashboardHref()}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 px-2 rounded bg-slate-100 text-slate-800 font-bold"
              >
                My {role.replace('_', ' ')} Dashboard &rarr;
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
}
