import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import {
  Users,
  FileText,
  BookOpen,
  Layers,
  Award,
  ShieldCheck,
  BarChart3,
  Clock,
  ArrowRight,
} from 'lucide-react';
import UserRoleManager from './UserRoleManager';

export const revalidate = 0;

export default async function AdminDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Strict check
  if (profile?.role !== 'admin') {
    redirect('/dashboard/author');
  }

  // 1. Real-time platform metrics (Zero fabrication policy)
  const [
    { count: totalUsers },
    { count: underReviewCount },
    { count: totalPublished },
    { count: totalJournals },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase
      .from('manuscripts')
      .select('*', { count: 'exact', head: true })
      .in('status', ['submitted', 'under_screening', 'under_review', 'revision_requested']),
    supabase.from('published_articles').select('*', { count: 'exact', head: true }),
    supabase.from('journals').select('*', { count: 'exact', head: true }),
  ]);

  // 2. Fetch categories and publication counts by category
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug');

  const { data: manuscriptsWithCategory } = await supabase
    .from('manuscripts')
    .select('id, category_id, status');

  const categoryStats = (categories || []).map((cat) => {
    const totalManuscripts = (manuscriptsWithCategory || []).filter(
      (m) => m.category_id === cat.id
    ).length;
    const publishedCount = (manuscriptsWithCategory || []).filter(
      (m) => m.category_id === cat.id && m.status === 'published'
    ).length;
    return {
      id: cat.id,
      name: cat.name,
      totalManuscripts,
      publishedCount,
    };
  });

  // 3. Fetch all user profiles for role management
  const { data: allUsers } = await supabase
    .from('profiles')
    .select('id, full_name, email, affiliation, role, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-[#0b1b3d] text-white py-4 px-6 sm:px-8 flex flex-wrap justify-between items-center gap-4 shadow-md border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500 text-white font-black text-xs px-2 py-0.5 rounded tracking-wider">
              ADMIN
            </span>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">
              MANI Research Organization
            </h1>
          </div>
          <p className="text-xs text-slate-300">
            Platform Administration, Real-Time Analytics &amp; 5-Tier Role Management
          </p>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div>
            <p className="text-sm font-bold text-white">{profile?.full_name}</p>
            <span className="inline-block text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded">
              Super Admin
            </span>
          </div>
          <Link
            href="/dashboard/eic"
            className="text-xs font-semibold px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition"
          >
            EIC Console &rarr;
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 flex-1 w-full">
        <Breadcrumbs items={[{ label: 'Administration Console' }]} />

        {/* Real-time Analytics Summary */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-sky-700" />
            <span>Platform Vital Metrics (Verified Database Telemetry)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                <span>Total Registered Users</span>
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-3xl font-extrabold text-[#0b1b3d]">{totalUsers || 0}</p>
              <p className="text-[11px] text-slate-400">Researchers, Reviewers &amp; Editors</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                <span>Active Pipeline Reviews</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-3xl font-extrabold text-amber-700">{underReviewCount || 0}</p>
              <p className="text-[11px] text-slate-400">Submitted / Under Review / Revisions</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                <span>Published Open Access</span>
                <Award className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-3xl font-extrabold text-emerald-700">{totalPublished || 0}</p>
              <p className="text-[11px] text-slate-400">Minted DOIs in Catalog</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                <span>Active Journals</span>
                <BookOpen className="w-4 h-4 text-sky-600" />
              </div>
              <p className="text-3xl font-extrabold text-sky-800">{totalJournals || 0}</p>
              <p className="text-[11px] text-slate-400">Indexed Publications</p>
            </div>
          </div>
        </section>

        {/* Publication Counts by Category */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0b1b3d] flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-700" />
                <span>Publications &amp; Submissions by Subject Category</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Distribution of scientific manuscripts across MRO multidisciplinary disciplines.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categoryStats.map((cat) => (
              <div
                key={cat.id}
                className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-bold text-slate-800 truncate" title={cat.name}>
                    {cat.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Total Submissions: <strong className="text-slate-700">{cat.totalManuscripts}</strong>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                    {cat.publishedCount} Published
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* User Role Management Board */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-[#0b1b3d] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-700" />
                <span>5-Tier User Role Management</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Assign and update authorized permissions: author, reviewer, editor, editor_in_chief, or admin.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Total Accounts: {allUsers?.length || 0}
            </span>
          </div>

          <UserRoleManager users={allUsers || []} currentUserId={user.id} />
        </section>

        {/* Corporate Legal & Compliance Box */}
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-5 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-800 block">MANI Market Private Limited</span>
            <span className="text-slate-500 font-mono text-[11px]">
              Corporate Identity Number (CIN): U58130AP2026PTC127065 &bull; GSTIN: 37AAVCM2351A1ZI
            </span>
          </div>
          <span className="px-3 py-1 bg-white border border-slate-300 rounded font-semibold text-slate-700 text-[11px]">
            System Status: Healthy &amp; RLS Enforced
          </span>
        </div>
      </main>
    </div>
  );
}
