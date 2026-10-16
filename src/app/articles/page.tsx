import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

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
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white py-4 px-8 flex justify-between items-center shadow-md">
        <div>
          <Link href="/" className="text-xl font-bold tracking-tight">
            MANI Research Organization
          </Link>
          <p className="text-xs text-slate-400">Open Access Research Repository</p>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/dashboard/author" className="text-xs text-slate-300 hover:text-white font-medium">
            Author Portal
          </Link>
          <Link
            href="/submit"
            className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow transition"
          >
            Submit Paper
          </Link>
        </div>
      </header>

      <section className="bg-white border-b border-slate-200 py-10 px-4 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          Published Articles &amp; Open Literature
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Peer-reviewed multidisciplinary academic papers published by MANI Research Organization.
        </p>
      </section>

      <main className="max-w-4xl mx-auto py-10 px-4 space-y-6">
        {articles && articles.length > 0 ? (
          articles.map((item: any) => {
            const manuscript = item.manuscripts;
            const author = manuscript?.profiles;
            const journal = item.journals;

            return (
              <article
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition space-y-3"
              >
                <div className="flex flex-wrap justify-between items-center text-xs text-slate-500 gap-2">
                  <span className="font-semibold text-blue-700 uppercase tracking-wide">
                    {journal?.title}
                  </span>
                  <span>Vol. {item.volume}, Issue {item.issue} ({new Date(item.published_at).getFullYear()})</span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 leading-snug hover:text-blue-700 transition">
                <Link href={`/articles/${item.id}`}>
                    {manuscript?.title}
                </Link>
                </h2>

                <p className="text-xs text-slate-600">
                  <span className="font-medium text-slate-800">{author?.full_name}</span> &bull; {author?.affiliation}
                </p>

                <p className="text-sm text-slate-700 line-clamp-3 leading-relaxed">
                  {manuscript?.abstract}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-mono">
                    DOI: <strong className="text-slate-800">{item.doi}</strong>
                  </span>
                  <div className="flex gap-2">
                    {manuscript?.keywords?.slice(0, 3).map((kw: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] rounded"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
            No published articles found.
          </div>
        )}
      </main>
    </div>
  );
}