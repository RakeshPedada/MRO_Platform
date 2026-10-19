'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  FileText,
  Send,
  MessageSquare,
  History,
  CheckCircle2,
  AlertCircle,
  Download,
  ArrowLeft,
} from 'lucide-react';

export default function AuthorRevisePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();

  const [manuscript, setManuscript] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [previousRevisions, setPreviousRevisions] = useState<any[]>([]);
  const [rebuttalLetter, setRebuttalLetter] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // 1. Fetch manuscript
      const { data: mData, error: mError } = await supabase
        .from('manuscripts')
        .select('*, journals(title)')
        .eq('id', id)
        .eq('author_id', user.id)
        .single();

      if (mError || !mData) {
        setErrorMsg('Manuscript not found or unauthorized.');
        setLoading(false);
        return;
      }

      setManuscript(mData);

      // 2. Fetch reviewer reports (comments for author only)
      const { data: rData } = await supabase
        .from('review_assignments')
        .select('id, status, review_reports(recommendation, comments_for_author)')
        .eq('manuscript_id', id);

      if (rData) {
        const authorComments = rData
          .map((a: any) =>
            Array.isArray(a.review_reports) ? a.review_reports[0] : a.review_reports
          )
          .filter((rep: any) => rep && rep.comments_for_author);
        setReviews(authorComments);
      }

      // 3. Fetch past revisions
      const { data: revData } = await supabase
        .from('manuscript_revisions')
        .select('*')
        .eq('manuscript_id', id)
        .order('revision_round', { ascending: true });

      if (revData) {
        setPreviousRevisions(revData);
      }

      setLoading(false);
    }

    loadData();
  }, [id, router, supabase]);

  const handleSubmitRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please select your revised manuscript PDF file.');
      return;
    }
    if (!rebuttalLetter.trim()) {
      alert('Please provide a point-by-point rebuttal letter addressing the reviewer feedback.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Authentication session expired.');

      const nextRound = (previousRevisions.length || 0) + 1;

      // 1. Upload revised PDF
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}_revised_round_${nextRound}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('manuscripts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Insert into manuscript_revisions
      const { error: revError } = await supabase.from('manuscript_revisions').insert({
        manuscript_id: id,
        revision_round: nextRound,
        rebuttal_letter: rebuttalLetter,
        revised_file_url: filePath,
        submitted_at: new Date().toISOString(),
      });

      if (revError) throw revError;

      // 3. Update manuscript file_url and transition status back to under_review
      const { error: updateError } = await supabase
        .from('manuscripts')
        .update({
          file_url: filePath,
          status: 'under_review',
        })
        .eq('id', id);

      if (updateError) throw updateError;

      alert(`Revision Round ${nextRound} submitted successfully! The editorial office has been notified.`);
      router.push('/dashboard/author');
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while uploading revision.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 text-sm">
        Loading revision workspace...
      </div>
    );
  }

  if (errorMsg && !manuscript) {
    return (
      <div className="min-h-screen p-8 bg-slate-50 text-center">
        <p className="text-red-600 font-semibold">{errorMsg}</p>
        <Link href="/dashboard/author" className="mt-4 inline-block text-blue-700 underline text-sm">
          Return to Author Dashboard
        </Link>
      </div>
    );
  }

  const currentRoundNumber = previousRevisions.length + 1;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <Link
              href="/dashboard/author"
              className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1 mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Author Dashboard</span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">
              Submit Manuscript Revision (Round {currentRoundNumber})
            </h1>
            <p className="text-xs text-slate-500">
              {manuscript.journals?.title} &bull; Manuscript ID: {manuscript.id.slice(0, 8)}
            </p>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase">
            STATUS: {manuscript.status.replace('_', ' ')}
          </span>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Paper Overview Box */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Manuscript Title</span>
          <h2 className="text-lg font-bold text-slate-900 leading-snug">{manuscript.title}</h2>
          <p className="text-xs text-slate-600 font-serif leading-relaxed line-clamp-3 bg-slate-50 p-3 rounded border border-slate-100 mt-2">
            {manuscript.abstract}
          </p>
        </div>

        {/* Reviewer Comments for Author */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>Peer Review Feedback &amp; Required Revisions</span>
          </h3>
          <p className="text-xs text-slate-500">
            Please carefully review the referees&apos; constructive comments below and provide corresponding responses in your rebuttal letter.
          </p>

          {reviews && reviews.length > 0 ? (
            <div className="space-y-3 pt-1">
              {reviews.map((rev, idx) => (
                <div key={idx} className="p-4 bg-blue-50/70 border border-blue-200 rounded-lg text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-blue-950 font-bold">
                    <span>Referee Report #{idx + 1}</span>
                    <span className="px-2 py-0.5 bg-blue-200 text-blue-900 rounded font-mono uppercase text-[10px]">
                      {rev.recommendation?.replace('_', ' ') || 'Revision Required'}
                    </span>
                  </div>
                  <div className="text-slate-800 font-serif leading-relaxed whitespace-pre-line pt-1">
                    {rev.comments_for_author}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-500 italic">
              The editor has requested revisions based on preliminary review screening. Please submit your updated draft with corresponding explanations.
            </div>
          )}
        </div>

        {/* Previous Revisions History */}
        {previousRevisions && previousRevisions.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-600" />
              <span>Prior Revision Rounds</span>
            </h3>
            <div className="space-y-2">
              {previousRevisions.map((pr) => (
                <div key={pr.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800">Round {pr.revision_round}</span>
                    <span className="text-slate-400 ml-2">
                      Submitted on {new Date(pr.submitted_at).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Recorded
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Revision Submission Form */}
        <form onSubmit={handleSubmitRevision} className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Submit Revision (Round {currentRoundNumber})
            </h3>
            <p className="text-xs text-slate-500">
              Upload your revised document and detail your changes point-by-point.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Point-by-Point Author Rebuttal Letter <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={8}
              value={rebuttalLetter}
              onChange={(e) => setRebuttalLetter(e.target.value)}
              placeholder="Dear Editor and Reviewers,&#10;&#10;Thank you for the constructive feedback on our manuscript. Below is our detailed point-by-point response to each comment:&#10;&#10;Reviewer Comment 1: [...]&#10;Author Response: [...]&#10;&#10;Reviewer Comment 2: [...]&#10;Author Response: [...]"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 focus:bg-white leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Revised Manuscript PDF File <span className="text-rose-500">*</span>
            </label>
            <input
              type="file"
              required
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Ensure changes in the revised PDF are clearly visible or highlighted as per author guidelines.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <span>Uploading &amp; Submitting Revision...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Confirm &amp; Submit Revision Round {currentRoundNumber}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
