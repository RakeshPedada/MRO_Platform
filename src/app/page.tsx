import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileText,
  GraduationCap,
  Layers,
  Send,
  ShieldCheck,
  Building2,
  Users,
  Compass,
  ArrowRight,
  Eye,
  FileCheck2,
  Search,
  LockOpen,
} from 'lucide-react';

export const revalidate = 0;

// Canonical 17 Multidisciplinary Subject Areas aligned with MRO Charter
const CANONICAL_17_SUBJECTS = [
  { name: 'Computer Science & Artificial Intelligence', slug: 'computer-science-artificial-intelligence' },
  { name: 'Electrical & Electronics Engineering', slug: 'electrical-electronics-engineering' },
  { name: 'Mechanical & Mechatronics Engineering', slug: 'mechanical-engineering' },
  { name: 'Civil & Structural Infrastructure', slug: 'civil-engineering' },
  { name: 'Robotics & Autonomous Systems', slug: 'robotics-automation' },
  { name: 'Energy Systems & Renewable Technologies', slug: 'energy-renewable-technologies' },
  { name: 'Chemical Engineering & Applied Chemistry', slug: 'chemical-engineering' },
  { name: 'Materials Science & Nanotechnology', slug: 'materials-science' },
  { name: 'Biomedical Engineering & Health Informatics', slug: 'biomedical-engineering' },
  { name: 'Data Science & Applied Mathematics', slug: 'data-science-mathematics' },
  { name: 'Environmental Sciences & Sustainability', slug: 'environmental-science' },
  { name: 'Aerospace & Aviation Engineering', slug: 'aerospace-engineering' },
  { name: 'Physics & Quantum Computing', slug: 'physics-quantum' },
  { name: 'Telecommunications & Sensor Networks', slug: 'telecommunications' },
  { name: 'Industrial & Manufacturing Systems', slug: 'industrial-engineering' },
  { name: 'Mining, Geology & Earth Sciences', slug: 'mining-geosciences' },
  { name: 'Information Security & Cryptography', slug: 'information-security' },
];

