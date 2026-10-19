'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { UserCheck, UserPlus, Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';

interface ResearcherFollowButtonProps {
  researcherId: string;
  initialFollowCount?: number;
  initialIsFollowing?: boolean;
  variant?: 'primary' | 'compact' | 'bookmark';
}

export default function ResearcherFollowButton({
  researcherId,
  initialFollowCount = 0,
  initialIsFollowing = false,
  variant = 'primary',
}: ResearcherFollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followCount, setFollowCount] = useState(initialFollowCount);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Check local storage fallback first
    try {
      const stored = localStorage.getItem(`mro_follow_${researcherId}`);
      if (stored !== null) {
        setIsFollowing(stored === 'true');
      }
    } catch {
      // ignore localStorage errors
    }

    // Check user auth and Supabase follow status
    async function checkFollowStatus() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setCurrentUserId(user.id);
        if (user.id === researcherId) return; // Cannot follow self

        try {
          const { data, error } = await supabase
            .from('researcher_follows')
            .select('id')
            .eq('follower_id', user.id)
            .eq('following_id', researcherId)
            .maybeSingle();

          if (!error && data) {
            setIsFollowing(true);
          }
        } catch {
          // Table may not exist yet, fallback preserved
        }
      }
    }

    checkFollowStatus();
  }, [researcherId, supabase]);

  const handleToggle = async () => {
    if (loading) return;
    if (currentUserId === researcherId) {
      alert('You cannot follow your own academic profile.');
      return;
    }

    setLoading(true);
    const nextState = !isFollowing;
    const nextCount = Math.max(0, followCount + (nextState ? 1 : -1));

    // Optimistic UI update
    setIsFollowing(nextState);
    setFollowCount(nextCount);

    try {
      localStorage.setItem(`mro_follow_${researcherId}`, String(nextState));
    } catch {
      // ignore
    }

    if (currentUserId) {
      try {
        if (nextState) {
          const { error } = await supabase.from('researcher_follows').insert({
            follower_id: currentUserId,
            following_id: researcherId,
          });
          if (error && error.code !== 'PGRST205') {
            console.warn('Follow table error, fallback retained:', error.message);
          }
        } else {
          const { error } = await supabase
            .from('researcher_follows')
            .delete()
            .eq('follower_id', currentUserId)
            .eq('following_id', researcherId);
          if (error && error.code !== 'PGRST205') {
            console.warn('Unfollow table error, fallback retained:', error.message);
          }
        }
      } catch (err) {
        console.warn('Follow sync error:', err);
      }
    }

    setLoading(false);
  };

  if (variant === 'bookmark') {
    return (
      <button
        onClick={handleToggle}
        disabled={loading || currentUserId === researcherId}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
          isFollowing
            ? 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        } ${currentUserId === researcherId ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isFollowing ? 'Remove Bookmark' : 'Bookmark Researcher'}
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : isFollowing ? (
          <BookmarkCheck className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
        ) : (
          <Bookmark className="w-3.5 h-3.5 text-slate-500" />
        )}
        <span>{isFollowing ? 'Bookmarked' : 'Bookmark'}</span>
        <span className="text-[10px] text-slate-400 font-mono ml-0.5">({followCount})</span>
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleToggle}
        disabled={loading || currentUserId === researcherId}
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition border ${
          isFollowing
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
        } ${currentUserId === researcherId ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : isFollowing ? (
          <UserCheck className="w-3 h-3 text-emerald-600" />
        ) : (
          <UserPlus className="w-3 h-3 text-slate-600" />
        )}
        <span>{isFollowing ? 'Following' : 'Follow'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading || currentUserId === researcherId}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm border ${
        isFollowing
          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
          : 'bg-[#0284c7] border-[#0284c7] text-white hover:bg-[#0369a1]'
      } ${currentUserId === researcherId ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : isFollowing ? (
        <UserCheck className="w-4 h-4 text-emerald-700" />
      ) : (
        <UserPlus className="w-4 h-4 text-white" />
      )}
      <span>{isFollowing ? 'Following Researcher' : 'Follow Academic'}</span>
      <span className="text-[11px] px-1.5 py-0.5 rounded-full font-mono bg-black/10">
        {followCount}
      </span>
    </button>
  );
}
