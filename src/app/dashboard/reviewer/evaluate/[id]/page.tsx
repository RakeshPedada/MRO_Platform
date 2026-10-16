'use client';

import { useEffect, useState, use } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ReviewerEvaluationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();

  const [assignment, setAssignment] = useState<any>(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [recommendation, setRecommendation] = useState('minor_revision');
  const [commentsForAuthor, setCommentsForAuthor] = useState('');
  const [confidentialComments, setConfidentialComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAssignment() {
      const { data, error } = await supabase
        .from('review_assignments')
        .select('*, manuscripts(*)')
        .eq('id', id)
        .single();

      if (data) {
        setAssignment(data);
        if (data.manuscripts?.file_url) {
          const { data: signData } = await supabase.storage
            .from('manuscripts')
            .createSignedUrl(data.manuscripts.file_url, 3600);
          if (signData?.signedUrl) setDownloadUrl(signData.signedUrl);
        }
      }
      setLoading(false);
    }
    loadAssignment();
  }, [id]);

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('You must be logged in.');
      setSubmitting(false);
      return;
    }

    // 1. Insert review report
    const { error: reportError } = await supabase.from('review_reports').insert({
      assignment_id: id,
      manuscript_id: assignment.manuscript_id,
      reviewer_id: user.id,
      recommendation,
      comments_for_author: commentsForAuthor,
      confidential_comments_for_editor: confidentialComments,
    });

    if (reportError) {
      alert(`Error submitting report: ${reportError.message}`);
      setSubmitting(false);
      return;
    }

    // 2. Mark assignment as completed
    await supabase
      .from('review_assignments')
      .update({ status: 'completed' })
      .eq('id', id);

    router.push('/dashboard/reviewer');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
        Loading evaluation workspace...
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen p-8 bg-slate-50 text-center">
        <p className="text-red-600">Assignment not found.</p>
        <Link href="/dashboard/reviewer" className="mt-4 inline-block text-blue-700 underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Peer Review Assessment</h1>
            <p className="text-xs text-slate-500">Provide an objective, constructive evaluation.</p>
          </div>
          <Link href="/dashboard/reviewer" className="text-sm font-semibold text-blue-700 hover:underline">
            &larr; Back to Dashboard
          </Link>
        </div>

        {/* Paper Summary Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900">{assignment.manuscripts?.title}</h2>
          <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100">
            {assignment.manuscripts?.abstract}
          </p>
          {downloadUrl && (
            <a
              href={downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow transition"
            >
              Download Manuscript PDF
            </a>
          )}
        </div>

        {/* Evaluation Form */}
        <form onSubmit={handleSubmitReport} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">
              Overall Recommendation
            </label>
            <select
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="accept">Accept without revisions</option>
              <option value="minor_revision">Minor Revisions required</option>
              <option value="major_revision">Major Revisions required</option>
              <option value="reject">Reject</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">
              Comments for the Author (Shared with Author)
            </label>
            <textarea
              required
              rows={6}
              value={commentsForAuthor}
              onChange={(e) => setCommentsForAuthor(e.target.value)}
              placeholder="Highlight strengths, methodological concerns, and specific improvements needed..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">
              Confidential Comments for the Editor (Author will NOT see this)
            </label>
            <textarea
              rows={3}
              value={confidentialComments}
              onChange={(e) => setConfidentialComments(e.target.value)}
              placeholder="Any confidential remarks regarding ethics, originality, or overall suitability..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm rounded-lg shadow transition disabled:opacity-50"
          >
            {submitting ? 'Submitting Report...' : 'Submit Final Review Assessment'}
          </button>
        </form>
      </div>
    </div>
  );
}