import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export default async function ReviewerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: assignments } = await supabase
    .from('review_assignments')
    .select(`
      id,
      status,
      created_at,
      manuscripts (
        id,
        title,
        abstract,
        file_url
      )
    `)
    .eq('reviewer_id', user.id);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white py-4 px-8 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-xl font-bold">MANI Research Organization</h1>
          <p className="text-xs text-slate-400">Peer Reviewer Portal</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{profile?.full_name}</p>
          <span className="inline-block text-xs bg-emerald-600 px-2.5 py-0.5 rounded-full capitalize">
            {profile?.role}
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-4">
        <Breadcrumbs items={[{ label: 'Reviewer Workspace' }]} className="mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Assigned Manuscripts for Review</h2>
        <p className="text-xs text-slate-600 mb-6">Maintain strict confidentiality during evaluation.</p>

        {assignments && assignments.length > 0 ? (
          <div className="space-y-4">
            {assignments.map((item) => {
              const manuscript = Array.isArray(item.manuscripts) ? item.manuscripts[0] : item.manuscripts;
              return (
                <div key={item.id} className="scholarly-card rounded-xl p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{manuscript?.title}</h3>
                    <span
                      className={`status-chip ${
                        item.status === 'completed'
                          ? 'status-chip-published'
                          : item.status === 'accepted'
                          ? 'status-chip-review'
                          : item.status === 'declined'
                          ? 'status-chip-rejected'
                          : 'status-chip-submitted'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{item.status}</span>
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-4">{manuscript?.abstract}</p>
                  <div className="flex gap-3">
                    <Link
                      href={`/dashboard/reviewer/evaluate/${item.id}`}
                      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow transition"
                    >
                      Open Evaluation Form
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <p className="text-slate-500 mb-1">No manuscripts assigned for review yet.</p>
            <p className="text-xs text-slate-400">
              When an editor invites you to review a paper, it will appear here.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}