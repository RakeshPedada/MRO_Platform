import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import InstitutionalHeader from '@/components/layout/InstitutionalHeader';
import InstitutionalFooter from '@/components/layout/InstitutionalFooter';
import {
  BookOpen,
  ShieldCheck,
  Send,
  FileText,
  Calendar,
  Layers,
  CheckCircle2,
  LockOpen,
  ArrowRight,
  ExternalLink,
  Users,
} from 'lucide-react';

export const revalidate = 0;

export const metadata = {
  title: 'MRO Academic Journals Directory | MANI Research Organization',
  description:
    'Peer-reviewed open-access journals published by MANI Research Organization (MRO). Aims and scopes, ISSN registrations, editorial boards, and archived volumes.',
};

export default async function JournalsDirectoryPage() {
  const supabase = await createClient();

  // 1. Fetch active journals from database
  const { data: dbJournals } = await supabase
    .from('journals')
    .select('*')
    .order('title', { ascending: true });

  // 2. Fetch counts of published articles per journal
  const { data: pubData } = await supabase
    .from('published_articles')
    .select('journal_id');

  const pubCountMap = new Map<string, number>();
  pubData?.forEach((p) => {
    if (p.journal_id) {
      pubCountMap.set(p.journal_id, (pubCountMap.get(p.journal_id) || 0) + 1);
    }
  });

  // Fallback journals if DB has only initial seed
  const fallbackJournals = [
    {
      id: '2e40b00b-46cb-4cf1-93a9-2e8cc107ebc1',
      title: 'MRO Journal of Advanced Engineering & Technology',
      short_code: 'MRO-JAET',
      slug: 'mro-journal-of-advanced-engineering-technology',
      issn: '3048-5231',
      aims_scope:
        'A premier peer-reviewed open-access journal covering multidisciplinary research in electrical, electronics, mechanical, computer science, robotics, and energy systems.',
      description:
        'Dedicated to rapid, high-impact dissemination of theoretical models, empirical validations, and applied engineering prototypes.',
    },
    {
      id: 'mro-jcsai-canonical',
      title: 'MRO Journal of Computer Science & Artificial Intelligence',
      short_code: 'MRO-JCSAI',
      slug: 'mro-journal-of-computer-science-artificial-intelligence',
      issn: '3048-524X',
      aims_scope:
        'Focuses on novel deep learning architectures, graph neural computation, edge AI optimization, distributed cloud systems, and post-quantum information security.',
      description:
        'Publishes original research and comprehensive state-of-the-art surveys on machine intelligence and scalable computing.',
    },
    {
      id: 'mro-jses-canonical',
      title: 'MRO Journal of Sustainable Energy & Infrastructure',
      short_code: 'MRO-JSEI',
      slug: 'mro-journal-of-sustainable-energy-infrastructure',
      issn: '3048-5258',
      aims_scope:
        'Covers smart grid integration, high-voltage transmission, renewable generation, composite materials, and climate-resilient civil engineering structures.',
      description:
        'Promotes interdisciplinary solutions for energy transition, microgrid stability, and sustainable physical infrastructure.',
    },
  ];

  const journalsList =
    dbJournals && dbJournals.length > 0
      ? dbJournals.map((j) => ({
          ...j,
          article_count: pubCountMap.get(j.id) || 0,
        }))
      : fallbackJournals.map((j) => ({
          ...j,
          article_count: pubCountMap.get(j.id) || 0,
        }));

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      <InstitutionalHeader />

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10 flex-1 w-full">
        {/* Hero Banner */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider rounded-md border border-sky-100">
            <BookOpen className="w-3.5 h-3.5 text-sky-600" />
            <span>Academic Publishing Portfolio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b1b3d] tracking-tight leading-tight">
            MRO Academic Journals Directory
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            MANI Research Organization (MRO) publishes rigorous, peer-reviewed, open-access journals spanning 17 multidisciplinary engineering and scientific domains. All journals operate under a double-blind peer review model and distribute articles freely under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
          </p>
        </section>

        {/* Journals Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs text-slate-500">
            <span>
              Active Journals: <strong className="text-slate-900">{journalsList.length} Peer-Reviewed Publications</strong>
            </span>
            <div className="flex items-center gap-2 text-emerald-600 font-medium text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>COPE Ethics Code of Conduct Compliant</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {journalsList.map((journal) => (
              <div
                key={journal.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-academic-hover hover:border-sky-300 transition-all duration-200 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
                      {journal.short_code || 'MRO JOURNAL'}
                    </span>
                    <span className="scholarly-badge-oa">
                      <LockOpen className="w-3 h-3" />
                      Open Access
                    </span>
                  </div>

                  <h2 className="scholarly-title text-lg leading-snug">
                    <Link href="/articles" className="hover:text-sky-700">
                      {journal.title}
                    </Link>
                  </h2>

                  <div className="text-xs text-slate-500 font-mono space-y-0.5">
                    <p>ISSN: <strong className="text-slate-800">{journal.issn || 'Registered / Electronic'}</strong></p>
                    <p className="text-[11px] font-sans text-emerald-700 font-semibold">Double-Blind Peer Review Model</p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Aims &amp; Scope
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                      {journal.aims_scope || journal.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-medium">
                      <FileText className="w-3.5 h-3.5 text-sky-700" />
                      <span>{journal.article_count || 1} Published Articles</span>
                    </span>
                    <span className="text-[11px] text-slate-400">CC BY 4.0</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href="/articles"
                      className="text-center py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition"
                    >
                      Browse Papers
                    </Link>
                    <Link
                      href="/submit"
                      className="text-center py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-xl shadow-sm transition"
                    >
                      Submit Paper
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Editorial Standards & Integrity Commitment */}
        <section className="bg-slate-50 border border-slate-200 rounded-2xl p-8 space-y-4">
          <h2 className="text-lg font-bold text-[#0b1b3d] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-700" />
            <span>MRO Journal Publishing Standards</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm">Rigorous Double-Blind Review</h3>
              <p>
                Author identities and reviewer identities are mutually masked throughout evaluation to prevent cognitive bias and institutional favoritism.
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm">Permanent DOI Archival</h3>
              <p>
                Every published article is minted with a persistent Digital Object Identifier (DOI) and permanently deposited in digital open preservation repositories.
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm">Zero Article Processing Fees</h3>
              <p>
                As part of our founding charter under MANI Market Private Limited, selected inaugural volumes are published with full APC waivers.
              </p>
            </div>
          </div>
        </section>
      </main>

      <InstitutionalFooter />
    </div>
  );
}
