import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import InstitutionalHeader from '@/components/layout/InstitutionalHeader';
import InstitutionalFooter from '@/components/layout/InstitutionalFooter';
import { BookOpen, LockOpen, FileText, ExternalLink, ShieldCheck, Tag } from 'lucide-react';

export const revalidate = 0;

export default async function PublicArticlesPage() {
  const supabase = await createClient();

  const { data: articles } = await supabase
    .from('published_articles')
    .select(`
      id,
      doi,
      volume,
      issue,
      pages,
      published_at,
      journals ( title ),
      manuscripts (
        title,
        abstract,
        keywords,
        profiles:author_id ( full_name, affiliation )
      )
    `)
    .order('published_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      <InstitutionalHeader />

      {/* Hero Banner */}
      <section className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider rounded-md border border-sky-100">
            <BookOpen className="w-3.5 h-3.5 text-sky-600" />
            <span>Open Access Scholarly Repository</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b1b3d] tracking-tight">
            Published Articles &amp; Open Literature
          </h1>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            Peer-reviewed multidisciplinary academic papers published by MANI Research Organization (MRO). Permanent DOI routing, rigorous double-blind evaluation, and unrestricted CC BY 4.0 global distribution.
          </p>
        </div>
      </section>

      {/* Main Articles Stream */}
      <main className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-6 flex-1 w-full">
        <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
          <span>
            Archived Publications: <strong className="text-slate-900">{articles?.length || 0} Articles</strong>
          </span>
          <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>COPE Compliant &bull; CC BY 4.0 Universal Access</span>
          </div>
        </div>

        {articles && articles.length > 0 ? (
          <div className="space-y-5">
            {articles.map((item: any) => {
              const manuscript = item.manuscripts;
              const author = manuscript?.profiles;
              const journal = item.journals;
              const pubDate = new Date(item.published_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <article
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-academic-hover hover:border-sky-300 transition-all duration-200 space-y-3"
                >
                  <div className="flex flex-wrap justify-between items-center text-xs gap-2 border-b border-slate-50 pb-2">
                    <span className="font-bold text-[#0284c7] uppercase tracking-wide text-[11px]">
                      {journal?.title || 'MRO Journal of Advanced Engineering & Technology'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="scholarly-badge-oa">
                        <LockOpen className="w-3 h-3" />
                        Open Access
                      </span>
                      <span className="text-slate-400 text-[11px] font-mono">
                        Vol. {item.volume}, Issue {item.issue} ({pubDate})
                      </span>
                    </div>
                  </div>

                  <h2 className="scholarly-title text-lg sm:text-xl leading-snug">
                    <Link href={`/articles/${item.id}`}>{manuscript?.title}</Link>
                  </h2>

                  <div className="text-xs text-slate-600">
                    by{' '}
                    <span className="font-semibold text-slate-800">
                      {author?.full_name || 'Academic Researcher'}
                    </span>
                    {author?.affiliation && (
                      <span className="text-slate-500"> &bull; {author.affiliation}</span>
                    )}
                  </div>

                  <p className="scholarly-abstract line-clamp-3">
                    {manuscript?.abstract}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                    <span className="scholarly-badge-doi">
                      DOI: <strong className="text-slate-800 select-all font-mono">{item.doi}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      {manuscript?.keywords?.slice(0, 3).map((kw: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded"
                        >
                          {kw}
                        </span>
                      ))}
                      <Link
                        href={`/articles/${item.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-lg transition ml-1"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Read Paper &rarr;</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-2">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No Published Articles Archived Yet</h3>
            <p className="text-xs text-slate-500">Check back shortly or submit your paper for peer review.</p>
          </div>
        )}
      </main>

      <InstitutionalFooter />
    </div>
  );
}