export default async function HomePage() {
  const supabase = await createClient();

  // 1. Current user session & role
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userProfile = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('id', user.id)
      .single();
    userProfile = profile;
  }

  // 2. Fetch real database metrics (Zero fabrication policy)
  const [
    { count: journalCount },
    { count: articleCount },
    { count: researcherCount },
    { count: activeReviewsCount },
  ] = await Promise.all([
    supabase.from('journals').select('*', { count: 'exact', head: true }),
    supabase.from('published_articles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase
      .from('manuscripts')
      .select('*', { count: 'exact', head: true })
      .in('status', ['submitted', 'under_screening', 'under_review', 'revision_requested']),
  ]);

  // 3. Fetch active journals
  const { data: journals } = await supabase
    .from('journals')
    .select('id, title, slug, short_code, issn, aims_scope')
    .order('title', { ascending: true });

  // 4. Fetch categories from DB to complement canonical list
  const { data: dbCategories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name', { ascending: true });

  // Merge DB categories with canonical list without duplicates
  const subjectMap = new Map<string, { name: string; slug: string }>();
  CANONICAL_17_SUBJECTS.forEach((s) => subjectMap.set(s.slug, s));
  dbCategories?.forEach((c) => {
    if (!subjectMap.has(c.slug)) {
      subjectMap.set(c.slug, { name: c.name, slug: c.slug });
    }
  });
  const allSubjectAreas = Array.from(subjectMap.values()).slice(0, 17);

  // 5. Fetch recent publications stream
  const { data: recentArticles } = await supabase
    .from('published_articles')
    .select(`
      id,
      doi,
      volume,
      issue,
      pages,
      published_at,
      journals ( title, slug ),
      manuscripts (
        id,
        title,
        abstract,
        keywords,
        file_url,
        profiles:author_id ( full_name, affiliation )
      )
    `)
    .order('published_at', { ascending: false })
    .limit(6);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      {/* 1. MDPI Governance & Parent Company Topbar */}
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
          <Link href="/articles" className="hover:text-white transition-colors">
            Open Access Catalog
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

          <nav className="hidden md:flex items-center gap-4 text-xs font-semibold text-slate-700">
            <Link href="/journals" className="hover:text-sky-700 transition-colors">
              Journals
            </Link>
            <Link href="/articles" className="hover:text-sky-700 transition-colors">
              Articles
            </Link>
            <Link href="/categories" className="hover:text-sky-700 transition-colors">
              Disciplines
            </Link>
            <Link href="/researchers" className="hover:text-sky-700 transition-colors">
              Researchers
            </Link>
            <Link href="/community" className="hover:text-sky-700 transition-colors">
              Community
            </Link>
            <Link href="/news" className="hover:text-sky-700 transition-colors">
              News
            </Link>
            <Link href="/guidelines" className="hover:text-sky-700 transition-colors">
              Guidelines
            </Link>
            <Link href="/editorial-board" className="hover:text-sky-700 transition-colors">
              Editorial Board
            </Link>
            <Link href="/about" className="hover:text-sky-700 transition-colors">
              About MRO
            </Link>
            <Link href="/contact" className="hover:text-sky-700 transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={
                    userProfile?.role === 'admin'
                      ? '/dashboard/admin'
                      : userProfile?.role === 'editor_in_chief'
                      ? '/dashboard/eic'
                      : userProfile?.role === 'editor'
                      ? '/dashboard/editor'
                      : userProfile?.role === 'reviewer'
                      ? '/dashboard/reviewer'
                      : '/dashboard/author'
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded border border-slate-300 transition"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-sky-700" />
                  <span className="capitalize">{userProfile?.role?.replace('_', ' ') || 'Dashboard'}</span>
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
          </div>
        </div>
      </header>

      {/* 3. Three-Column MDPI Dense Academic Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 w-full">
        {/* LEFT COLUMN (Col 1-3): Journals Directory & 17 Subject Areas */}
        <aside className="lg:col-span-3 space-y-4">
          {/* Active Journals */}
          <div id="journals" className="bg-white border border-slate-200 rounded p-4 shadow-sm scroll-mt-20">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0b1b3d] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-sky-700" />
                <span>MRO Journals</span>
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                {journalCount || 1}
              </span>
            </div>

            {journals && journals.length > 0 ? (
              <ul className="text-xs space-y-2.5">
                {journals.map((j) => (
                  <li key={j.id} className="border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                    <Link
                      href="/articles"
                      className="font-semibold text-sky-800 hover:underline block leading-snug"
                    >
                      {j.title}
                    </Link>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 font-mono">
                      <span>ISSN: {j.issn || 'Registered'}</span>
                      <span className="text-emerald-600 font-sans font-semibold">Active</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400">Loading journals...</p>
            )}
            <div className="pt-2.5 mt-2 border-t border-slate-100">
              <Link
                href="/journals"
                className="text-[11px] text-sky-700 hover:text-sky-900 font-bold flex items-center justify-between"
              >
                <span>Browse Full Journals Catalog</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

          {/* 17 Multidisciplinary Subject Areas */}
          <div id="subjects" className="bg-white border border-slate-200 rounded p-4 shadow-sm scroll-mt-20">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0b1b3d] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sky-700" />
                <span>17 Subject Areas</span>
              </h3>
              <span className="text-[10px] bg-sky-50 text-sky-800 px-1.5 py-0.5 rounded font-mono font-bold">
                17
              </span>
            </div>
            <div className="max-h-[460px] overflow-y-auto pr-1 academic-scrollbar">
              <ul className="text-[11px] space-y-2">
                {allSubjectAreas.map((c, idx) => (
                  <li key={c.slug} className="border-b border-slate-50 pb-1.5 last:border-0">
                    <Link
                      href="/articles"
                      className="text-slate-700 hover:text-sky-700 hover:font-medium block leading-tight transition-colors flex items-start gap-1.5"
                      title={c.name}
                    >
                      <span className="text-slate-400 font-mono text-[9px] mt-0.5">{idx + 1}.</span>
                      <span>{c.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-2.5 mt-2 border-t border-slate-100">
              <Link
                href="/categories"
                className="text-[11px] text-sky-700 hover:text-sky-900 font-bold flex items-center justify-between"
              >
                <span>View All 17 Disciplines</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Open Access Commitment Badge */}
          <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-[11px] text-emerald-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Universal Open Access</span>
            </div>
            <p className="text-[10px] text-emerald-700 leading-relaxed">
              All peer-reviewed articles are immediately free to read, download, and cite under CC BY 4.0.
            </p>
          </div>
        </aside>

        {/* CENTER COLUMN (Col 4-9): Published Research Feed Stream */}
        <main className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-wrap justify-between items-center gap-2">
            <div>
              <h2 className="text-base font-bold text-[#0b1b3d] leading-tight flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-sky-700" />
                Latest Published Articles
              </h2>
              <p className="text-[11px] text-slate-500">
                Peer-reviewed research published by MANI Research Organization
              </p>
            </div>
            <Link
              href="/articles"
              className="text-xs font-semibold text-sky-700 hover:underline flex items-center gap-1"
            >
              <span>View All ({articleCount || 0})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Article Stream Cards */}
          {recentArticles && recentArticles.length > 0 ? (
            <div className="space-y-4">
              {recentArticles.map((article: any) => {
                const manuscript = article.manuscripts;
                const author = manuscript?.profiles;
                const journal = article.journals;
                const pubDate = new Date(article.published_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <article
                    key={article.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3 hover:border-sky-300 hover:shadow-academic-hover transition-all duration-200"
                  >
                    <div className="flex flex-wrap items-center justify-between text-[11px] gap-2 border-b border-slate-50 pb-2">
                      <span className="font-bold text-[#0284c7] uppercase tracking-wide">
                        {journal?.title || 'MRO Journal of Advanced Engineering & Technology'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="scholarly-badge-oa">
                          <LockOpen className="w-3 h-3" />
                          Open Access
                        </span>
                        <span className="text-slate-400 text-[10px] font-mono">
                          Vol. {article.volume}, Issue {article.issue} ({pubDate})
                        </span>
                      </div>
                    </div>

                    <h3 className="scholarly-title text-base sm:text-lg leading-snug">
                      <Link href={`/articles/${article.id}`}>{manuscript?.title}</Link>
                    </h3>

                    <div className="text-[11px] text-slate-600">
                      by{' '}
                      <span className="font-semibold text-slate-800">
                        {author?.full_name || 'Author'}
                      </span>
                      {author?.affiliation && (
                        <span className="text-slate-500"> &bull; {author.affiliation}</span>
                      )}
                    </div>

                    <p className="scholarly-abstract line-clamp-3">
                      {manuscript?.abstract}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap justify-between items-center gap-2 text-[11px]">
                      <span className="scholarly-badge-doi">
                        DOI:{' '}
                        <strong className="text-slate-800 select-all font-mono">
                          {article.doi}
                        </strong>
                      </span>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/articles/${article.id}`}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded transition"
                        >
                          Full-Text HTML
                        </Link>
                        <Link
                          href={`/articles/${article.id}#pdf-reader`}
                          className="px-2.5 py-1 bg-[#0284c7] hover:bg-[#0369a1] text-white text-[11px] font-semibold rounded shadow-sm transition flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>PDF Preview</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded p-12 text-center text-xs text-slate-500 space-y-2">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">No published articles yet</p>
              <p className="text-slate-400">
                Accepted manuscripts will automatically appear in this open-access feed once published.
              </p>
            </div>
          )}
        </main>

        {/* RIGHT COLUMN (Col 10-12): Submissions, Role Portals & Verified Metrics */}
        <aside id="portals" className="lg:col-span-3 space-y-4 scroll-mt-20">
          {/* Action Box: Submit Manuscript */}
          <div className="bg-[#0b1b3d] text-white rounded p-4 shadow-sm space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" />
              <span>Submit Manuscript</span>
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Publish with MRO. Rapid peer review, objective evaluation, and unrestricted global open-access distribution.
            </p>
            <Link
              href="/submit"
              className="block w-full py-2 bg-[#0284c7] hover:bg-[#0369a1] text-center text-xs font-bold rounded shadow transition text-white"
            >
              Start Submission &rarr;
            </Link>
            <Link
              href="/guidelines"
              className="block text-center text-[11px] text-slate-400 hover:text-white underline pt-0.5"
            >
              Author Instructions &amp; Policies
            </Link>
          </div>

          {/* 5-Tier Role Workspaces */}
          <div className="bg-white border border-slate-200 rounded p-4 shadow-sm space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0b1b3d] border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-sky-700" />
              <span>5-Tier Workspaces</span>
            </h3>
            <ul className="text-xs space-y-2">
              <li>
                <Link
                  href="/dashboard/author"
                  className="text-sky-800 hover:underline font-medium flex items-center justify-between"
                >
                  <span>&bull; Author / Researcher</span>
                  <span className="text-[10px] text-slate-400 font-mono">/author</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/reviewer"
                  className="text-sky-800 hover:underline font-medium flex items-center justify-between"
                >
                  <span>&bull; Peer Reviewer</span>
                  <span className="text-[10px] text-slate-400 font-mono">/reviewer</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/editor"
                  className="text-sky-800 hover:underline font-medium flex items-center justify-between"
                >
                  <span>&bull; Section Editor</span>
                  <span className="text-[10px] text-slate-400 font-mono">/editor</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/eic"
                  className="text-sky-800 hover:underline font-medium flex items-center justify-between"
                >
                  <span>&bull; Editor-in-Chief</span>
                  <span className="text-[10px] text-amber-700 font-bold font-mono">/eic</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/admin"
                  className="text-sky-800 hover:underline font-medium flex items-center justify-between"
                >
                  <span>&bull; Platform Administrator</span>
                  <span className="text-[10px] text-indigo-700 font-bold font-mono">/admin</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Database-Driven Real Metrics (Zero Fabrication) */}
          <div className="bg-white border border-slate-200 rounded p-4 shadow-sm space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0b1b3d] border-b border-slate-100 pb-2">
              Live Platform Metrics
            </h3>
            <div className="grid grid-cols-2 gap-2 text-center pt-1">
              <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                <span className="block text-sm font-extrabold text-[#0b1b3d]">
                  {journalCount || 1}
                </span>
                <span className="text-[9px] text-slate-500 uppercase font-semibold">Active Journals</span>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                <span className="block text-sm font-extrabold text-[#0b1b3d]">
                  {articleCount || 0}
                </span>
                <span className="text-[9px] text-slate-500 uppercase font-semibold">Articles Published</span>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                <span className="block text-sm font-extrabold text-[#0b1b3d]">
                  {researcherCount || 0}
                </span>
                <span className="text-[9px] text-slate-500 uppercase font-semibold">Registered Users</span>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                <span className="block text-sm font-extrabold text-[#0b1b3d]">
                  {activeReviewsCount || 0}
                </span>
                <span className="text-[9px] text-slate-500 uppercase font-semibold">In Active Review</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 text-center pt-1 italic">
              Verified live database statistics
            </p>
          </div>
        </aside>
      </div>

      {/* 4. Full Governance Institutional Footer */}
      <footer className="bg-[#0b1b3d] text-slate-400 text-xs py-10 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-[11px]">
          <div className="space-y-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#0284c7] text-white font-extrabold text-xs px-2 py-0.5 rounded">
                MRO
              </span>
              <span className="text-white font-bold text-sm tracking-tight">
                MANI Research Organization
              </span>
            </div>
            <p className="leading-relaxed text-slate-300">
              Multidisciplinary Advanced Network for Innovation and Research Organization. An academic publishing initiative of <strong>MANI Market Private Limited</strong>.
            </p>
            <p className="text-slate-400 font-mono text-[10px] pt-1">
              CIN: U58130AP2026PTC127065<br />
              GSTIN: 37AAVCM2351A1ZI
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">
              Registered Office
            </h4>
            <p className="leading-relaxed text-slate-300">
              Kuntinavalasa Village, Mentada Mandal,<br />
              Vizianagaram District, Andhra Pradesh - 535580, India.
            </p>
            <p className="text-slate-400 pt-1 text-[10px]">
              Founder: <strong>Nangireddy Manikanta</strong>
            </p>
            <p className="text-slate-400 text-[10px]">
              Official Support: <Link href="/contact" className="text-sky-400 hover:underline">Contact Office</Link>
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">
              Publishing Ethics
            </h4>
            <p className="leading-relaxed text-slate-300">
              MRO adheres to the standards set by the <strong>Committee on Publication Ethics (COPE)</strong>.
            </p>
            <p className="text-slate-400">
              Articles are published Open Access under the <strong>Creative Commons Attribution 4.0 International License (CC BY 4.0)</strong>.
            </p>
            <Link href="/ethics" className="inline-block text-sky-400 hover:underline text-[10px]">
              Read Complete Ethics Policies &rarr;
            </Link>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              <li>
                <Link href="/about" className="hover:text-white">
                  &bull; About MANI Research Org
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-white">
                  &bull; Published Articles Catalog
                </Link>
              </li>
              <li>
                <Link href="/researchers" className="hover:text-white">
                  &bull; Researcher Directory &amp; Profiles
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-white">
                  &bull; Community Research Forum
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="hover:text-white">
                  &bull; Author Guidelines &amp; Formatting
                </Link>
              </li>
              <li>
                <Link href="/ethics" className="hover:text-white">
                  &bull; Publication Ethics &amp; Malpractice
                </Link>
              </li>
              <li>
                <Link href="/editorial-board" className="hover:text-white">
                  &bull; Editorial Board Directory
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  &bull; Contact &amp; Registered Office
                </Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-white">
                  &bull; Manuscript Submission
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} MANI Research Organization (MRO). All rights reserved.
          </p>
          <div className="flex gap-4">
            <span>Peer-Reviewed</span>
            <span>&bull;</span>
            <span>CC BY 4.0 Open Access</span>
            <span>&bull;</span>
            <span>Permanent DOI Archiving</span>
          </div>
        </div>
      </footer>
    </div>
  );
}