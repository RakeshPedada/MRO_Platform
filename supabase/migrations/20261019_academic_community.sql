-- ==============================================================================
-- MANI Research Organization (MRO) - Academic Community & Researcher Directory
-- Migration: 20261019_academic_community.sql
-- Description: Tables, indexes, and Row Level Security (RLS) policies for:
--   1. researcher_follows (Academic follow/bookmark network)
--   2. community_posts (Public scholarly discussion board)
--   3. community_comments (Discussion thread responses)
-- ==============================================================================

-- 1. Researcher Follows / Academic Bookmarks
CREATE TABLE IF NOT EXISTS public.researcher_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_follower_following UNIQUE (follower_id, following_id)
);

-- Enable RLS on researcher_follows
ALTER TABLE public.researcher_follows ENABLE ROW LEVEL SECURITY;

-- Everyone can view follow relationships
CREATE POLICY "Public read researcher follows"
  ON public.researcher_follows
  FOR SELECT
  USING (true);

-- Authenticated users can follow a researcher
CREATE POLICY "Authenticated users can follow"
  ON public.researcher_follows
  FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

-- Authenticated users can unfollow
CREATE POLICY "Users can remove their own follows"
  ON public.researcher_follows
  FOR DELETE
  USING (auth.uid() = follower_id);

-- Indexes for follow queries
CREATE INDEX IF NOT EXISTS idx_researcher_follows_follower ON public.researcher_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_researcher_follows_following ON public.researcher_follows(following_id);

-- 2. Community Research Discussions
CREATE TABLE IF NOT EXISTS public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'General Discussion',
  tags text[] DEFAULT '{}',
  upvotes integer DEFAULT 0,
  pinned boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on community_posts
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Everyone can view community posts
CREATE POLICY "Public read community posts"
  ON public.community_posts
  FOR SELECT
  USING (true);

-- Verified authenticated users can post discussions
CREATE POLICY "Authenticated users can create community posts"
  ON public.community_posts
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Authors can update their own posts
CREATE POLICY "Authors can update own community posts"
  ON public.community_posts
  FOR UPDATE
  USING (auth.uid() = author_id);

-- Authors can delete their own posts
CREATE POLICY "Authors can delete own community posts"
  ON public.community_posts
  FOR DELETE
  USING (auth.uid() = author_id);

-- 3. Community Discussion Comments
CREATE TABLE IF NOT EXISTS public.community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on community_comments
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read community comments"
  ON public.community_comments
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can comment"
  ON public.community_comments
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete own comments"
  ON public.community_comments
  FOR DELETE
  USING (auth.uid() = author_id);

-- Indexes for fast community queries
CREATE INDEX IF NOT EXISTS idx_community_posts_author ON public.community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_comments_post ON public.community_comments(post_id);
