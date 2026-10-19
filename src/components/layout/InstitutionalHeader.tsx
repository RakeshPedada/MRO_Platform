'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  GraduationCap,
  Send,
  ShieldCheck,
  Menu,
  X,
  Search,
  SlidersHorizontal,
  ChevronDown,
  LogOut,
  Sparkles,
} from 'lucide-react';

export default function InstitutionalHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>('author');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchScope, setSearchScope] = useState<'journals' | 'articles'>('journals');
  const [searchQuery, setSearchQuery] = useState('');
  const [advancedModalOpen, setAdvancedModalOpen] = useState(false);

  // Advanced search form state
  const [advTitle, setAdvTitle] = useState('');
  const [advAuthor, setAdvAuthor] = useState('');
  const [advDoi, setAdvDoi] = useState('');
  const [advYear, setAdvYear] = useState('');

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
    router.refresh();
  };

  const getDashboardHref = () => {
    if (role === 'admin') return '/dashboard/admin';
    if (role === 'editor_in_chief') return '/dashboard/eic';
    if (role === 'editor') return '/dashboard/editor';
    if (role === 'reviewer') return '/dashboard/reviewer';
    return '/dashboard/author';
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    if (searchScope === 'journals') {
      router.push(`/journals?q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/articles?q=${encodeURIComponent(query)}`);
    }
    setMobileMenuOpen(false);
  };

  const handleAdvancedSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (advTitle.trim()) params.set('title', advTitle.trim());
    if (advAuthor.trim()) params.set('author', advAuthor.trim());
    if (advDoi.trim()) params.set('doi', advDoi.trim());
    if (advYear.trim()) params.set('year', advYear.trim());
    setAdvancedModalOpen(false);
    router.push(`/articles?${params.toString()}`);
  };

  // Primary 5 core menu items mandated by MDPI navigation structure
  const primaryNavLinks = [
    { href: '/journals', label: 'Journals' },
    { href: '/categories', label: 'Subject Areas' },
    { href: '/guidelines', label: 'Author Guidelines' },
    { href: '/ethics', label: 'Ethics' },
    { href: '/about', label: 'About' },
  ];

  return (
    <>
      {/* 1. Top Corporate & Institutional Governance Bar */}
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
          <Link href="/articles" className="hover:text-white transition-colors hidden sm:inline">
            Articles
          </Link>
          <Link href="/researchers" className="hover:text-white transition-colors hidden sm:inline">
            Researchers
          </Link>
          <Link href="/community" className="hover:text-white transition-colors hidden md:inline">
            Community
          </Link>
          <Link href="/news" className="hover:text-white transition-colors hidden md:inline">
            News
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

      {/* 2. Institutional Header & Integrated Search Bar (MDPI Architecture) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo on the left */}
          <div className="flex items-center gap-6 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="bg-[#0b1b3d] text-white font-black text-lg px-2.5 py-1 rounded tracking-wider shadow-sm group-hover:bg-[#0284c7] transition">
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

            {/* Primary Main Menu Items (Desktop) */}
            <nav className="hidden xl:flex items-center gap-6 text-xs font-semibold text-slate-700 ml-2">
              {primaryNavLinks.map((link) => {
                const isActive =
                  pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition-all duration-150 py-1 border-b-2 whitespace-nowrap ${
                      isActive
                        ? 'border-[#0284c7] text-[#0284c7] font-bold'
                        : 'border-transparent text-slate-700 hover:text-sky-700 hover:border-slate-300'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right-Aligned Integrated Search Suite & Auth Buttons */}
          <div className="flex items-center gap-3">
            {/* Integrated Search Suite (Desktop / Tablet) */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex items-center border border-slate-300 rounded shadow-inner overflow-hidden bg-slate-50 focus-within:ring-2 focus-within:ring-sky-500 focus-within:bg-white transition"
            >
              {/* Scope Dropdown */}
              <select
                value={searchScope}
                onChange={(e) => setSearchScope(e.target.value as any)}
                aria-label="Search Scope"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold py-1.5 px-2.5 border-r border-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="journals">All Journals</option>
                <option value="articles">Articles</option>
              </select>

              {/* Search Input */}
              <input
                type="text"
                placeholder="Search articles, authors, journals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-40 lg:w-56 text-xs py-1.5 px-2.5 bg-transparent focus:outline-none text-slate-900 placeholder:text-slate-400"
              />

              {/* Navy Search Button */}
              <button
                type="submit"
                className="bg-[#0b1b3d] hover:bg-[#0284c7] text-white px-2.5 py-2 text-xs font-bold transition flex items-center justify-center shrink-0"
                aria-label="Execute search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Advanced Search Link */}
            <button
              type="button"
              onClick={() => setAdvancedModalOpen(true)}
              className="hidden lg:inline text-[11px] text-sky-700 hover:text-sky-900 font-semibold hover:underline whitespace-nowrap"
            >
              Advanced
            </button>

            {/* Outlined Sign In & Solid Blue Submit Button */}
            <div className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href={getDashboardHref()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded border border-slate-300 transition"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-sky-700" />
                    <span className="capitalize hidden sm:inline">
                      {role.replace('_', ' ')}
                    </span>
                    <span className="sm:hidden">Dashboard</span>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    title="Sign Out"
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs text-slate-700 hover:text-[#0b1b3d] font-semibold border border-slate-300 rounded hover:bg-slate-50 transition whitespace-nowrap"
                >
                  Sign In
                </Link>
              )}

              <Link
                href="/submit"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded shadow-sm transition whitespace-nowrap"
              >
                <Send className="w-3 h-3" />
                <span>Submit</span>
              </Link>

              {/* Mobile menu hamburger button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition ml-1"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown & Search Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 text-xs font-semibold text-slate-700 shadow-xl">
            {/* Mobile Integrated Search */}
            <form onSubmit={handleSearchSubmit} className="flex items-center border border-slate-300 rounded overflow-hidden">
              <select
                value={searchScope}
                onChange={(e) => setSearchScope(e.target.value as any)}
                className="bg-slate-100 text-slate-800 text-[11px] font-semibold py-2 px-2 border-r border-slate-300 focus:outline-none"
              >
                <option value="journals">Journals</option>
                <option value="articles">Articles</option>
              </select>
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs py-2 px-3 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#0b1b3d] text-white px-3 py-2 text-xs font-bold"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-1 pt-1">
              {primaryNavLinks.map((link) => {
                const isActive =
                  pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 px-3 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? 'bg-sky-50 text-[#0284c7] font-bold border-l-4 border-[#0284c7]'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-1 text-[11px] text-slate-600">
                <Link
                  href="/articles"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 px-2 hover:text-sky-700"
                >
                  &bull; Articles Catalog
                </Link>
                <Link
                  href="/researchers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 px-2 hover:text-sky-700"
                >
                  &bull; Researchers
                </Link>
                <Link
                  href="/community"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 px-2 hover:text-sky-700"
                >
                  &bull; Community
                </Link>
                <Link
                  href="/news"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 px-2 hover:text-sky-700"
                >
                  &bull; News &amp; Bulletins
                </Link>
                <Link
                  href="/editorial-board"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 px-2 hover:text-sky-700"
                >
                  &bull; Editorial Board
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 px-2 hover:text-sky-700"
                >
                  &bull; Contact Office
                </Link>
              </div>

              {user && (
                <div className="pt-2 border-t border-slate-100">
                  <Link
                    href={getDashboardHref()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded bg-slate-100 text-slate-800 font-bold"
                  >
                    My {role.replace('_', ' ')} Dashboard &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 3. Advanced Search Modal */}
      {advancedModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-sky-700" />
                <h3 className="text-base font-bold text-[#0b1b3d]">
                  Advanced Academic Search
                </h3>
              </div>
              <button
                onClick={() => setAdvancedModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdvancedSearchSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Article Title / Keywords:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Autonomous Robotic Navigation, Renewable Microgrids..."
                  value={advTitle}
                  onChange={(e) => setAdvTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Author / Academic Affiliation:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Manikanta, Indian Institute of Science..."
                  value={advAuthor}
                  onChange={(e) => setAdvAuthor(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Digital Object Identifier (DOI):
                  </label>
                  <input
                    type="text"
                    placeholder="10.5555/mro.2026..."
                    value={advDoi}
                    onChange={(e) => setAdvDoi(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Year of Publication:
                  </label>
                  <input
                    type="number"
                    placeholder="2026"
                    value={advYear}
                    onChange={(e) => setAdvYear(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAdvancedModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Execute Search</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
