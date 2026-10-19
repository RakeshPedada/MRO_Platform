import Link from 'next/link';
import InstitutionalHeader from '@/components/layout/InstitutionalHeader';
import InstitutionalFooter from '@/components/layout/InstitutionalFooter';
import {
  Bell,
  Calendar,
  Sparkles,
  BookOpen,
  Send,
  ShieldCheck,
  Tag,
  ArrowRight,
  ExternalLink,
  Award,
} from 'lucide-react';

export const metadata = {
  title: 'Scholarly News & Editorial Announcements | MANI Research Organization (MRO)',
  description:
    'Official news, call for papers, special issue announcements, and publication integrity updates from MANI Research Organization.',
};

const NEWS_ANNOUNCEMENTS = [
  {
    id: 'news-cfp-2026',
    title: 'Call for Papers 2026: Special Issue on Resilient Renewable Microgrids & HVDC Interconnection',
    category: 'Call for Papers',
    date: 'October 18, 2026',
    summary:
      'MRO Journal of Advanced Engineering & Technology announces an open call for original research and state-of-the-art review papers exploring fault ride-through dynamics, synthetic inertia controllers, and modular multilevel converter architectures.',
    details:
      'Guest Editors: Dr. K. Venkata Rao and Academic Advisory Board. All accepted manuscripts will receive full article processing fee (APC) sponsorship under the MANI Market Private Limited Open Science Fellowship.',
    pinned: true,
    tags: ['HVDC', 'Microgrids', 'Special Issue', 'Call for Papers'],
  },
  {
    id: 'news-cope-adoption',
    title: 'Adoption of Enhanced COPE Double-Blind Peer Review Protocols Across All 17 Disciplines',
    category: 'Publishing Integrity',
    date: 'October 12, 2026',
    summary:
      'MANI Research Organization has institutionalized rigorous automated pre-screening for text similarity, data integrity, and strict blinding of author-referee identities to uphold highest ethical standards.',
    details:
      'In line with Committee on Publication Ethics (COPE) core practices, referee comments and author rebuttals are mediated strictly through secured editorial consoles with zero public disclosure of unaccepted drafts.',
    pinned: true,
    tags: ['COPE', 'Ethics', 'Double-Blind Review', 'Integrity'],
  },
  {
    id: 'news-ai-symposium',
    title: 'Announcing the Inaugural MRO Interdisciplinary AI & Autonomous Systems Symposium',
    category: 'Conferences & Events',
    date: 'September 28, 2026',
    summary:
      'A virtual academic convention convening researchers in graph neural networks, soft robotics, autonomous navigation, and post-quantum cryptographic systems. Selected papers will be invited for expedited journal review.',
    details:
      'Keynote addresses by Section Editors and Distinguished Editorial Fellows. Registration is complimentary for verified academic researchers in the MRO network.',
    pinned: false,
    tags: ['Artificial Intelligence', 'Robotics', 'Symposium', 'Interdisciplinary'],
  },
  {
    id: 'news-doi-deposit',
    title: 'Permanent DOI Depositing and Universal Open-Access CC BY 4.0 Milestone Reached',
    category: 'Infrastructure',
    date: 'September 15, 2026',
    summary:
      'All published articles in the MRO catalog are now permanently registered with persistent Digital Object Identifiers (DOIs), ensuring permanent discoverability in international bibliographic catalogs.',
    details:
      'Authors retain unrestricted copyright of their empirical data and analytical frameworks while granting global readers perpetual, barrier-free access.',
    pinned: false,
    tags: ['DOI', 'CC BY 4.0', 'Open Access', 'Archiving'],
  },
];

export default function ScholarlyNewsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      <InstitutionalHeader />

      <main className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10 flex-1 w-full">
        {/* Banner */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider rounded-md border border-sky-100">
            <Bell className="w-3.5 h-3.5 text-sky-600" />
            <span>Editorial Dispatches</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b1b3d] tracking-tight leading-tight">
            Scholarly News &amp; Announcements
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            Stay informed with the latest calls for papers, special issue announcements, editorial board inductees, and publishing ethics updates from MANI Research Organization (MRO).
          </p>
        </section>

        {/* News Stream */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs text-slate-500">
            <span>
              Official Bulletins: <strong className="text-slate-900">{NEWS_ANNOUNCEMENTS.length} Announcements</strong>
            </span>
            <div className="flex items-center gap-2 text-emerald-600 font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Institutional Dispatches</span>
            </div>
          </div>

          <div className="space-y-6">
            {NEWS_ANNOUNCEMENTS.map((item) => (
              <article
                key={item.id}
                className={`bg-white border rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 transition hover:shadow-academic-hover ${
                  item.pinned ? 'border-sky-300 bg-sky-50/15' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    {item.pinned && (
                      <span className="bg-amber-100 text-amber-900 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        Featured Bulletin
                      </span>
                    )}
                    <span className="bg-sky-50 text-sky-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-sky-200">
                      {item.category}
                    </span>
                  </div>

                  <span className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.date}</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="scholarly-title text-xl sm:text-2xl leading-snug">
                    {item.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
                    {item.summary}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {item.details}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <Link
                    href="/submit"
                    className="inline-flex items-center gap-1.5 text-sky-700 hover:text-sky-800 font-bold text-xs"
                  >
                    <span>Submit to this Call &rarr;</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <InstitutionalFooter />
    </div>
  );
}
