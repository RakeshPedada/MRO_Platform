import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export default async function EditorDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Load all manuscripts across journals
  const { data: manuscripts } = await supabase
    .from('manuscripts')
    .select(`
      id,
      title,
      status,
      created_at,
      journals ( title ),
      profiles:author_id ( full_name, affiliation )
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white py-4 px-8 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-xl font-bold">MANI Research Organization</h1>
          <p className="text-xs text-slate-400">Editorial &amp; Review Management Portal</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{profile?.full_name}</p>
          <span className="inline-block text-xs bg-indigo-600 px-2.5 py-0.5 rounded-full capitalize">
            {profile?.role}
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4">
        <Breadcrumbs items={[{ label: 'Editorial Console' }]} className="mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Submissions Overview</h2>
        <p className="text-xs text-slate-600 mb-6">Manage editorial triage, reviewer assignments, and publication decisions.</p>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-6">Manuscript Title</th>
                <th className="py-3.5 px-6">Author</th>
                <th className="py-3.5 px-6">Journal</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {manuscripts?.map((m) => {
                const author = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
                const journal = Array.isArray(m.journals) ? m.journals[0] : m.journals;
                return (
                  <tr key={m.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-6 font-semibold text-slate-900">{m.title}</td>
                    <td className="py-4 px-6 text-slate-700">{author?.full_name}</td>
                    <td className="py-4 px-6 text-slate-600">{journal?.title}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`status-chip ${
                          m.status === 'published' || m.status === 'accepted'
                            ? 'status-chip-published'
                            : m.status === 'under_review'
                            ? 'status-chip-review'
                            : m.status === 'revision_requested'
                            ? 'status-chip-revision'
                            : m.status === 'rejected'
                            ? 'status-chip-rejected'
                            : 'status-chip-submitted'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{m.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                     <Link
                    href={`/dashboard/editor/manuscript/${m.id}`}
                    className="inline-block text-xs font-semibold px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition"
                    >
                    Manage Review
                    </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}