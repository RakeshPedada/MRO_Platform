'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import InstitutionalHeader from '@/components/layout/InstitutionalHeader';
import InstitutionalFooter from '@/components/layout/InstitutionalFooter';
import {
  Send,
  BookOpen,
  FileText,
  Upload,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  FileCheck2,
} from 'lucide-react';

interface Journal {
  id: string;
  title: string;
}

interface Category {
  id: string;
  name: string;
}

// Canonical 17 Multidisciplinary Categories mandated by Section 7 of the specification
const FALLBACK_17_CATEGORIES: Category[] = [
  { id: 'be73c3fe-3ca7-4e8e-b0a2-a2bdbb580f7c', name: 'Aerospace and Aeronautical Engineering' },
  { id: '313aaaf5-45ee-45a7-a4b8-6c3dd929e40c', name: 'Agriculture and Food Science' },
  { id: '5ad60914-9516-4894-ab52-f3a12f8d5628', name: 'Biotechnology and Life Sciences' },
  { id: 'e4fe10dc-ed64-4d3a-aa9f-120009001b19', name: 'Chemistry and Materials Science' },
  { id: 'e1ed51b2-776f-4339-bcf5-2621d92dd65a', name: 'Civil Engineering' },
  { id: 'd5d74e8b-53ff-4af1-9672-2b8e0eb0f369', name: 'Computer Science and Artificial Intelligence' },
  { id: '50e944c3-d38c-4fec-8ea6-ff311a31a7b4', name: 'Economics and Management' },
  { id: 'ade2e8ef-6a20-4f8b-a5b9-03a877061c39', name: 'Electrical and Electronics Engineering' },
  { id: 'a77af08e-67a2-44f9-a0b7-4a6205d4a1ae', name: 'Energy and Renewable Technologies' },
  { id: '2bf15f86-356e-495f-9350-60985c446d3c', name: 'Environmental Science' },
  { id: 'ae0e491f-0238-4170-975f-6deba94d03a0', name: 'Interdisciplinary Research' },
  { id: '0f8be2a0-94ef-411f-a320-cbf581a9d6e7', name: 'Mechanical Engineering' },
  { id: 'cc55ae20-4cf9-4b6d-a99c-9058aad97445', name: 'Medical and Health Sciences' },
  { id: 'ccdc75d1-4f9b-46c0-8400-1e40a148697e', name: 'Physics and Mathematics' },
  { id: 'f8351113-2143-4618-89b6-011dfb2b7a86', name: 'Robotics and Automation' },
  { id: '0c8f9318-2470-4677-b760-46c31e7aa8cc', name: 'Social Sciences and Humanities' },
  { id: 'a6e91b2e-1480-448a-ad7e-3e769d41fb1d', name: 'Space Science and Astronomy' },
];

