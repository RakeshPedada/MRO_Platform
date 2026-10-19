import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  FileCheck2,
  FileText,
  Filter,
  GraduationCap,
  Layers,
  ShieldAlert,
  ShieldCheck,
  Users,
} from 'lucide-react';
import EicApprovalActions from './EicApprovalActions';

export const revalidate = 0;

export default async function EditorInChiefDashboard() {
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

  // Load all journals
  const { data: journals } = await supabase
    .from('journals')
    .select('id, title, slug, issn, description')
    .order('title', { ascending: true });

  // Load manuscripts across all journals with reviews & author info
  const { data: manuscripts } = await supabase
    .from('manuscripts')
    .select(`
      id,
      title,
      abstract,
      status,
      created_at,
      file_url,
      journals ( id, title ),
      profiles:author_id ( full_name, email, affiliation ),
      review_assignments (
        id,
        status,
        reviewer:reviewer_id ( full_name ),
        review_reports (
          recommendation,
          comments_for_author,
          confidential_comments_for_editor
        )
      )
    `)
    .order('created_at', { ascending: false });

  // Metrics for EIC oversight
  const totalSubmissions = manuscripts?.length || 0;
  const pendingFinalDecision = manuscripts?.filter((m) =>
    ['under_review', 'under_screening', 'revision_requested'].includes(m.status)
  ).length || 0;
  const acceptedCount = manuscripts?.filter((m) => m.status === 'accepted').length || 0;
  const publishedCount = manuscripts?.filter((m) => m.status === 'published').length || 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-[#0b1b3d] text-white py-4 px-6 sm:px-8 flex flex-wrap justify-between items-center gap-4 shadow-md border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 font-black text-xs px-2 py-0.5 rounded tracking-wider">
              EIC
            </span>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">
              MANI Research Organization
            </h1>
          </div>
          <p className="text-xs text-slate-300">
            Editor-in-Chief Oversight &amp; Final Manuscript Decisions
          </p>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div>
            <p className="text-sm font-bold text-white">{profile?.full_name}</p>
            <span className="inline-block text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
              {profile?.role?.replace('_', ' ')}
            </span>
          </div>
          <Link
            href="/dashboard/editor"
            className="text-xs font-semibold px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition"
          >
            Section Editor Console &rarr;
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 flex-1 w-full">
        {/* Oversight Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Total Manuscripts</span>
              <BookOpen className="w-4 h-4 text-sky-600" />
            </div>
            <p className="text-2xl font-extrabold text-[#0b1b3d]">{totalSubmissions}</p>
            <p className="text-[11px] text-slate-400">All submitted records</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Under Review / Pending</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-extrabold text-amber-700">{pendingFinalDecision}</p>
            <p className="text-[11px] text-slate-400">Awaiting peer reports or revision</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Accepted (Ready for Issue)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-700">{acceptedCount}</p>
            <p className="text-[11px] text-slate-400">Awaiting volume/issue publication</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Officially Published</span>
              <Award className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-extrabold text-blue-700">{publishedCount}</p>
            <p className="text-[11px] text-slate-400">DOI minted &amp; cataloged</p>
          </div>
        </div>

        {/* EIC Primary Manuscript Triage & Final Approvals Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#0b1b3d] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <span>Editorial Oversight &amp; Final Decision Board</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review section editor reports, verify peer reviewer consensus, and issue final determinations.
              </p>
            </div>
          </div>

          {manuscripts && manuscripts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[11px] border-b border-slate-200 font-bold">
                    <th className="py-3 px-4">Title &amp; Author</th>
                    <th className="py-3 px-4">Journal</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Reviewer Recommendations</th>
                    <th className="py-3 px-4 text-right">EIC Final Determination</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {manuscripts.map((m) => {
                    const author = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
                    const journal = Array.isArray(m.journals) ? m.journals[0] : m.journals;
                    const assignments = m.review_assignments || [];
                    const reports = assignments
                      .map((a: any) =>
                        Array.isArray(a.review_reports) ? a.review_reports[0] : a.review_reports
                      )
                      .filter(Boolean);

                    return (
                      <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 max-w-xs">
                          <Link
                            href={`/dashboard/editor/manuscript/${m.id}`}
                            className="font-bold text-slate-900 hover:text-sky-700 leading-snug block line-clamp-2"
                          >
                            {m.title}
                          </Link>
                          <div className="text-[11px] text-slate-500 mt-1">
                            <span className="font-semibold text-slate-700">{author?.full_name}</span> &bull;{' '}
                            {author?.affiliation || author?.email}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          {journal?.title || 'Advanced Engineering'}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              m.status === 'published'
                                ? 'bg-blue-100 text-blue-800'
                                : m.status === 'accepted'
                                ? 'bg-emerald-100 text-emerald-800'
                                : m.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : m.status === 'revision_requested'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {m.status.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-[11px]">
                          {reports.length > 0 ? (
                            <div className="space-y-1">
                              {reports.map((r: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                                  <span className="font-mono uppercase font-bold text-[10px] text-slate-800">
                                    {r.recommendation.replace('_', ' ')}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">No reports submitted yet</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <EicApprovalActions
                            manuscriptId={m.id}
                            currentStatus={m.status}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-slate-400 text-xs">
              No manuscripts found in the platform.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
