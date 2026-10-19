import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { FileEdit, Send, BookOpen, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AuthorDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: manuscripts } = await supabase
    .from('manuscripts')
    .select(`
      id,
      title,
      status,
      created_at,
      journals ( title )
    `)
    .eq('author_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-[#0b1b3d] text-white py-4 px-6 sm:px-8 flex flex-wrap justify-between items-center gap-4 shadow-md border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white font-extrabold text-xs px-2 py-0.5 rounded tracking-wider">
              MRO
            </span>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">MANI Research Organization</h1>
          </div>
          <p className="text-xs text-slate-300">Author &amp; Researcher Portal</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-white">{profile?.full_name}</p>
          <span className="inline-block text-[10px] font-mono uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded">
            {profile?.role || 'Author'}
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
        <Breadcrumbs items={[{ label: 'Author Workspace' }]} className="mb-4" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Manuscript Submissions</h2>
            <p className="text-xs text-slate-600">Track editorial screening, peer review reports, and submit revisions</p>
          </div>
          <Link
            href="/submit"
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow transition flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit New Manuscript</span>
          </Link>
        </div>

        {manuscripts && manuscripts.length > 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[11px] border-b border-slate-200 font-bold">
                  <th className="py-3.5 px-6">Title</th>
                  <th className="py-3.5 px-6">Journal</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Submitted Date</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {manuscripts.map((m) => {
                  const journalTitle = Array.isArray(m.journals)
                    ? m.journals[0]?.title
                    : (m.journals as { title: string } | null)?.title;

                  const isRevisionRequested = m.status === 'revision_requested';

                  return (
                    <tr key={m.id} className="hover:bg-slate-50 transition">
                      <td className="py-4 px-6 font-bold text-slate-900 max-w-xs leading-snug">
                        {m.title}
                        {isRevisionRequested && (
                          <span className="block text-[11px] text-amber-700 font-semibold mt-1">
                            &bull; Revision requested by editorial office
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-medium">
                        {journalTitle || 'Engineering Journal'}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`status-chip ${
                            m.status === 'published' || m.status === 'accepted'
                              ? 'status-chip-published'
                              : m.status === 'under_review'
                              ? 'status-chip-review'
                              : m.status === 'revision_requested'
                              ? 'status-chip-revision animate-pulse'
                              : m.status === 'rejected'
                              ? 'status-chip-rejected'
                              : 'status-chip-submitted'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span>{m.status.replace('_', ' ')}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-mono text-[11px]">
                        {new Date(m.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {isRevisionRequested ? (
                          <Link
                            href={`/dashboard/author/revise/${m.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-sm transition text-xs"
                          >
                            <FileEdit className="w-3.5 h-3.5" />
                            <span>Submit Revision</span>
                          </Link>
                        ) : m.status === 'published' ? (
                          <Link
                            href="/articles"
                            className="inline-flex items-center gap-1 text-blue-700 font-semibold hover:underline"
                          >
                            <span>View in Catalog</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        ) : (
                          <span className="text-slate-400 italic">In Editorial Process</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-slate-700 font-semibold">You have not submitted any manuscripts yet.</p>
            <p className="text-xs text-slate-400">
              Click &quot;Submit New Manuscript&quot; to begin the peer-review process.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}