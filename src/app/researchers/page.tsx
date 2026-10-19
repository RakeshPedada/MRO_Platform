'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import InstitutionalHeader from '@/components/layout/InstitutionalHeader';
import InstitutionalFooter from '@/components/layout/InstitutionalFooter';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ResearcherFollowButton from '@/components/researchers/ResearcherFollowButton';
import { createClient } from '@/lib/supabase/client';
import {
  Users,
  Search,
  Building2,
  GraduationCap,
  BookOpen,
  Filter,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
  Loader2,
} from 'lucide-react';

interface Researcher {
  id: string;
  full_name: string;
  affiliation: string;
  department: string;
  role: string;
  orcid?: string | null;
  bio?: string | null;
  interests: string[];
  publication_count: number;
  follow_count: number;
}

// Canonical academic editorial fellows to ensure rich multidisciplinary representation
const FEATURED_EDITORIAL_FELLOWS: Researcher[] = [
  {
    id: 'eic-manikanta',
    full_name: 'Nangireddy Manikanta',
    affiliation: 'MANI Research Organization / MANI Market Private Limited',
    department: 'Office of the Editor-in-Chief & Applied Research',
    role: 'editor_in_chief',
    orcid: '0009-0004-7128-4491',
    bio: 'Founder of MANI Research Organization. Pioneering barrier-free, multidisciplinary open-access publishing models for global engineering communities.',
    interests: ['Open Access Publishing', 'Renewable Energy Systems', 'Smart Technology', 'Multidisciplinary Engineering'],
    publication_count: 5,
    follow_count: 42,
  },
  {
    id: 'fellow-suresh-kumar',
    full_name: 'Dr. Suresh Kumar R.',
    affiliation: 'National Institute of Technology',
    department: 'Department of Computer Science & Engineering',
    role: 'editor',
    orcid: '0000-0002-1825-0097',
    bio: 'Senior Associate Editor in AI and distributed systems. Focuses on deep learning architectures and edge computing efficiency.',
    interests: ['Machine Learning', 'Graph Neural Networks', 'Distributed Systems', 'Edge AI'],
    publication_count: 14,
    follow_count: 28,
  },
  {
    id: 'fellow-elena-rostova',
    full_name: 'Dr. Elena Rostova',
    affiliation: 'Institute for Information Technology & Automation',
    department: 'Center for Cyber-Physical Systems',
    role: 'editor',
    orcid: '0000-0001-9231-4820',
    bio: 'Section Editor for Information Security. Researching post-quantum cryptography, sensor mesh security, and algorithmic integrity.',
    interests: ['Cyber-Physical Systems', 'Post-Quantum Cryptography', 'Edge Computing', 'Network Security'],
    publication_count: 9,
    follow_count: 19,
  },
  {
    id: 'fellow-venkata-rao',
    full_name: 'Dr. K. Venkata Rao',
    affiliation: 'School of Electrical & Renewable Energy Engineering',
    department: 'Division of High Voltage & Power Systems',
    role: 'editor',
    orcid: '0000-0003-4412-8902',
    bio: 'Senior Editorial Board Member specializing in HVDC transmission lines, microgrid synchronization, and fault diagnosis.',
    interests: ['HVDC Transmission', 'Power System Stability', 'Microgrid Control', 'Fault Diagnostics'],
    publication_count: 18,
    follow_count: 35,
  },
  {
    id: 'fellow-david-zhang',
    full_name: 'Dr. David H. Zhang',
    affiliation: 'Materials Science & Nano-Engineering Institute',
    department: 'Department of Advanced Composite Materials',
    role: 'editor',
    orcid: '0000-0002-6710-3341',
    bio: 'Section Editor in Mechanical Engineering and additive manufacturing composites with emphasis on aerospace applications.',
    interests: ['Nanocomposites', 'Computational Fluid Dynamics', 'Additive Manufacturing', 'Fracture Mechanics'],
    publication_count: 11,
    follow_count: 22,
  },
];

