'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, X, RefreshCw, ExternalLink } from 'lucide-react';

interface EicApprovalActionsProps {
  manuscriptId: string;
  currentStatus: string;
}

export default function EicApprovalActions({
  manuscriptId,
  currentStatus,
}: EicApprovalActionsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleUpdateStatus = async (newStatus: string) => {
    if (!confirm(`Confirm updating manuscript status to "${newStatus.replace('_', ' ')}"?`)) {
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('manuscripts')
      .update({ status: newStatus })
      .eq('id', manuscriptId);

    if (error) {
      alert(`Error updating status: ${error.message}`);
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Link
        href={`/dashboard/editor/manuscript/${manuscriptId}`}
        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded transition flex items-center gap-1"
        title="View full manuscript and review history"
      >
        <span>View Details</span>
        <ExternalLink className="w-3 h-3 text-slate-400" />
      </Link>

      {currentStatus !== 'accepted' && currentStatus !== 'published' && (
        <button
          onClick={() => handleUpdateStatus('accepted')}
          disabled={loading}
          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded shadow-sm transition disabled:opacity-50"
          title="Approve manuscript for publication"
        >
          {loading ? '...' : 'Approve'}
        </button>
      )}

      {currentStatus !== 'revision_requested' && currentStatus !== 'published' && (
        <button
          onClick={() => handleUpdateStatus('revision_requested')}
          disabled={loading}
          className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold rounded shadow-sm transition disabled:opacity-50"
          title="Send back for author revision"
        >
          Revise
        </button>
      )}

      {currentStatus !== 'rejected' && currentStatus !== 'published' && (
        <button
          onClick={() => handleUpdateStatus('rejected')}
          disabled={loading}
          className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold rounded shadow-sm transition disabled:opacity-50"
          title="Reject manuscript"
        >
          Reject
        </button>
      )}
    </div>
  );
}
