'use client';

import { useState } from 'react';
import { Share2, Check, Copy, Mail } from 'lucide-react';

interface ArticleShareStripProps {
  title: string;
  doi: string;
  url?: string;
}

export default function ArticleShareStrip({ title, doi, url }: ArticleShareStripProps) {
  const [copied, setCopied] = useState(false);

  const articleUrl = url || (typeof window !== 'undefined' ? window.location.href : `https://doi.org/${doi}`);
  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#0b1b3d] flex items-center gap-1.5 border-b border-slate-100 pb-2">
        <Share2 className="w-3.5 h-3.5 text-sky-700" />
        <span>Share Article</span>
      </h3>

      <div className="grid grid-cols-5 gap-1.5">
        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on LinkedIn"
          className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700 hover:text-sky-800 transition text-[10px] font-semibold gap-1 text-center"
        >
          <svg className="w-4 h-4 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
          </svg>
          <span className="truncate w-full text-center">LinkedIn</span>
        </a>

        {/* X / Twitter */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=MANI_Research`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on X (Twitter)"
          className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition text-[10px] font-semibold gap-1 text-center"
        >
          <svg className="w-4 h-4 text-slate-800" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span className="truncate w-full text-center">X / Post</span>
        </a>

        {/* ResearchGate */}
        <a
          href={`https://www.researchgate.net/search/publication?q=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Find / Share on ResearchGate"
          className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-teal-50 text-slate-700 hover:text-teal-800 transition text-[10px] font-semibold gap-1 text-center"
        >
          <svg className="w-4 h-4 text-[#00ccbb]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.54 0H4.46C2 0 0 2 0 4.46v15.08C0 22 2 24 4.46 24h15.08C22 24 24 22 24 19.54V4.46C24 2 22 0 19.54 0zM8.38 18.06H5.43V6.98h3.33c2.4 0 3.82 1.34 3.82 3.44 0 1.62-.88 2.76-2.22 3.19l2.76 4.45h-3.4l-2.27-3.83h-.07v3.83zm0-6.19h.56c1.04 0 1.69-.53 1.69-1.4 0-.89-.65-1.4-1.69-1.4h-.56v2.8zm9.18 6.29c-3.15 0-4.99-2.12-4.99-5.63 0-3.52 1.84-5.65 4.99-5.65 1.76 0 3.12.71 3.91 1.93l-1.92 1.54c-.45-.73-1.12-1.07-2-1.07-1.44 0-2.34 1.11-2.34 3.25 0 2.13.9 3.24 2.34 3.24.96 0 1.62-.43 2.05-1.15v-1.44h-2.17v-2.19h4.74v4.4c-.95 1.62-2.45 2.57-4.61 2.57z"/>
          </svg>
          <span className="truncate w-full text-center">RG</span>
        </a>

        {/* Email */}
        <a
          href={`mailto:?subject=${encodedTitle}&body=I recommend reading this peer-reviewed open access paper published by MANI Research Organization:%0D%0A%0D%0A${encodedTitle}%0D%0A${encodedUrl}`}
          title="Share via Email"
          className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700 hover:text-sky-800 transition text-[10px] font-semibold gap-1 text-center"
        >
          <Mail className="w-4 h-4 text-emerald-600" />
          <span className="truncate w-full text-center">Email</span>
        </a>

        {/* Copy Link */}
        <button
          type="button"
          onClick={handleCopyLink}
          title="Copy article link"
          className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700 hover:text-sky-800 transition text-[10px] font-semibold gap-1 cursor-pointer text-center"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
          ) : (
            <Copy className="w-4 h-4 text-slate-600" />
          )}
          <span className="truncate w-full text-center">{copied ? 'Copied' : 'Link'}</span>
        </button>
      </div>

      <p className="text-[10px] text-slate-400 text-center pt-1 italic">
        Open Access distribution under CC BY 4.0
      </p>
    </div>
  );
}