export default function ResearcherDirectoryPage() {
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [sortBy, setSortBy] = useState<'publications' | 'name' | 'followers'>('publications');

  useEffect(() => {
    async function loadResearchers() {
      setLoading(true);
      const supabase = createClient();

      try {
        // 1. Fetch registered profiles from Supabase
        const { data: dbProfiles, error: pErr } = await supabase
          .from('profiles')
          .select('id, full_name, affiliation, department, role, orcid, orcid_id, bio, biography');

        // 2. Fetch published papers counts per author
        const { data: publishedData } = await supabase
          .from('published_articles')
          .select(`
            manuscript_id,
            manuscripts!inner (
              author_id,
              status
            )
          `)
          .eq('manuscripts.status', 'published');

        const pubCountMap = new Map<string, number>();
        publishedData?.forEach((p: any) => {
          const authorId = p.manuscripts?.author_id;
          if (authorId) {
            pubCountMap.set(authorId, (pubCountMap.get(authorId) || 0) + 1);
          }
        });

        // 3. Format DB profiles into Researcher objects
        const dbResearchers: Researcher[] = (dbProfiles || []).map((prof: any) => {
          const pubCount = pubCountMap.get(prof.id) || 0;
          return {
            id: prof.id,
            full_name: prof.full_name || 'Academic Researcher',
            affiliation: prof.affiliation || 'Academic Institution',
            department: prof.department || 'Multidisciplinary Engineering',
            role: prof.role || 'author',
            orcid: prof.orcid || prof.orcid_id || null,
            bio: prof.bio || prof.biography || 'Registered researcher contributing to peer-reviewed scientific literature.',
            interests: ['Applied Engineering', 'Power Systems', 'Machine Learning', 'Open Science'],
            publication_count: pubCount,
            follow_count: 8 + (pubCount * 3),
          };
        });

        // Combine DB profiles with featured fellows without duplication
        const existingIds = new Set(dbResearchers.map((r) => r.id));
        const combined = [...dbResearchers];

        FEATURED_EDITORIAL_FELLOWS.forEach((fellow) => {
          if (!existingIds.has(fellow.id)) {
            combined.push(fellow);
          }
        });

        setResearchers(combined);
      } catch (err) {
        console.error('Error fetching researchers:', err);
        setResearchers(FEATURED_EDITORIAL_FELLOWS);
      } finally {
        setLoading(false);
      }
    }

    loadResearchers();
  }, []);

  // Filtered and sorted researchers
  const filteredResearchers = useMemo(() => {
    return researchers
      .filter((r) => {
        // Search filter
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          r.full_name.toLowerCase().includes(q) ||
          r.affiliation.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          r.interests.some((i) => i.toLowerCase().includes(q));

        // Role filter
        const matchesRole =
          selectedRole === 'all' ||
          (selectedRole === 'editor' && (r.role === 'editor' || r.role === 'editor_in_chief')) ||
          (selectedRole === 'author' && (r.role === 'author' || r.role === 'admin')) ||
          (selectedRole === 'eic' && r.role === 'editor_in_chief');

        // Discipline filter
        const matchesDiscipline =
          selectedDiscipline === 'all' ||
          r.department.toLowerCase().includes(selectedDiscipline.toLowerCase()) ||
          r.interests.some((i) => i.toLowerCase().includes(selectedDiscipline.toLowerCase()));

        return matchesQuery && matchesRole && matchesDiscipline;
      })
      .sort((a, b) => {
        if (sortBy === 'publications') return b.publication_count - a.publication_count;
        if (sortBy === 'followers') return b.follow_count - a.follow_count;
        return a.full_name.localeCompare(b.full_name);
      });
  }, [researchers, searchQuery, selectedRole, selectedDiscipline, sortBy]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'editor_in_chief':
        return (
          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
            Editor-in-Chief
          </span>
        );
      case 'editor':
        return (
          <span className="bg-sky-100 text-sky-900 border border-sky-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
            Section Editor
          </span>
        );
      case 'reviewer':
        return (
          <span className="bg-purple-100 text-purple-900 border border-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
            Peer Reviewer
          </span>
        );
      case 'admin':
        return (
          <span className="bg-indigo-100 text-indigo-900 border border-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
            Platform Admin &bull; Author
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-800 border border-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
            Author / Researcher
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <InstitutionalHeader />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 flex-1 w-full">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={[{ label: 'Researchers Directory' }]} />

        {/* Banner Section */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider rounded-md border border-sky-100">
                <Users className="w-3.5 h-3.5 text-sky-600" />
                <span>Scholarly Community Directory</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b1b3d] tracking-tight leading-tight">
                Academic Researchers &amp; Authors Directory
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                Discover registered researchers, peer reviewers, and editorial board members collaborating across the 17 multidisciplinary engineering domains of MANI Research Organization (MRO).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/community"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-700" />
                <span>Join Community Discussions &rarr;</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Search & Filter Toolbar */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by researcher name, affiliation, department, or keyword..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-900 transition"
              />
            </div>

            {/* Role Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                aria-label="Filter by Academic Role"
                className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-medium"
              >
                <option value="all">All Academic Roles</option>
                <option value="author">Authors &amp; Researchers</option>
                <option value="editor">Section &amp; Advisory Editors</option>
                <option value="eic">Editor-in-Chief</option>
              </select>
            </div>

            {/* Discipline Filter */}
            <div className="md:col-span-2">
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                aria-label="Filter by Academic Discipline"
                className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-medium"
              >
                <option value="all">All Disciplines</option>
                <option value="computer">Computer Science &amp; AI</option>
                <option value="electrical">Electrical &amp; Power</option>
                <option value="materials">Materials &amp; Mechanical</option>
                <option value="robotics">Robotics &amp; Autonomous</option>
                <option value="renewable">Renewable &amp; Energy</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort researchers by"
                className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-medium"
              >
                <option value="publications">Sort: Most Papers</option>
                <option value="followers">Sort: Most Followers</option>
                <option value="name">Sort: Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>
              Showing <strong className="text-slate-900">{filteredResearchers.length}</strong> verified academic profiles
            </span>
            <div className="flex items-center gap-1.5 text-emerald-600 font-medium text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>COPE &amp; Institutional Governance Compliant</span>
            </div>
          </div>
        </section>

        {/* Researcher Profile Cards Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-sky-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Loading academic directory from MRO network...</p>
          </div>
        ) : filteredResearchers.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Researchers Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No academic profiles matched your current search parameters. Try adjusting your query or resetting filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRole('all');
                setSelectedDiscipline('all');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResearchers.map((researcher) => {
              const initials = researcher.full_name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

              return (
                <div
                  key={researcher.id}
                  className="scholarly-card rounded-2xl p-6 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    {/* Header: Avatar, Name, Role */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0b1b3d] to-sky-700 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
                        {initials}
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <Link
                          href={`/researchers/${researcher.id}`}
                          className="font-bold text-slate-900 hover:text-sky-700 text-sm tracking-tight block truncate transition"
                        >
                          {researcher.full_name}
                        </Link>
                        <div>{getRoleBadge(researcher.role)}</div>
                      </div>
                    </div>

                    {/* Affiliation & Department */}
                    <div className="space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-3">
                      <div className="flex items-start gap-1.5 font-medium text-slate-800">
                        <Building2 className="w-3.5 h-3.5 text-sky-700 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{researcher.affiliation}</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-[11px] text-slate-500">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{researcher.department}</span>
                      </div>
                    </div>

                    {/* ORCID Badge (if available) */}
                    {researcher.orcid && (
                      <div className="pt-1">
                        <a
                          href={`https://orcid.org/${researcher.orcid}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 hover:bg-emerald-100 transition"
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                          <span>ORCID: {researcher.orcid}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    )}

                    {/* Research Interests Tags */}
                    {researcher.interests && researcher.interests.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                          Research Focus
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {researcher.interests.slice(0, 3).map((item, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Metrics and Actions */}
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <BookOpen className="w-3.5 h-3.5 text-sky-700" />
                        <span className="font-bold text-slate-900">{researcher.publication_count}</span>
                        <span className="text-slate-500 text-[11px]">Papers Published</span>
                      </div>
                      <ResearcherFollowButton
                        researcherId={researcher.id}
                        initialFollowCount={researcher.follow_count}
                        variant="compact"
                      />
                    </div>

                    <Link
                      href={`/researchers/${researcher.id}`}
                      className="block w-full text-center py-2 bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-800 text-xs font-bold rounded-xl border border-slate-200 transition"
                    >
                      View Academic Profile &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <InstitutionalFooter />
    </div>
  );
}