export default function SubmitManuscriptPage() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [categories, setCategories] = useState<Category[]>(FALLBACK_17_CATEGORIES);

  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  const [journalId, setJournalId] = useState('');
  const [categoryId, setCategoryId] = useState(FALLBACK_17_CATEGORIES[0].id);
  const [conflictOfInterest, setConflictOfInterest] = useState(
    'The authors declare that they have no known competing financial interests or personal relationships that could have appeared to influence the work reported in this paper.'
  );
  const [ethicsStatement, setEthicsStatement] = useState(
    'The authors certify that this investigation conforms with relevant institutional and national ethical guidelines.'
  );
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadMeta() {
      // 1. Fetch journals ordered by title
      const { data: jData } = await supabase
        .from('journals')
        .select('id, title')
        .order('title', { ascending: true });

      if (jData && jData.length > 0) {
        setJournals(jData);
        setJournalId(jData[0].id);
      }

      // 2. Query categories from DB table (categories or research_categories) ordered alphabetically by name
      let dbCategories: Category[] | null = null;
      const { data: cData } = await supabase
        .from('categories')
        .select('id, name')
        .order('name', { ascending: true });

      if (cData && cData.length > 0) {
        dbCategories = cData;
      } else {
        const { data: rcData } = await supabase
          .from('research_categories')
          .select('id, name')
          .order('name', { ascending: true });
        if (rcData && rcData.length > 0) {
          dbCategories = rcData;
        }
      }

      // 3. Ensure all 17 categories are present and alphabetically ordered
      if (dbCategories && dbCategories.length > 0) {
        const categoryMap = new Map<string, Category>();
        // Add DB categories
        dbCategories.forEach((c) => categoryMap.set(c.name.toLowerCase().trim(), c));
        // Fill any gaps from FALLBACK_17_CATEGORIES
        FALLBACK_17_CATEGORIES.forEach((f) => {
          const key = f.name.toLowerCase().trim();
          if (!categoryMap.has(key)) {
            categoryMap.set(key, f);
          }
        });

        const sorted = Array.from(categoryMap.values()).sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setCategories(sorted);
        if (sorted.length > 0 && !categoryId) {
          setCategoryId(sorted[0].id);
        }
      } else {
        // Use full 17 fallback categories sorted alphabetically
        const sortedFallback = [...FALLBACK_17_CATEGORIES].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setCategories(sortedFallback);
        setCategoryId(sortedFallback[0].id);
      }
    }

    loadMeta();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Please select a PDF file to upload.');
      return;
    }

    if (!categoryId) {
      setErrorMsg('Please select a research category for your manuscript.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('You must be logged in to submit a manuscript.');
      }

      // 1. Upload manuscript file to private storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}_manuscript.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('manuscripts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Insert record into manuscripts table
      const keywordsArray = keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);

      const { error: insertError } = await supabase.from('manuscripts').insert({
        author_id: user.id,
        journal_id: journalId,
        category_id: categoryId,
        title: title.trim(),
        abstract: abstract.trim(),
        keywords: keywordsArray,
        file_url: filePath,
        status: 'submitted',
        ethics_statement: ethicsStatement.trim() || 'Standard institutional ethics followed.',
        conflict_of_interest_statement: conflictOfInterest.trim() || 'None declared.',
      });

      if (insertError) throw insertError;

      router.push('/dashboard/author');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('An unexpected error occurred during submission.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      <InstitutionalHeader />

      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-6 flex-1 w-full">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <Link
            href="/dashboard/author"
            className="text-sky-700 hover:text-sky-800 font-semibold flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Author Workspace</span>
          </Link>
          <div className="flex items-center gap-1 text-emerald-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>COPE Double-Blind Peer Review Submission</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-4 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-sky-50 text-sky-700 text-[11px] font-bold uppercase tracking-wider rounded border border-sky-100">
              <FileCheck2 className="w-3 h-3 text-sky-600" />
              <span>Manuscript Ingestion Protocol</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1b3d] tracking-tight">
              Submit New Manuscript
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              Submit your original research for double-blind peer review and open-access publication under MANI Research Organization (MRO).
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} suppressHydrationWarning className="space-y-5 text-xs">
            {/* Target Journal Selection */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Target Journal <span className="text-rose-500">*</span>
              </label>
              <select
                value={journalId}
                onChange={(e) => setJournalId(e.target.value)}
                required
                suppressHydrationWarning
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 font-medium"
              >
                {journals.length > 0 ? (
                  journals.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title}
                    </option>
                  ))
                ) : (
                  <option value="">Loading active journals...</option>
                )}
              </select>
            </div>

            {/* Complete 17 Multidisciplinary Categories Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-800">
                  Research Category (17 Disciplines) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {categories.length} Disciplines Available
                </span>
              </div>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                suppressHydrationWarning
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Categorization aligns manuscript assignment with domain-specialized associate editors.
              </p>
            </div>

            {/* Manuscript Title */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Manuscript Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Robust High-Voltage Transmission Line Fault Detection in Multi-Terminal HVDC Systems"
                suppressHydrationWarning
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
              />
            </div>

            {/* Abstract */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Abstract (200–300 words recommended) <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={6}
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="Provide a self-contained scientific abstract covering: Background/Context, Methodology, Key Empirical Results, and Theoretical/Practical Implications..."
                suppressHydrationWarning
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 leading-relaxed font-serif"
              />
            </div>

            {/* Keywords */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Keywords (Comma-separated, 4–6 terms) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Wavelets, Fault Classification, Machine Learning, Power Grids"
                suppressHydrationWarning
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
              />
            </div>

            {/* Manuscript PDF Upload */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Manuscript PDF File <span className="text-rose-500">*</span>
              </label>
              <input
                type="file"
                required
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                suppressHydrationWarning
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 transition cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Upload your complete manuscript in PDF format (text, equations, figures, tables, and reference citations included).
              </p>
            </div>

            {/* Conflict of Interest Disclosure */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Conflict of Interest Disclosure <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={conflictOfInterest}
                onChange={(e) => setConflictOfInterest(e.target.value)}
                placeholder="Declare any financial, commercial, or personal affiliations that could influence the study, or state 'The authors declare no competing interests.'"
                suppressHydrationWarning
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Transparent disclosure of commercial, institutional, or grant-funding affiliations.
              </p>
            </div>

            {/* Ethics & Institutional Compliance Statement */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Research Ethics &amp; Compliance Statement <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={ethicsStatement}
                onChange={(e) => setEthicsStatement(e.target.value)}
                placeholder="Certify institutional ethics committee approvals, consent protocols, or compliance with Declaration of Helsinki."
                suppressHydrationWarning
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Mandatory statement on adherence to human/animal research ethics and COPE standards.
              </p>
            </div>

            {/* COPE Ethics Declaration */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Author Ethical Warranty &amp; COPE Statement</span>
              </span>
              <p className="leading-relaxed">
                By submitting, you certify that this manuscript is original, has not been published elsewhere, is not currently under review with another journal, and adheres to the ethical standards set by the Committee on Publication Ethics (COPE).
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              suppressHydrationWarning
              className="w-full py-3 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading Manuscript &amp; Generating Dossier...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Confirm Manuscript Submission</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <InstitutionalFooter />
    </div>
  );
}