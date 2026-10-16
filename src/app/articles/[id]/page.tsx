import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from('published_articles')
    .select(`
      id,
      doi,
      volume,
      issue,
      pages,
      published_at,
      journals ( title, issn ),
      manuscripts (
        id,
        title,
        abstract,
        keywords,
        file_url,
        profiles:author_id ( full_name, affiliation, email )
      )
    `)
    .eq('id', id)
    .single();

  if (!article) notFound();

  const manuscript = (article as any).manuscripts;
  const author = manuscript?.profiles;
  const journal = (article as any).journals;

  // Generate signed URL to view/download the published PDF
  let downloadUrl = '';
  if (manuscript?.file_url) {
    const { data: signData } = await supabase.storage
      .from('manuscripts')
      .createSignedUrl(manuscript.file_url, 7200);
    if (signData?.signedUrl) downloadUrl = signData.signedUrl;
  }

  const pubYear = new Date(article.published_at).getFullYear();
  const pubDateStr = new Date(article.published_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white py-4 px-8 flex justify-between items-center shadow-md">
        <div>
          <Link href="/articles" className="text-xl font-bold tracking-tight">
            MANI Research Organization
          </Link>
          <p className="text-xs text-slate-400">Open Access Repository</p>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/articles" className="text-xs text-slate-300 hover:text-white font-medium">
            &larr; Back to Articles
          </Link>
          <Link
            href="/submit"
            className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow transition"
          >
            Submit Research
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-10 px-4 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              {journal?.title}
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
              {manuscript?.title}
            </h1>
            <div className="text-sm text-slate-700 pt-1">
              <span className="font-semibold text-slate-900">{author?.full_name}</span> &bull; {author?.affiliation}
            </div>
            <p className="text-xs text-slate-500">
              Published on {pubDateStr} &bull; Volume {article.volume}, Issue {article.issue}, pp. {article.pages}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <span className="text-xs text-slate-500 font-mono block">Digital Object Identifier (DOI)</span>
              <span className="text-sm font-bold text-slate-900 font-mono">{article.doi}</span>
            </div>
            {downloadUrl && (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow transition"
              >
                Download Full-Text PDF
              </a>
            )}
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">Abstract</h2>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-lg border border-slate-100">
              {manuscript?.abstract}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {manuscript?.keywords?.map((k: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                  {k}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">How to Cite</h3>
            <div className="p-4 bg-slate-100 rounded-lg text-xs font-mono text-slate-800 break-all select-all">
              {author?.full_name} ({pubYear}). {manuscript?.title}. <em>{journal?.title}</em>, {article.volume}({article.issue}), {article.pages}. https://doi.org/{article.doi}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}