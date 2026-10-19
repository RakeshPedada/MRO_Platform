'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import {
  BookOpen,
  Search,
  Filter,
  Layers,
  Calendar,
  Send,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Table as TableIcon,
  LayoutGrid,
  ChevronDown,
  ChevronRight,
  Rss,
  MessageSquare,
  Sparkles,
  LockOpen,
  X,
  Check,
  RotateCcw,
  Compass,
  FileText,
  Star,
  Building2,
  PlusCircle,
} from 'lucide-react';

export interface JournalItem {
  id: string;
  title: string;
  short_code: string;
  slug: string;
  issn: string;
  aims_scope: string;
  subject_area: string;
  launched_year: number;
  article_count: number;
  current_issue: string;
}

interface JournalsCatalogClientProps {
  initialJournals: JournalItem[];
  allSubjects: string[];
}

export default function JournalsCatalogClient({
  initialJournals,
  allSubjects,
}: JournalsCatalogClientProps) {
  // View mode: Table vs Cards
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title_asc' | 'title_desc' | 'articles_desc' | 'launched_desc'>('title_asc');
  const [indexingFilter, setIndexingFilter] = useState<'all' | 'oa' | 'crossref' | 'scholar' | 'cope'>('all');

  // Sidebar navigation selection
  const [activeBrowseTab, setActiveBrowseTab] = useState<'all_journals' | 'journal_finder' | 'special_issues'>('all_journals');

  // Sidebar Accordion states
  const [browseJournalsOpen, setBrowseJournalsOpen] = useState(true);
  const [subjectAreasOpen, setSubjectAreasOpen] = useState(true);
  const [indexingOpen, setIndexingOpen] = useState(true);

  // Modals & Interactive States
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackCategory, setFeedbackCategory] = useState('Catalog Usability');
  const [feedbackComments, setFeedbackComments] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const [proposeModalOpen, setProposeModalOpen] = useState(false);
  const [propTitle, setPropTitle] = useState('');
  const [propDiscipline, setPropDiscipline] = useState(allSubjects[0] || 'Computer Science and Artificial Intelligence');
  const [propScope, setPropScope] = useState('');
  const [propProposer, setPropProposer] = useState('');
  const [propSubmitted, setPropSubmitted] = useState(false);

  const [copiedRssId, setCopiedRssId] = useState<string | null>(null);

  // Available launch years
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(initialJournals.map((j) => j.launched_year))).sort((a, b) => b - a);
    return years;
  }, [initialJournals]);

  // Filtered & Sorted Journals
  const filteredJournals = useMemo(() => {
    return initialJournals
      .filter((journal) => {
        // Text Search
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          journal.title.toLowerCase().includes(query) ||
          journal.short_code.toLowerCase().includes(query) ||
          journal.aims_scope.toLowerCase().includes(query) ||
          journal.subject_area.toLowerCase().includes(query) ||
          journal.issn.toLowerCase().includes(query);

        // Subject Filter
        const matchesSubject =
          selectedSubject === 'all' ||
          journal.subject_area.toLowerCase() === selectedSubject.toLowerCase();

        // Year Filter
        const matchesYear =
          selectedYear === 'all' || journal.launched_year.toString() === selectedYear;

        // Browse Tab sub-filtering
        const matchesBrowseTab =
          activeBrowseTab !== 'special_issues' ||
          journal.short_code.includes('JAET') ||
          journal.short_code.includes('JCSAI') ||
          journal.short_code.includes('JSEI');

        return matchesQuery && matchesSubject && matchesYear && matchesBrowseTab;
      })
      .sort((a, b) => {
        if (sortBy === 'title_asc') return a.title.localeCompare(b.title);
        if (sortBy === 'title_desc') return b.title.localeCompare(a.title);
        if (sortBy === 'articles_desc') return b.article_count - a.article_count;
        if (sortBy === 'launched_desc') return b.launched_year - a.launched_year;
        return 0;
      });
  }, [initialJournals, searchQuery, selectedSubject, selectedYear, sortBy, activeBrowseTab]);

  const handleCopyRss = (journal: JournalItem) => {
    const rssUrl = `https://mro.org.in/feed/${journal.slug}.xml`;
    navigator.clipboard.writeText(rssUrl);
    setCopiedRssId(journal.id);
    setTimeout(() => setCopiedRssId(null), 2500);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedbackModalOpen(false);
      setFeedbackComments('');
    }, 2000);
  };

  const handleProposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPropSubmitted(true);
    setTimeout(() => {
      setPropSubmitted(false);
      setProposeModalOpen(false);
      setPropTitle('');
      setPropScope('');
      setPropProposer('');
    }, 2000);
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedSubject('all');
    setSelectedYear('all');
    setSortBy('title_asc');
    setIndexingFilter('all');
    setActiveBrowseTab('all_journals');
  };

  const isFiltered =
    searchQuery.trim() !== '' ||
    selectedSubject !== 'all' ||
    selectedYear !== 'all' ||
    indexingFilter !== 'all' ||
    activeBrowseTab !== 'all_journals';

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8 flex-1 w-full">
      {/* 1. Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Journals', href: '/journals' }]} />

      {/* 2. Split Hero Banner (MDPI Exact Structure) */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left Side: Bold Title & Subtitle */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider rounded-md border border-sky-100 w-fit">
            <BookOpen className="w-3.5 h-3.5 text-sky-600" />
            <span>Open Access Scholarly Catalog</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b1b3d] tracking-tight">
            Journals
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
            Browse open access journals published by <strong>MANI Research Organization (MRO)</strong> across {allSubjects.length} multidisciplinary disciplines. Full-text articles are immediately free to access, download, and cite globally under CC BY 4.0.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{initialJournals.length} Peer-Reviewed Journals</span>
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>COPE Code of Conduct</span>
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-600">
              Crossref DOIs Minted
            </span>
          </div>
        </div>

        {/* Right Side: Gradient Academic Waves & Floating Inset Action Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0b1b3d] via-sky-950 to-[#0284c7] p-8 sm:p-10 relative overflow-hidden flex items-center justify-center">
          {/* Subtle Decorative Wave Pattern */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="none">
              <path d="M0,100 C150,200 250,50 400,150 L400,400 L0,400 Z" fill="currentColor" className="text-sky-300" />
              <path d="M0,220 C180,120 220,280 400,200 L400,400 L0,400 Z" fill="currentColor" className="text-white" />
            </svg>
          </div>

          {/* Inset White Floating Action Card */}
          <div className="relative z-10 bg-white rounded-xl shadow-xl border border-slate-200 p-6 max-w-sm w-full space-y-3 transform transition hover:shadow-2xl">
            <div className="flex items-center gap-2 text-sky-700">
              <Sparkles className="w-5 h-5 text-sky-600" />
              <h3 className="font-extrabold text-[#0b1b3d] text-base">
                Publish with Us
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Find the right journal for your manuscript across our multidisciplinary portfolio. Rapid peer review, objective evaluation, and international open access indexing.
            </p>
            <div className="pt-2">
              <Link
                href="/submit"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-lg shadow-sm transition"
              >
                <span>Explore Submission</span>
                <span className="text-sm font-normal">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Catalog Grid (Left Sidebar + Right Interactive Feed) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN (Col 1-3): Collapsible Facet Filter Sidebar */}
        <aside className="lg:col-span-3 space-y-5">
          {/* Section 1: Browse Journals */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => setBrowseJournalsOpen(!browseJournalsOpen)}
              className="w-full px-4 py-3 bg-slate-50 flex items-center justify-between text-xs font-bold text-[#0b1b3d] border-b border-slate-200 hover:bg-slate-100 transition"
            >
              <span className="uppercase tracking-wider">Browse Journals</span>
              {browseJournalsOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
            </button>

            {browseJournalsOpen && (
              <div className="p-2 space-y-1 text-xs">
                <button
                  onClick={() => {
                    setActiveBrowseTab('all_journals');
                    setSelectedSubject('all');
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition flex items-center justify-between ${
                    activeBrowseTab === 'all_journals' && selectedSubject === 'all'
                      ? 'bg-sky-50 text-[#0284c7] font-bold border-l-4 border-[#0284c7]'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>All Active Journals</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                    {initialJournals.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveBrowseTab('journal_finder');
                    document.getElementById('catalog-search-input')?.focus();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition flex items-center justify-between ${
                    activeBrowseTab === 'journal_finder'
                      ? 'bg-sky-50 text-[#0284c7] font-bold border-l-4 border-[#0284c7]'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Journal Finder</span>
                  <Compass className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => setActiveBrowseTab('special_issues')}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition flex items-center justify-between ${
                    activeBrowseTab === 'special_issues'
                      ? 'bg-sky-50 text-[#0284c7] font-bold border-l-4 border-[#0284c7]'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Special Issues Series</span>
                  <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-mono font-bold">
                    Active
                  </span>
                </button>

                <button
                  onClick={() => setProposeModalOpen(true)}
                  className="w-full text-left px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition flex items-center justify-between"
                >
                  <span>Propose a Journal</span>
                  <PlusCircle className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <Link
                  href="/guidelines"
                  className="block px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Author Guidelines &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* Section 2: Browse by Subject Areas (17 Multidisciplinary Categories) */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => setSubjectAreasOpen(!subjectAreasOpen)}
              className="w-full px-4 py-3 bg-slate-50 flex items-center justify-between text-xs font-bold text-[#0b1b3d] border-b border-slate-200 hover:bg-slate-100 transition"
            >
              <div className="flex items-center gap-1.5">
                <span className="uppercase tracking-wider">Subject Areas</span>
                <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded font-mono font-bold">
                  {allSubjects.length}
                </span>
              </div>
              {subjectAreasOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
            </button>

            {subjectAreasOpen && (
              <div className="p-2 space-y-0.5 max-h-[460px] overflow-y-auto academic-scrollbar text-xs">
                <button
                  onClick={() => setSelectedSubject('all')}
                  className={`w-full text-left px-3 py-1.5 rounded text-[11px] font-medium transition flex items-center justify-between ${
                    selectedSubject === 'all'
                      ? 'bg-sky-50 text-[#0284c7] font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>All Disciplines</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ({initialJournals.length})
                  </span>
                </button>

                {allSubjects.map((sub, idx) => {
                  const isSelected = selectedSubject.toLowerCase() === sub.toLowerCase();
                  const count = initialJournals.filter(
                    (j) => j.subject_area.toLowerCase() === sub.toLowerCase()
                  ).length;

                  return (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubject(sub)}
                      className={`w-full text-left px-3 py-1.5 rounded text-[11px] font-medium transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-sky-50 text-[#0284c7] font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                      title={sub}
                    >
                      <span className="truncate pr-2">
                        {idx + 1}. {sub}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {count > 0 ? `(${count})` : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 3: Browse by Archival Indexing */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => setIndexingOpen(!indexingOpen)}
              className="w-full px-4 py-3 bg-slate-50 flex items-center justify-between text-xs font-bold text-[#0b1b3d] border-b border-slate-200 hover:bg-slate-100 transition"
            >
              <span className="uppercase tracking-wider">Archival Indexing</span>
              {indexingOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
            </button>

            {indexingOpen && (
              <div className="p-3 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Open Access (CC BY 4.0)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Crossref / DOI Minted</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Google Scholar Indexed</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>COPE Ethics Compliant</span>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT COLUMN (Col 4-12): Interactive Data Table / Cards Stream */}
        <main className="lg:col-span-9 space-y-5">
          {/* Filter & Sorting Toolbar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Journal Search Input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="catalog-search-input"
                  type="text"
                  placeholder="Search by journal name, code, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 focus:bg-white transition"
                />
              </div>

              {/* View Switcher: Table View vs Cards View */}
              <div className="flex items-center gap-1 self-end sm:self-center border border-slate-200 rounded-lg p-0.5 bg-slate-100">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition ${
                    viewMode === 'table'
                      ? 'bg-white text-[#0b1b3d] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Switch to Dense Table View"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Table View</span>
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition ${
                    viewMode === 'cards'
                      ? 'bg-white text-[#0b1b3d] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Switch to Card Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Cards View</span>
                </button>
              </div>
            </div>

            {/* Dropdowns Row: Subject, Year, Sort By */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-slate-100 text-xs">
              {/* Select Subject Dropdown */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Select Subject Area:
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="all">All Disciplines ({initialJournals.length})</option>
                  {allSubjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Year Launched Dropdown */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Select Year Launched:
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="all">All Launch Years</option>
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr.toString()}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Sort Publications:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="title_asc">Title (A - Z)</option>
                  <option value="title_desc">Title (Z - A)</option>
                  <option value="articles_desc">Most Published Articles</option>
                  <option value="launched_desc">Recently Launched</option>
                </select>
              </div>
            </div>

            {/* Active Filters Summary & Reset */}
            {isFiltered && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="font-semibold text-slate-800">Active Filters:</span>
                  {selectedSubject !== 'all' && (
                    <span className="bg-sky-50 text-sky-800 text-[11px] px-2 py-0.5 rounded border border-sky-200">
                      Subject: {selectedSubject}
                    </span>
                  )}
                  {selectedYear !== 'all' && (
                    <span className="bg-sky-50 text-sky-800 text-[11px] px-2 py-0.5 rounded border border-sky-200">
                      Year: {selectedYear}
                    </span>
                  )}
                  {searchQuery.trim() && (
                    <span className="bg-sky-50 text-sky-800 text-[11px] px-2 py-0.5 rounded border border-sky-200">
                      Query: &ldquo;{searchQuery}&rdquo;
                    </span>
                  )}
                </div>
                <button
                  onClick={resetAllFilters}
                  className="text-xs text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-1 hover:underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </div>

          {/* Results Summary Counter */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong className="text-slate-900">{filteredJournals.length}</strong> of{' '}
              {initialJournals.length} Open Access Journals
            </span>
            <span className="text-[11px] font-mono text-emerald-700 font-semibold">
              CC BY 4.0 &bull; Continuous Publication
            </span>
          </div>

          {/* Empty State */}
          {filteredJournals.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3 shadow-sm">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No Journals Match Your Filters
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No active publications matched your search query or subject filters. You can reset filters to view our full multidisciplinary catalog.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-lg shadow-sm transition"
              >
                Reset Filters &amp; View All
              </button>
            </div>
          ) : viewMode === 'table' ? (
            /* 4A. Dense MDPI Data Table Layout */
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-[#0b1b3d] uppercase tracking-wider text-[11px] border-b border-slate-200 font-bold">
                      <th className="py-3.5 px-4">Journals</th>
                      <th className="py-3.5 px-3">ISSN</th>
                      <th className="py-3.5 px-3">Subject Area</th>
                      <th className="py-3.5 px-3 text-center">Launched</th>
                      <th className="py-3.5 px-3 text-center">Articles</th>
                      <th className="py-3.5 px-3">Current Issue</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredJournals.map((j) => (
                      <tr key={j.id} className="hover:bg-slate-50 transition-colors">
                        {/* Journals Column: Badge + Title + Code */}
                        <td className="py-3.5 px-4 max-w-xs sm:max-w-sm">
                          <div className="flex items-start gap-2.5">
                            <span className="shrink-0 text-[10px] font-mono font-bold bg-[#0b1b3d] text-white px-2 py-1 rounded shadow-sm">
                              {j.short_code}
                            </span>
                            <div>
                              <Link
                                href="/articles"
                                className="font-bold text-slate-900 hover:text-sky-700 leading-snug block transition"
                              >
                                {j.title}
                              </Link>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {j.aims_scope}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* ISSN Column */}
                        <td className="py-3.5 px-3 text-slate-700 font-mono text-[11px] whitespace-nowrap">
                          {j.issn}
                        </td>

                        {/* Subject Area Column */}
                        <td className="py-3.5 px-3">
                          <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded border border-slate-200 line-clamp-1 max-w-[140px]">
                            {j.subject_area}
                          </span>
                        </td>

                        {/* Launched Year */}
                        <td className="py-3.5 px-3 text-center font-mono text-slate-600">
                          {j.launched_year}
                        </td>

                        {/* Articles Count */}
                        <td className="py-3.5 px-3 text-center font-bold text-slate-900 font-mono">
                          {j.article_count}
                        </td>

                        {/* Current Issue */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <Link
                            href="/articles"
                            className="text-sky-700 hover:underline font-medium text-[11px] flex items-center gap-1"
                          >
                            <span>{j.current_issue}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        </td>

                        {/* Actions: Submit & RSS */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <Link
                              href="/submit"
                              className="px-2.5 py-1 bg-[#0284c7] hover:bg-[#0369a1] text-white text-[11px] font-bold rounded shadow-sm transition"
                            >
                              Submit
                            </Link>

                            <button
                              onClick={() => handleCopyRss(j)}
                              title="Subscribe to Journal RSS Feed"
                              className="p-1 rounded text-slate-400 hover:text-amber-600 transition"
                            >
                              {copiedRssId === j.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Rss className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* 4B. Rich Cards View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredJournals.map((j) => (
                <div
                  key={j.id}
                  className="scholarly-card rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold bg-[#0b1b3d] text-white px-2 py-0.5 rounded">
                        {j.short_code}
                      </span>
                      <span className="scholarly-badge-oa">
                        <LockOpen className="w-3 h-3" />
                        Open Access
                      </span>
                    </div>

                    <h2 className="scholarly-title text-base sm:text-lg leading-snug">
                      <Link href="/articles" className="hover:text-sky-700">
                        {j.title}
                      </Link>
                    </h2>

                    <div className="text-xs text-slate-500 font-mono space-y-0.5">
                      <p>
                        ISSN: <strong className="text-slate-800">{j.issn}</strong>
                      </p>
                      <p className="text-[11px] font-sans text-sky-800 font-medium">
                        Discipline: {j.subject_area}
                      </p>
                    </div>

                    <p className="scholarly-abstract line-clamp-3 text-xs text-slate-600">
                      {j.aims_scope}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 text-[11px]">
                      Published Papers:{' '}
                      <strong className="text-slate-900">{j.article_count}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyRss(j)}
                        title="Copy RSS Feed"
                        className="p-1 text-slate-400 hover:text-amber-600 transition"
                      >
                        {copiedRssId === j.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Rss className="w-4 h-4" />
                        )}
                      </button>
                      <Link
                        href="/submit"
                        className="px-3 py-1 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-lg transition"
                      >
                        Submit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* 5. Bottom-Right Floating Feedback Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setFeedbackModalOpen(true)}
          className="bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 transition-all transform hover:scale-105"
          aria-label="Submit feedback"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Feedback</span>
        </button>
      </div>

      {/* Floating Feedback Modal */}
      {feedbackModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-700" />
                <h3 className="text-base font-bold text-[#0b1b3d]">
                  Academic Portal Feedback
                </h3>
              </div>
              <button
                onClick={() => setFeedbackModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedbackSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">
                  Thank You for Your Feedback!
                </h4>
                <p className="text-xs text-slate-500">
                  Your comments help our editorial and engineering team improve MRO scholarly infrastructure.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Rate Your Experience with Journals Catalog:
                  </label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFeedbackRating(star)}
                        className="p-1 focus:outline-none transition transform hover:scale-110"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= feedbackRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-[11px] text-slate-500 ml-2 font-semibold">
                      ({feedbackRating} of 5 stars)
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Feedback Category:
                  </label>
                  <select
                    value={feedbackCategory}
                    onChange={(e) => setFeedbackCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Catalog Usability">Catalog Usability &amp; Search</option>
                    <option value="Journal Scope Clarity">Journal Scope Clarity</option>
                    <option value="Submission Workflow">Submission Workflow</option>
                    <option value="Bug / Error Report">Bug / Error Report</option>
                    <option value="General Suggestion">General Suggestion</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Comments or Suggestions:
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us what you like or how we can improve..."
                    value={feedbackComments}
                    onChange={(e) => setFeedbackComments(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setFeedbackModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-lg shadow-sm transition"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Propose a Journal Modal */}
      {proposeModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-sky-700" />
                <h3 className="text-base font-bold text-[#0b1b3d]">
                  Propose a New Academic Journal
                </h3>
              </div>
              <button
                onClick={() => setProposeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {propSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">
                  Journal Proposal Submitted!
                </h4>
                <p className="text-xs text-slate-500">
                  The MRO Editorial Advisory Board will review your proposal and respond within 7 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleProposeSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Proposed Journal Title:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MRO Journal of Quantum Materials..."
                    value={propTitle}
                    onChange={(e) => setPropTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Primary Academic Discipline:
                  </label>
                  <select
                    value={propDiscipline}
                    onChange={(e) => setPropDiscipline(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {allSubjects.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Aims &amp; Scope Justification:
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the research gap this journal fills and its target community..."
                    value={propScope}
                    onChange={(e) => setPropScope(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Proposer Name &amp; Institutional Affiliation:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. Full Name, University / Institute..."
                    value={propProposer}
                    onChange={(e) => setPropProposer(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setProposeModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-lg shadow-sm transition"
                  >
                    Submit Proposal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
