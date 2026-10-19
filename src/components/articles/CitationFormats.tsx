'use client';

import { useState } from 'react';
import { Copy, Check, Download, Quote, BookOpen, Code2, Sparkles } from 'lucide-react';

interface CitationProps {
  title: string;
  authorName?: string;
  journalTitle?: string;
  volume?: number | string;
  issue?: number | string;
  pages?: string;
  doi: string;
  publishedAt: string;
}

type CitationStyle = 'bibtex' | 'apa' | 'ieee' | 'mla' | 'chicago' | 'ris';

export default function CitationFormats({
  title,
  authorName = 'Unknown Author',
  journalTitle = 'MANI Research Organization Journal',
  volume = '1',
  issue = '1',
  pages = '1-10',
  doi,
  publishedAt,
}: CitationProps) {
  const [activeTab, setActiveTab] = useState<CitationStyle>('bibtex');
  const [copied, setCopied] = useState(false);

  const dateObj = new Date(publishedAt || Date.now());
  const year = isNaN(dateObj.getFullYear()) ? new Date().getFullYear() : dateObj.getFullYear();
  
  // Format Author helper
  const nameParts = authorName.trim().split(/\s+/);
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : authorName;
  const firstNames = nameParts.slice(0, -1).join(' ');
  const firstInitials = nameParts
    .slice(0, -1)
    .map((p) => `${p[0]?.toUpperCase()}.`)
    .join(' ');

  const apaAuthor = firstInitials ? `${lastName}, ${firstInitials}` : lastName;
  const ieeeAuthor = firstInitials ? `${firstInitials} ${lastName}` : lastName;
  const mlaAuthor = firstNames ? `${lastName}, ${firstNames}` : lastName;

  // Clean DOI and citation key
  const cleanDoi = doi.replace(/^https?:\/\/doi\.org\//, '');
  const citeKey = `mro_${year}_${cleanDoi.replace(/[^a-zA-Z0-9]/g, '_').slice(-10) || 'article'}`;

  // Citations mapping
  const citations: Record<CitationStyle, { name: string; content: string; filename?: string; mimeType?: string }> = {
    bibtex: {
      name: 'BibTeX',
      filename: `${citeKey}.bib`,
      mimeType: 'application/x-bibtex',
      content: `@article{${citeKey},
  author    = {${apaAuthor}},
  title     = {{${title}}},
  journal   = {{${journalTitle}}},
  year      = {${year}},
  volume    = {${volume}},
  number    = {${issue}},
  pages     = {${pages.replace('-', '--')}},
  doi       = {${cleanDoi}},
  url       = {https://doi.org/${cleanDoi}},
  publisher = {MANI Research Organization}
}`,
    },
    apa: {
      name: 'APA 7th',
      content: `${apaAuthor} (${year}). ${title}. ${journalTitle}, ${volume}(${issue}), ${pages}. https://doi.org/${cleanDoi}`,
    },
    ieee: {
      name: 'IEEE',
      content: `${ieeeAuthor}, "${title}," ${journalTitle}, vol. ${volume}, no. ${issue}, pp. ${pages}, ${year}, doi: ${cleanDoi}.`,
    },
    mla: {
      name: 'MLA 9th',
      content: `${mlaAuthor}. "${title}." ${journalTitle}, vol. ${volume}, no. ${issue}, ${year}, pp. ${pages}. DOI: https://doi.org/${cleanDoi}.`,
    },
    chicago: {
      name: 'Chicago',
      content: `${mlaAuthor}. "${title}." ${journalTitle} ${volume}, no. ${issue} (${year}): ${pages}. https://doi.org/${cleanDoi}.`,
    },
    ris: {
      name: 'RIS / EndNote',
      filename: `${citeKey}.ris`,
      mimeType: 'application/x-research-info-systems',
      content: `TY  - JOUR
TI  - ${title}
AU  - ${apaAuthor}
JO  - ${journalTitle}
VL  - ${volume}
IS  - ${issue}
SP  - ${pages.split('-')[0] || '1'}
EP  - ${pages.split('-')[1] || pages}
PY  - ${year}
DO  - ${cleanDoi}
UR  - https://doi.org/${cleanDoi}
PB  - MANI Research Organization
ER  - `,
    },
  };

  const currentCitation = citations[activeTab];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCitation.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback copy
      const textArea = document.createElement('textarea');
      textArea.value = currentCitation.content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleDownloadFile = () => {
    if (!currentCitation.filename) return;
    const blob = new Blob([currentCitation.content], { type: currentCitation.mimeType || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentCitation.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Quote className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-sm font-bold tracking-tight">Cite This Publication</h3>
            <p className="text-xs text-slate-400">Export scholarly citations in standard academic formats</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentCitation.filename && (
            <button
              type="button"
              suppressHydrationWarning
              onClick={handleDownloadFile}
              title={`Download .${activeTab} file`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              Download .{activeTab}
            </button>
          )}
          <button
            type="button"
            suppressHydrationWarning
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow transition ${
              copied
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Citation
              </>
            )}
          </button>
        </div>
      </div>

      {/* Format Selector Tabs */}
      <div className="border-b border-slate-200 bg-slate-50 px-4 pt-2 flex flex-wrap gap-1">
        {(Object.keys(citations) as CitationStyle[]).map((tabKey) => {
          const tab = citations[tabKey];
          const isActive = activeTab === tabKey;
          return (
            <button
              key={tabKey}
              type="button"
              suppressHydrationWarning
              onClick={() => {
                setActiveTab(tabKey);
                setCopied(false);
              }}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-white border-blue-600 text-blue-700 shadow-sm'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tabKey === 'bibtex' && <Code2 className="w-3.5 h-3.5 text-blue-600" />}
              {tabKey === 'apa' && <BookOpen className="w-3.5 h-3.5 text-indigo-600" />}
              {tabKey === 'ieee' && <Sparkles className="w-3.5 h-3.5 text-amber-600" />}
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Citation Content Box */}
      <div className="p-5">
        <div className="relative group">
          <pre
            tabIndex={0}
            className={`w-full p-4 rounded-lg text-xs font-mono border overflow-x-auto select-all transition ${
              activeTab === 'bibtex' || activeTab === 'ris'
                ? 'bg-slate-950 text-emerald-400 border-slate-800 leading-relaxed'
                : 'bg-slate-50 text-slate-800 border-slate-200 leading-relaxed'
            }`}
          >
            {currentCitation.content}
          </pre>
        </div>
        <p className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Click anywhere in the box or press &quot;Copy Citation&quot; to copy to your clipboard.</span>
          <span className="font-mono text-slate-400">Format: {currentCitation.name}</span>
        </p>
      </div>
    </div>
  );
}
