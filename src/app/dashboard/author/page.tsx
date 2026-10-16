import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AuthorDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white py-4 px-8 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-xl font-bold">MANI Research Organization</h1>
          <p className="text-xs text-slate-400">Author & Researcher Portal</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{profile?.full_name}</p>
          <span className="inline-block text-xs bg-blue-600 px-2.5 py-0.5 rounded-full capitalize">
            {profile?.role}
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Manuscript Submissions</h2>
            <p className="text-sm text-slate-600">Track and manage your submitted papers</p>
          </div>
          <Link
            href="/submit"
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium rounded-lg shadow transition"
          >
            + Submit New Manuscript
          </Link>
        </div>

        {manuscripts && manuscripts.length > 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-6">Title</th>
                  <th className="py-3.5 px-6">Journal</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Submitted Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {manuscripts.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-6 font-semibold text-slate-900">{m.title}</td>
                    <td className="py-4 px-6 text-slate-600">
                      {Array.isArray(m.journals) ? m.journals[0]?.title : (m.journals as { title: string } | null)?.title}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 uppercase">
                        {m.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {new Date(m.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <p className="text-slate-500 mb-2">You have not submitted any manuscripts yet.</p>
            <p className="text-xs text-slate-400">
              Click &quot;Submit New Manuscript&quot; to begin the editorial screening and peer-review process.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}