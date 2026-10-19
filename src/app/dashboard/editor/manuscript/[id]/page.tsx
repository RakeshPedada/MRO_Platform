'use client';

import { useEffect, useState, use } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  FileText,
  Download,
  History,
  RotateCcw,
  CheckCircle2,
  Clock,
  MessageSquare,
  ShieldAlert,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Manuscript {
  id: string;
  journal_id?: string;
  title: string;
  abstract: string;
  keywords: string[];
  status: string;
  file_url: string;
  created_at: string;
  profiles: { full_name: string; email: string; affiliation: string } | null;
  journals: { id: string; title: string } | null;
}

interface Reviewer {
  id: string;
  full_name: string;
  email: string;
  affiliation: string;
}

interface Assignment {
  id: string;
  status: string;
  reviewer: { full_name: string; email: string } | null;
  review_reports: {
    recommendation: string;
    comments_for_author: string;
    confidential_comments_for_editor: string;
  } | null;
}

interface ManuscriptRevision {
  id: string;
  manuscript_id: string;
  revision_round: number;
  rebuttal_letter: string;
  revised_file_url: string;
  submitted_at: string;
  signed_url?: string;
}

export default function EditorManuscriptDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const supabase = createClient();

  const [manuscript, setManuscript] = useState<Manuscript | null>(null);
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [revisions, setRevisions] = useState<ManuscriptRevision[]>([]);
  const [selectedReviewerId, setSelectedReviewerId] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Publishing form state
  const [publishing, setPublishing] = useState(false);
  const [volume, setVolume] = useState('1');
  const [issue, setIssue] = useState('1');
  const [pages, setPages] = useState('1-8');

  const loadData = async () => {
    setLoading(true);

    const { data: mData, error: mError } = await supabase
      .from('manuscripts')
      .select('*, profiles:author_id(full_name, email, affiliation), journals(id, title)')
      .eq('id', id)
      .single();

    if (mError) {
      setErrorMsg(mError.message);
      setLoading(false);
      return;
    }

    setManuscript(mData);

    // Get signed URL for latest manuscript PDF download
    if (mData?.file_url) {
      const { data: signData } = await supabase.storage
        .from('manuscripts')
        .createSignedUrl(mData.file_url, 3600);
      if (signData?.signedUrl) setDownloadUrl(signData.signedUrl);
    }

    // Load available reviewers
    const { data: rData } = await supabase
      .from('profiles')
      .select('id, full_name, email, affiliation')
      .in('role', ['reviewer', 'editor', 'editor_in_chief', 'admin']);

    if (rData) {
      setReviewers(rData);
      if (rData.length > 0) setSelectedReviewerId(rData[0].id);
    }

    // Load assignments and reports
    const { data: aData } = await supabase
      .from('review_assignments')
      .select('id, status, reviewer:reviewer_id(full_name, email), review_reports(*)')
      .eq('manuscript_id', id);

    if (aData) {
      const formatted = aData.map((a: any) => ({
        ...a,
        review_reports: Array.isArray(a.review_reports) ? a.review_reports[0] : a.review_reports,
      }));
      setAssignments(formatted);
    }

    // Load revision round histories
    const { data: revData } = await supabase
      .from('manuscript_revisions')
      .select('*')
      .eq('manuscript_id', id)
      .order('revision_round', { ascending: true });

    if (revData && revData.length > 0) {
      const withSigned = await Promise.all(
        revData.map(async (rev: any) => {
          if (rev.revised_file_url) {
            const { data: sData } = await supabase.storage
              .from('manuscripts')
              .createSignedUrl(rev.revised_file_url, 3600);
            return { ...rev, signed_url: sData?.signedUrl || '' };
          }
          return rev;
        })
      );
      setRevisions(withSigned);
    } else {
      setRevisions([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAssignReviewer = async () => {
    if (!selectedReviewerId) return;

    const { error } = await supabase.from('review_assignments').insert({
      manuscript_id: id,
      reviewer_id: selectedReviewerId,
      status: 'invited',
    });

    if (error) {
      alert(`Assignment failed: ${error.message}`);
    } else {
      if (manuscript?.status === 'submitted' || manuscript?.status === 'under_screening') {
        await supabase
          .from('manuscripts')
          .update({ status: 'under_review' })
          .eq('id', id);
      }
      loadData();
    }
  };

  const handleReinviteReviewer = async (assignmentId: string) => {
    if (!confirm('Re-invite this reviewer to assess the newly revised manuscript draft?')) {
      return;
    }

    const { error } = await supabase
      .from('review_assignments')
      .update({ status: 're_invited' })
      .eq('id', assignmentId);

    if (error) {
      alert(`Failed to re-invite reviewer: ${error.message}`);
    } else {
      await supabase
        .from('manuscripts')
        .update({ status: 'under_review' })
        .eq('id', id);
      alert('Reviewer re-invited successfully. Status set to "re_invited".');
      loadData();
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    setStatusUpdating(true);
    const { error } = await supabase
      .from('manuscripts')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert(`Status update failed: ${error.message}`);
    } else {
      loadData();
    }
    setStatusUpdating(false);
  };

  const handlePublish = async () => {
    if (!manuscript) return;
    setPublishing(true);

    try {
      // 1. Generate DOI (e.g., 10.5555/mro.2026.d4e36f74)
      const year = new Date().getFullYear();
      const shortId = manuscript.id.slice(0, 8);
      const generatedDoi = `10.5555/mro.${year}.${shortId}`;

      const targetJournalId = manuscript.journal_id || manuscript.journals?.id;
      if (!targetJournalId) throw new Error('Missing target journal ID');

      // 2. Insert into published_articles
      const { error: pubError } = await supabase.from('published_articles').insert({
        manuscript_id: manuscript.id,
        journal_id: targetJournalId,
        doi: generatedDoi,
        volume: parseInt(volume, 10),
        issue: parseInt(issue, 10),
        pages,
      });

      if (pubError) throw pubError;

      // 3. Mark manuscript as published
      const { error: statusError } = await supabase
        .from('manuscripts')
        .update({ status: 'published' })
        .eq('id', manuscript.id);

      if (statusError) throw statusError;

      alert(`Published successfully! Official DOI: ${generatedDoi}`);
      loadData();
    } catch (err: any) {
      alert(`Publishing failed: ${err.message}`);
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 text-sm">
        Loading manuscript details...
      </div>
    );
  }

  if (!manuscript) {
    return (
      <div className="min-h-screen p-8 bg-slate-50 text-center">
        <p className="text-red-600 font-semibold">{errorMsg || 'Manuscript not found.'}</p>
        <Link href="/dashboard/editor" className="mt-4 inline-block text-blue-700 underline text-sm">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/editor"
            className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Editorial Dashboard</span>
          </Link>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 font-bold text-xs rounded-full uppercase tracking-wider">
            STATUS: {manuscript.status.replace('_', ' ')}
          </span>
        </div>

        {/* Paper Details Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">
            {manuscript.journals?.title}
          </p>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{manuscript.title}</h1>
          <p className="text-xs text-slate-600">
            <strong>Author:</strong> {manuscript.profiles?.full_name} ({manuscript.profiles?.affiliation}) &bull;{' '}
            {manuscript.profiles?.email}
          </p>

          <div className="pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">Abstract</h2>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 font-serif">
              {manuscript.abstract}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap gap-1.5">
              {manuscript.keywords?.map((k, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-full"
                >
                  {k}
                </span>
              ))}
            </div>

            {downloadUrl ? (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Current Manuscript PDF</span>
              </a>
            ) : (
              <span className="text-xs text-slate-400">File link unavailable</span>
            )}
          </div>
        </div>

        {/* Sprint 3: Revision Round Histories & Author Rebuttals */}
        {revisions && revisions.length > 0 && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#0b1b3d] flex items-center gap-2">
                <History className="w-5 h-5 text-amber-600" />
                <span>Manuscript Revision Histories &amp; Author Rebuttal Rounds</span>
              </h2>
              <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                {revisions.length} Revision {revisions.length === 1 ? 'Round' : 'Rounds'} Submitted
              </span>
            </div>

            <div className="space-y-4">
              {revisions.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-amber-50/40 border border-amber-200 rounded-lg p-5 text-xs space-y-3"
                >
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-amber-600 text-white font-bold text-[10px] rounded uppercase tracking-wider">
                        Revision Round {rev.revision_round}
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        Submitted on {new Date(rev.submitted_at).toLocaleDateString()} at{' '}
                        {new Date(rev.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {rev.signed_url && (
                      <a
                        href={rev.signed_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-50 text-amber-900 border border-amber-300 rounded font-semibold text-[11px] shadow-sm transition"
                      >
                        <Download className="w-3 h-3 text-amber-700" />
                        <span>Download Round {rev.revision_round} PDF</span>
                      </a>
                    )}
                  </div>

                  <div>
                    <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block mb-1">
                      Author Rebuttal &amp; Point-by-Point Response to Reviewers:
                    </span>
                    <pre className="p-3 bg-white rounded border border-amber-100 text-slate-800 font-mono text-[11px] whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                      {rev.rebuttal_letter}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2-Column Workspaces */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reviewer Assignment Column */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Assign Peer Reviewer</h2>
            <p className="text-xs text-slate-500">
              Select an authorized reviewer to assess this manuscript or revised draft.
            </p>

            <div className="flex gap-2">
              <select
                value={selectedReviewerId}
                onChange={(e) => setSelectedReviewerId(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              >
                {reviewers.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.full_name} ({r.affiliation})
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssignReviewer}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition"
              >
                Assign
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                Assigned Reviewers &amp; Status
              </h3>
              {assignments.length > 0 ? (
                <div className="space-y-3">
                  {assignments.map((a) => (
                    <div
                      key={a.id}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex flex-wrap justify-between items-center gap-2"
                    >
                      <div>
                        <p className="font-bold text-slate-900">{a.reviewer?.full_name}</p>
                        <p className="text-[11px] text-slate-500">{a.reviewer?.email}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[10px] uppercase">
                          {a.status}
                        </span>

                        {/* Sprint 3: Re-Invite Reviewer button when revisions exist */}
                        {revisions.length > 0 && a.status === 'completed' && (
                          <button
                            onClick={() => handleReinviteReviewer(a.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded shadow-sm transition"
                            title="Re-invite reviewer for revised manuscript round"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Re-Invite</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No reviewers assigned yet.</p>
              )}
            </div>
          </div>

          {/* Editorial Decision & Publishing Column */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Editorial Decision</h2>
            <p className="text-xs text-slate-500">
              Review completed evaluation reports and record the section editorial decision.
            </p>

            {/* Review Reports Feedback */}
            <div className="space-y-3">
              {assignments
                .filter((a) => a.review_reports)
                .map((a) => (
                  <div key={a.id} className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs space-y-2">
                    <div className="flex justify-between items-center font-bold text-blue-900">
                      <span>Recommendation:</span>
                      <span className="uppercase px-2 py-0.5 bg-blue-200 rounded text-[10px]">
                        {a.review_reports?.recommendation.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-slate-800">
                      <strong>Author Comments:</strong> {a.review_reports?.comments_for_author}
                    </p>
                    <p className="text-slate-600 italic">
                      <strong>Confidential Editor Note:</strong>{' '}
                      {a.review_reports?.confidential_comments_for_editor || 'None'}
                    </p>
                  </div>
                ))}
              {assignments.filter((a) => a.review_reports).length === 0 && (
                <p className="text-xs text-slate-400">No review reports submitted yet.</p>
              )}
            </div>

            {/* Action Buttons: Accept / Request Revision / Reject */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
              <button
                disabled={statusUpdating}
                onClick={() => handleUpdateStatus('accepted')}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
              >
                Accept Manuscript
              </button>
              <button
                disabled={statusUpdating}
                onClick={() => handleUpdateStatus('revision_requested')}
                className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
              >
                Request Revision
              </button>
              <button
                disabled={statusUpdating}
                onClick={() => handleUpdateStatus('rejected')}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
              >
                Reject
              </button>
            </div>

            {/* Ready for Publication Box (Only shows when Accepted) */}
            {manuscript.status === 'accepted' && (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-3">
                <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                  Ready for Publication
                </h3>
                <p className="text-xs text-emerald-700">
                  Assign volume, issue, and pagination parameters to generate the official DOI and publish open-access.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600">Volume</label>
                    <input
                      type="number"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      className="w-full px-2 py-1 text-xs border rounded border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600">Issue</label>
                    <input
                      type="number"
                      value={issue}
                      onChange={(e) => setIssue(e.target.value)}
                      className="w-full px-2 py-1 text-xs border rounded border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600">Pages</label>
                    <input
                      type="text"
                      value={pages}
                      onChange={(e) => setPages(e.target.value)}
                      className="w-full px-2 py-1 text-xs border rounded border-slate-300 bg-white"
                    />
                  </div>
                </div>
                <button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded shadow transition disabled:opacity-50"
                >
                  {publishing ? 'Publishing...' : 'Assign DOI & Publish Paper'}
                </button>
              </div>
            )}

            {/* Published Badge if already published */}
            {manuscript.status === 'published' && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center text-xs font-bold text-blue-900">
                This manuscript is officially published and live in the public catalog.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}