import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ArticlePdfViewer from '@/components/articles/ArticlePdfViewer';
import CitationFormats from '@/components/articles/CitationFormats';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import CopyDoiButton from '@/components/articles/CopyDoiButton';
import { BookOpen, Calendar, Download, Eye, FileText, Globe, Layers, Share2, Tag, User } from 'lucide-react';

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
      journals ( title, issn, slug ),
      manuscripts (
        id,
        title,
        abstract,
        keywords,
        file_url,
        profiles:author_id ( full_name, affiliation, email, orcid_id, country )
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

  const pubDate = new Date(article.published_at);
  const pubYear = isNaN(pubDate.getFullYear()) ? new Date().getFullYear() : pubDate.getFullYear();
  const pubDateStr = !isNaN(pubDate.getTime())
    ? pubDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent Publication';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-slate-950 text-white py-4 px-6 sm:px-8 flex justify-between items-center shadow-lg border-b border-slate-800">
        <div>
          <Link href="/" className="text-lg sm:text-xl font-bold tracking-tight hover:text-blue-400 transition flex items-center gap-2">
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded font-black tracking-wider">MRO</span>
            MANI Research Organization
          </Link>
          <p className="text-xs text-slate-400">Open Access Scholarly Repository</p>
        </div>
        <div className="flex gap-3 sm:gap-4 items-center">
          <Link href="/articles" className="text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1 transition">
            &larr; <span className="hidden sm:inline">Browse</span> Catalog
          </Link>
          <Link
            href="/submit"
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            Submit Paper
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: 'Articles', href: '/articles' },
            { label: journal?.title || 'Journal', href: '/articles' },
            { label: manuscript?.title || 'Article' },
          ]}
        />

        {/* Article Metadata Card */}
        <article className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
          {/* Journal Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-md border border-blue-100">
                {journal?.title || 'Scholarly Journal'}
              </span>
              {journal?.issn && (
                <span className="text-xs text-slate-500 font-mono">
                  ISSN: {journal.issn}
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Open Access
            </span>
          </div>

          {/* Title & Authors */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 leading-tight tracking-tight">
              {manuscript?.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-slate-700 pt-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                <User className="w-4 h-4 text-slate-500" />
                <span>{author?.full_name || 'Anonymous Author'}</span>
              </div>
              {author?.affiliation && (
                <span className="text-slate-600 border-l border-slate-200 pl-4">
                  {author.affiliation}
                </span>
              )}
              {author?.country && (
                <span className="text-slate-500">({author.country})</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Published on {pubDateStr}</span>
              </div>
              <div className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Volume {article.volume}, Issue {article.issue}, pp. {article.pages}</span>
              </div>
            </div>
          </div>

          {/* Action & DOI Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="space-y-0.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Digital Object Identifier
                </span>
                <a
                  href={`https://doi.org/${article.doi}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-800 font-mono hover:underline flex items-center gap-1.5"
                >
                  https://doi.org/{article.doi}
                  <Globe className="w-3.5 h-3.5" />
                </a>
              </div>
              <CopyDoiButton doi={article.doi} />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {downloadUrl && (
                <>
                  <a
                    href="#pdf-reader"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 shadow-sm transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    Read In-Browser
                  </a>
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Abstract */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Abstract
            </h2>
            <div className="text-sm text-slate-700 leading-relaxed bg-slate-50/80 p-5 rounded-xl border border-slate-100 font-serif">
              {manuscript?.abstract || 'No abstract provided for this manuscript.'}
            </div>
          </div>

          {/* Keywords */}
          {manuscript?.keywords && manuscript.keywords.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {manuscript.keywords.map((k: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-200 transition"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* In-Browser PDF Viewer */}
        <section id="pdf-reader" className="space-y-3 scroll-mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Full Manuscript Reader
            </h2>
            <span className="text-xs text-slate-500">
              Interactive In-Browser Viewer
            </span>
          </div>

          <ArticlePdfViewer
            pdfUrl={downloadUrl}
            title={manuscript?.title || 'Manuscript Full-Text'}
            doi={article.doi}
            journalTitle={journal?.title}
          />
        </section>

        {/* Citation Formats Tooling */}
        <section id="citations" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-blue-600" />
              Citation &amp; Bibliographic References
            </h2>
            <span className="text-xs text-slate-500">
              Standardized Scholarly Formats
            </span>
          </div>

          <CitationFormats
            title={manuscript?.title || 'Untitled Manuscript'}
            authorName={author?.full_name || 'Anonymous Author'}
            journalTitle={journal?.title || 'MANI Research Organization'}
            volume={article.volume}
            issue={article.issue}
            pages={article.pages}
            doi={article.doi}
            publishedAt={article.published_at}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-slate-900 text-slate-400 py-8 px-6 text-center text-xs border-t border-slate-800">
        <p className="max-w-2xl mx-auto">
          &copy; {new Date().getFullYear()} MANI Research Organization (MRO). All published manuscripts are distributed under the Creative Commons Attribution 4.0 International (CC BY 4.0) License.
        </p>
      </footer>
    </div>
  );
}