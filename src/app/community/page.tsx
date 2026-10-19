'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import InstitutionalHeader from '@/components/layout/InstitutionalHeader';
import InstitutionalFooter from '@/components/layout/InstitutionalFooter';
import { createClient } from '@/lib/supabase/client';
import {
  MessageSquare,
  Sparkles,
  Search,
  Filter,
  Plus,
  ThumbsUp,
  Share2,
  Building2,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Send,
  X,
  Tag,
  Clock,
  BookOpen,
  Users,
  MessageCircle,
  HelpCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface DiscussionComment {
  id: string;
  author_name: string;
  author_affiliation: string;
  content: string;
  created_at: string;
}

interface DiscussionPost {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author_id: string;
  author_name: string;
  author_affiliation: string;
  author_role: string;
  upvotes: number;
  user_has_upvoted?: boolean;
  created_at: string;
  pinned?: boolean;
  comments: DiscussionComment[];
}

const CATEGORIES = [
  'All Topics',
  'Methodologies & Protocols',
  'Peer Review & Publishing Advice',
  'Interdisciplinary Collaboration',
  'Open Science & Reproducibility',
  'Calls for Papers & Special Issues',
];

// Initial canonical scholarly community discussions
const SEED_DISCUSSIONS: DiscussionPost[] = [
  {
    id: 'seed-post-1',
    title: 'Best practices for open-data benchmarking in high-voltage transient modeling',
    content:
      'When publishing numerical simulations for transmission line fault analysis, what repository formats (e.g., IEEE PES datasets vs. Zenodo HDF5 archives) ensure the highest level of computational reproducibility for peer reviewers? We have observed divergent results across solver time-steps.',
    category: 'Methodologies & Protocols',
    tags: ['HVDC', 'Numerical Simulation', 'Open Data', 'Reproducibility'],
    author_id: 'fellow-venkata-rao',
    author_name: 'Dr. K. Venkata Rao',
    author_affiliation: 'School of Electrical & Renewable Energy Engineering',
    author_role: 'editor',
    upvotes: 38,
    user_has_upvoted: false,
    created_at: '2026-10-18T10:30:00Z',
    pinned: true,
    comments: [
      {
        id: 'c1',
        author_name: 'Pedada Rakesh',
        author_affiliation: 'National Institute Of Technology Nagaland',
        content:
          'In our experience, publishing the raw solver configuration alongside the normalized CSV waveforms on Zenodo with an assigned DOI accelerates reviewer verification significantly.',
        created_at: '2026-10-18T14:15:00Z',
      },
      {
        id: 'c2',
        author_name: 'Dr. Suresh Kumar R.',
        author_affiliation: 'National Institute of Technology',
        content:
          'Containerized execution scripts (e.g., Dockerized Python/Julia environments) eliminate ODE solver discrepancies across operating systems.',
        created_at: '2026-10-18T16:40:00Z',
      },
    ],
  },
  {
    id: 'seed-post-2',
    title: 'Addressing reviewer concerns regarding synthetic inertia metrics in microgrids',
    content:
      'During manuscript revisions, referees frequently request physical hardware-in-the-loop (HIL) testing alongside software simulations. How do other research groups bridge this gap when HIL testbeds are constrained?',
    category: 'Peer Review & Publishing Advice',
    tags: ['Synthetic Inertia', 'Microgrids', 'Peer Review', 'Author Advice'],
    author_id: 'eic-manikanta',
    author_name: 'Nangireddy Manikanta',
    author_affiliation: 'MANI Research Organization',
    author_role: 'editor_in_chief',
    upvotes: 27,
    user_has_upvoted: false,
    created_at: '2026-10-17T08:00:00Z',
    pinned: true,
    comments: [
      {
        id: 'c3',
        author_name: 'Dr. David H. Zhang',
        author_affiliation: 'Materials Science & Nano-Engineering Institute',
        content:
          'Providing transparent sensitivity analyses with parameter uncertainty bounds is accepted by editors when experimental infrastructure is unavailable.',
        created_at: '2026-10-17T11:20:00Z',
      },
    ],
  },
  {
    id: 'seed-post-3',
    title: 'Call for Collaborators: Graph Neural Networks for Power Grid Anomaly Localization',
    content:
      'Our team is formulating an interdisciplinary initiative combining topological deep learning with synchrophasor PMU telemetry. Looking for collaborators with access to multi-regional transmission datasets to validate graph spatial-temporal layers.',
    category: 'Interdisciplinary Collaboration',
    tags: ['Graph Neural Networks', 'PMU Telemetry', 'Collaboration', 'AI in Energy'],
    author_id: 'fellow-suresh-kumar',
    author_name: 'Dr. Suresh Kumar R.',
    author_affiliation: 'National Institute of Technology',
    author_role: 'editor',
    upvotes: 21,
    user_has_upvoted: false,
    created_at: '2026-10-15T15:20:00Z',
    pinned: false,
    comments: [],
  },
  {
    id: 'seed-post-4',
    title: 'CC BY 4.0 and secondary data reuse in engineering literature: What authors need to know',
    content:
      'A concise overview of author rights under Creative Commons Attribution 4.0: you retain moral copyright while granting the worldwide community unrestricted rights to adapt and translate with proper attribution.',
    category: 'Open Science & Reproducibility',
    tags: ['CC BY 4.0', 'Open Access', 'Copyright', 'Academic Publishing'],
    author_id: 'eic-manikanta',
    author_name: 'Nangireddy Manikanta',
    author_affiliation: 'MANI Research Organization',
    author_role: 'editor_in_chief',
    upvotes: 34,
    user_has_upvoted: false,
    created_at: '2026-10-14T09:45:00Z',
    pinned: false,
    comments: [],
  },
];

export default function AcademicCommunityPage() {
  const [posts, setPosts] = useState<DiscussionPost[]>(SEED_DISCUSSIONS);
  const [selectedCategory, setSelectedCategory] = useState('All Topics');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentProfile, setCurrentProfile] = useState<any>(null);

  // New post form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Methodologies & Protocols');
  const [newTags, setNewTags] = useState('');
  const [newContent, setNewContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    // 1. Fetch user session and profile
    async function initUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setCurrentUser(user);
        const { data: prof } = await supabase
          .from('profiles')
          .select('full_name, affiliation, role')
          .eq('id', user.id)
          .single();
        if (prof) setCurrentProfile(prof);
      }
    }
    initUser();

    // 2. Fetch live community posts from Supabase if table exists
    async function loadLivePosts() {
      try {
        const { data: dbPosts, error } = await supabase
          .from('community_posts')
          .select(`
            id,
            title,
            content,
            category,
            tags,
            upvotes,
            pinned,
            created_at,
            author_id,
            profiles:author_id (
              full_name,
              affiliation,
              role
            )
          `)
          .order('created_at', { ascending: false });

        if (!error && dbPosts && dbPosts.length > 0) {
          const formatted: DiscussionPost[] = dbPosts.map((p: any) => ({
            id: p.id,
            title: p.title,
            content: p.content,
            category: p.category || 'General Discussion',
            tags: p.tags || [],
            author_id: p.author_id,
            author_name: p.profiles?.full_name || 'Academic Researcher',
            author_affiliation: p.profiles?.affiliation || 'Affiliated Institution',
            author_role: p.profiles?.role || 'author',
            upvotes: p.upvotes || 0,
            user_has_upvoted: false,
            created_at: p.created_at,
            pinned: p.pinned || false,
            comments: [],
          }));

          // Merge live posts with seed posts
          setPosts([...formatted, ...SEED_DISCUSSIONS]);
        }
      } catch (err) {
        // Fallback to seeds seamlessly
        console.warn('Community posts live query fallback active');
      }
    }
    loadLivePosts();
  }, [supabase]);

  // Filtered discussions
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All Topics' || post.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        post.author_name.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  // Handle post upvote
  const handleUpvote = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextVoted = !p.user_has_upvoted;
          return {
            ...p,
            upvotes: p.upvotes + (nextVoted ? 1 : -1),
            user_has_upvoted: nextVoted,
          };
        }
        return p;
      })
    );
  };

  // Handle submit comment
  const handleAddComment = (postId: string) => {
    if (!replyText.trim()) return;

    const authorName = currentProfile?.full_name || (currentUser ? 'Verified Academic' : 'Academic Colleague');
    const authorAffil = currentProfile?.affiliation || 'Academic Researcher';

    const newComment: DiscussionComment = {
      id: `c-${Date.now()}`,
      author_name: authorName,
      author_affiliation: authorAffil,
      content: replyText.trim(),
      created_at: new Date().toISOString(),
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );

    setReplyText('');
    setActiveReplyPostId(null);
  };

  // Handle create new post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setSubmitting(true);

    const authorId = currentUser?.id || 'guest-author';
    const authorName = currentProfile?.full_name || 'Verified Academic';
    const authorAffil = currentProfile?.affiliation || 'MANI Research Organization Scholar';
    const authorRole = currentProfile?.role || 'author';

    const parsedTags = newTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const createdPost: DiscussionPost = {
      id: `post-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      tags: parsedTags.length > 0 ? parsedTags : ['Academic Discussion'],
      author_id: authorId,
      author_name: authorName,
      author_affiliation: authorAffil,
      author_role: authorRole,
      upvotes: 1,
      user_has_upvoted: true,
      created_at: new Date().toISOString(),
      pinned: false,
      comments: [],
    };

    // Attempt to persist to Supabase if authenticated
    if (currentUser) {
      try {
        await supabase.from('community_posts').insert({
          author_id: currentUser.id,
          title: newTitle.trim(),
          content: newContent.trim(),
          category: newCategory,
          tags: parsedTags,
        });
      } catch (err) {
        console.warn('Sync to community_posts fallback retained:', err);
      }
    }

    setPosts([createdPost, ...posts]);
    setSubmitting(false);
    setIsModalOpen(false);

    // Reset form
    setNewTitle('');
    setNewContent('');
    setNewTags('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <InstitutionalHeader />

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8 flex-1 w-full">
        {/* Banner Section */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider rounded-md border border-sky-100">
                <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                <span>Academic Community Forum</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b1b3d] tracking-tight leading-tight">
                Scholarly Research Discussions &amp; Peer Exchange
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect with verified authors, peer reviewers, and section editors across multidisciplinary engineering sciences. Discuss experimental methodologies, publication protocols, and collaborative research initiatives.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-xl shadow-md transition"
              >
                <Plus className="w-4 h-4" />
                <span>Start Discussion</span>
              </button>
            </div>
          </div>
        </section>

        {/* Mandatory COPE Integrity & Confidentiality Safeguard */}
        <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 flex items-start gap-3.5 text-xs text-amber-950">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-amber-900 text-xs uppercase tracking-wider">
              Academic Integrity &amp; Double-Blind Confidentiality Protocol
            </h3>
            <p className="text-amber-800 leading-relaxed text-[11px]">
              <strong>Strict Guardrail:</strong> Discussion of unpublished manuscripts, confidential reviewer reports, or blinded author identities currently under peer review is strictly prohibited in accordance with the <strong>Committee on Publication Ethics (COPE)</strong> standards. Only methodologies, published works, open-access datasets, and general scholarly inquiries are permitted.
            </p>
          </div>
        </section>

        {/* Category Filters Bar */}
        <section className="flex flex-wrap items-center gap-2 pb-2 overflow-x-auto">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-[#0b1b3d] text-white border-[#0b1b3d] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {category}
            </button>
          ))}
        </section>

        {/* Search & Statistics Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, questions, or tags..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 shadow-sm"
            />
          </div>

          <div className="text-xs text-slate-500 self-end sm:self-center">
            Showing <strong className="text-slate-900">{filteredPosts.length}</strong> active discussion threads
          </div>
        </div>

        {/* Discussion Posts Feed */}
        <div className="space-y-5">
          {filteredPosts.map((post) => {
            const initials = post.author_name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();

            return (
              <div
                key={post.id}
                className={`bg-white border rounded-2xl p-6 shadow-sm transition hover:border-slate-300 space-y-4 ${
                  post.pinned ? 'border-sky-300 bg-sky-50/20' : 'border-slate-200'
                }`}
              >
                {/* Header: Author Info, Category, Timestamp */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0b1b3d] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                      {initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/researchers/${post.author_id}`}
                          className="font-bold text-sm text-slate-900 hover:text-sky-700 transition"
                        >
                          {post.author_name}
                        </Link>
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded border border-slate-200 capitalize">
                          {post.author_role.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>{post.author_affiliation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {post.pinned && (
                      <span className="bg-amber-100 text-amber-900 font-bold text-[10px] px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        Pinned Topic
                      </span>
                    )}
                    <span className="bg-sky-50 text-sky-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-sky-200">
                      {post.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="space-y-2">
                  <h2 className="text-base sm:text-lg font-bold text-[#0b1b3d] leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                      >
                        <Tag className="w-2.5 h-2.5 text-slate-400" />
                        <span>{t}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleUpvote(post.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition border ${
                        post.user_has_upvoted
                          ? 'bg-sky-50 border-sky-300 text-sky-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${post.user_has_upvoted ? 'fill-sky-600 text-sky-600' : ''}`} />
                      <span>Endorse</span>
                      <span className="font-mono text-[11px] text-slate-400">({post.upvotes})</span>
                    </button>

                    <button
                      onClick={() =>
                        setActiveReplyPostId(activeReplyPostId === post.id ? null : post.id)
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-slate-500" />
                      <span>Responses</span>
                      <span className="font-mono text-[11px] text-slate-400">({post.comments.length})</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link to discussion copied to clipboard!');
                      }
                    }}
                    className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-700 transition text-[11px]"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Comments & Replies Accordion */}
                {(activeReplyPostId === post.id || post.comments.length > 0) && (
                  <div className="pt-4 border-t border-slate-100 space-y-3 bg-slate-50/50 p-4 rounded-xl">
                    {post.comments.length > 0 && (
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Scholarly Responses ({post.comments.length})
                        </span>
                        {post.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="bg-white border border-slate-200 rounded-lg p-3 text-xs space-y-1 shadow-2xs"
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <strong className="text-slate-900">{comment.author_name}</strong>
                              <span className="text-slate-400 font-mono text-[10px]">
                                {new Date(comment.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                            <p className="text-slate-500 text-[10px]">{comment.author_affiliation}</p>
                            <p className="text-slate-700 text-xs pt-1 leading-relaxed">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add reply input */}
                    <div className="space-y-2 pt-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={activeReplyPostId === post.id ? replyText : ''}
                          onChange={(e) => {
                            setActiveReplyPostId(post.id);
                            setReplyText(e.target.value);
                          }}
                          placeholder="Write a scholarly response..."
                          className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="px-3 py-2 bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 shrink-0"
                        >
                          <Send className="w-3 h-3" />
                          <span>Reply</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal: Start New Academic Discussion */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#0b1b3d]">
                      Start Academic Discussion
                    </h3>
                    <span className="text-[10px] text-slate-500 block">
                      Post an open methodology, peer-review, or collaborative query
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Discussion Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Sensitivity benchmarks for multi-level inverters in high-power grids"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Academic Category *
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                    >
                      {CATEGORIES.filter((c) => c !== 'All Topics').map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      placeholder="e.g. Inverters, HVDC, Power Systems"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Discussion Content &amp; Scientific Background *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Provide detailed scientific context, experimental parameters, or specific methodologies you want to discuss..."
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                  />
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-0.5">
                  <span className="font-bold block">COPE Confidentiality Reminder:</span>
                  <p>
                    Ensure your query does not reveal pending unpublished manuscripts or blinded peer evaluations.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-xl shadow transition"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Publish Discussion</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <InstitutionalFooter />
    </div>
  );
}
