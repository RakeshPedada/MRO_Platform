'use client';

import { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Download,
  ExternalLink,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface ArticlePdfViewerProps {
  pdfUrl: string;
  title: string;
  doi: string;
  journalTitle?: string;
}

export default function ArticlePdfViewer({
  pdfUrl,
  title,
  doi,
  journalTitle = 'MANI Research Organization',
}: ArticlePdfViewerProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(!pdfUrl);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pdfUrl) {
      setHasError(true);
      setIsLoading(false);
    } else {
      setHasError(false);
    }
  }, [pdfUrl]);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!pdfUrl) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-slate-800">Manuscript Document Unavailable</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          The full-text PDF document is currently not accessible for preview. Please check back later or contact the editorial office.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        ref={fullscreenContainerRef}
        className={`bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transition-all duration-200 ${
          isFullscreen
            ? 'fixed inset-0 z-50 rounded-none border-0 flex flex-col bg-slate-900'
            : 'flex flex-col'
        }`}
      >
        {/* Viewer Chrome Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 select-none">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide truncate">
                  Full-Text Article Reader
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  Peer Reviewed &amp; Open Access
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-md">
                {title}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition border border-slate-700"
              title="Open PDF in a new browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Open in Tab</span>
            </a>

            <a
              href={pdfUrl}
              download={`${doi.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow transition"
              title="Download full PDF manuscript"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>

            <button
              type="button"
              suppressHydrationWarning
              onClick={toggleFullscreen}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen Reader'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            {!isFullscreen && (
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
                title={isOpen ? 'Collapse Reader' : 'Expand Reader'}
              >
                {isOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* PDF Body Container */}
        {(isOpen || isFullscreen) && (
          <div
            className={`relative w-full bg-slate-800 flex-1 ${
              isFullscreen ? 'h-full' : 'h-[750px] min-h-[500px]'
            }`}
          >
            {/* Loading Indicator */}
            {isLoading && (
              <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-slate-300 gap-3">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
                <p className="text-xs font-medium">Rendering PDF Document...</p>
              </div>
            )}

            {/* Error Message */}
            {hasError ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-300 gap-3 bg-slate-900">
                <AlertCircle className="w-8 h-8 text-amber-400" />
                <p className="text-sm font-semibold text-white">Browser Preview Not Supported</p>
                <p className="text-xs text-slate-400 max-w-sm">
                  Your browser could not render the PDF embedded directly inside this frame.
                </p>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
                >
                  View Document in Full Browser Tab
                </a>
              </div>
            ) : (
              <iframe
                src={`${pdfUrl}#view=FitH&toolbar=1&navpanes=0`}
                title={`${title} - PDF Viewer`}
                className="w-full h-full border-0 bg-slate-100"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
              />
            )}
          </div>
        )}

        {/* Subtle Footer Bar */}
        {!isFullscreen && isOpen && (
          <div className="bg-slate-100 px-4 py-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="truncate">
              DOI: <span className="font-mono text-slate-700">{doi}</span>
            </span>
            <span className="hidden sm:inline text-slate-400">
              {journalTitle} &bull; Open Access License
            </span>
          </div>
        )}
      </div>

      {/* Backdrop blur when fullscreen */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsFullscreen(false)}
        />
      )}
    </>
  );
}
