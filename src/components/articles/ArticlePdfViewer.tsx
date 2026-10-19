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
  AlertCircle,
  Eye,
  LockOpen,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface ArticlePdfViewerProps {
  pdfUrl?: string | null;
  title: string;
  doi: string;
  journalTitle?: string;
}

function isValidPdfSource(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (
    trimmed === '' ||
    trimmed === '#' ||
    trimmed.startsWith('javascript:') ||
    trimmed.toLowerCase() === 'null' ||
    trimmed.toLowerCase() === 'undefined'
  ) {
    return false;
  }
  try {
    if (trimmed.startsWith('/') || trimmed.startsWith('blob:')) return true;
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
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
  const [isConfirmedReachable, setIsConfirmedReachable] = useState(false);
  const [userRequestedEmbed, setUserRequestedEmbed] = useState(false);
  const [hasError, setHasError] = useState(false);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);

  const isValidUrl = isValidPdfSource(pdfUrl);
  const targetUrl = isValidUrl ? pdfUrl! : '';
  const downloadLink = targetUrl || `https://doi.org/${doi}`;

  // Check reachability of the PDF URL to prevent blank iframe blocks
  useEffect(() => {
    let isMounted = true;
    if (!isValidUrl) {
      setIsConfirmedReachable(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    fetch(targetUrl, { method: 'HEAD', signal: controller.signal })
      .then((res) => {
        clearTimeout(timeoutId);
        if (!isMounted) return;
        if (res.ok) {
          setIsConfirmedReachable(true);
        } else {
          setIsConfirmedReachable(false);
        }
        setIsLoading(false);
      })
      .catch(() => {
        clearTimeout(timeoutId);
        if (!isMounted) return;
        // In case of CORS or timeout, reachability is unconfirmed
        setIsConfirmedReachable(false);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [isValidUrl, targetUrl]);

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

  // Only render the iframe if a valid, reachable PDF source URL is confirmed OR explicitly requested by the user
  const canRenderIframe = isValidUrl && (isConfirmedReachable || userRequestedEmbed) && !hasError;

  return (
    <>
      <div
        ref={fullscreenContainerRef}
        className={`bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-200 ${
          isFullscreen
            ? 'fixed inset-0 z-50 rounded-none border-0 flex flex-col bg-slate-950'
            : 'flex flex-col min-h-[500px]'
        }`}
      >
        {/* Viewer Chrome Header */}
        <div className="bg-[#0b1b3d] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 select-none">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-[#0284c7]/20 text-[#0284c7] rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide truncate">
                  Full Manuscript PDF Reader
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
            {/* Open in New Tab Link */}
            <a
              href={downloadLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition border border-slate-700"
              title="Open PDF in a new browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden md:inline">Open in New Tab</span>
            </a>

            {/* Direct Download Manuscript PDF Button */}
            <a
              href={downloadLink}
              download={targetUrl ? `${doi.replace(/[^a-zA-Z0-9]/g, '_')}.pdf` : undefined}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-lg text-xs font-semibold shadow transition"
              title="Download full PDF manuscript"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Manuscript PDF</span>
            </a>

            {/* Embed / Fallback Toggle button (if URL is valid) */}
            {isValidUrl && (
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => {
                  setUserRequestedEmbed(!canRenderIframe);
                  if (hasError) setHasError(false);
                }}
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition border border-slate-700"
                title={canRenderIframe ? 'Switch to Document Preview' : 'Load Interactive Iframe'}
              >
                <Eye className="w-3.5 h-3.5 text-sky-400" />
                <span>{canRenderIframe ? 'Preview Banner' : 'Interactive Viewer'}</span>
              </button>
            )}

            {/* Fullscreen Toggle */}
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

            {/* Collapse/Expand */}
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

        {/* Content Body */}
        {(isOpen || isFullscreen) && (
          <div
            className={`relative w-full flex-1 ${
              isFullscreen ? 'h-full bg-slate-900' : 'min-h-[500px]'
            }`}
          >
            {canRenderIframe ? (
              // Confirmed Valid & Reachable PDF Iframe
              <div className="relative w-full h-[750px] min-h-[500px] bg-slate-800">
                {isLoading && (
                  <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-slate-300 gap-3">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#0284c7]" />
                    <p className="text-xs font-medium">Rendering PDF Document...</p>
                  </div>
                )}
                <iframe
                  src={`${targetUrl}#view=FitH&toolbar=1&navpanes=0`}
                  title={`${title} - PDF Viewer`}
                  className="w-full h-full border-0 bg-slate-100"
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                  }}
                />
              </div>
            ) : (
              // Elegant Scholarly Fallback Preview Banner
              <div className="w-full h-full min-h-[500px] bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6 sm:p-10 flex flex-col items-center justify-center text-center">
                {/* Academic Document Icon Emblem */}
                <div className="relative mb-5">
                  <div className="w-20 h-24 rounded-xl border-2 border-slate-200 bg-white shadow-md flex flex-col items-center justify-center relative p-3">
                    <FileText className="w-10 h-10 text-[#0284c7]" />
                    <span className="absolute -bottom-2.5 px-2 py-0.5 bg-[#0b1b3d] text-white text-[10px] font-mono font-bold rounded shadow-xs">
                      PDF/A
                    </span>
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white p-1 rounded-full shadow">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Banner Heading & Status */}
                <div className="space-y-1.5 max-w-xl mx-auto">
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#0b1b3d] leading-snug">
                    Full Manuscript PDF Available for Download
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Official archival publication record issued by {journalTitle}. Distributed under Creative Commons Attribution 4.0 International (CC BY 4.0) with complete cross-referenced metadata.
                  </p>
                </div>

                {/* Article Metadata Capsule */}
                <div className="mt-5 bg-white border border-slate-200 rounded-xl p-4 max-w-2xl w-full shadow-xs text-left space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-100 pb-2">
                    <span className="font-bold text-[#0b1b3d] truncate max-w-md">
                      {title}
                    </span>
                    <span className="scholarly-badge-oa text-[10px] py-0.5">
                      <LockOpen className="w-3 h-3" />
                      Open Access
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 font-mono">
                    <span>DOI: <strong className="text-slate-800">{doi}</strong></span>
                    <span>&bull;</span>
                    <span>Standard: <strong className="text-slate-800">ISO 19005 (PDF/A-1b)</strong></span>
                    <span>&bull;</span>
                    <span>Indexing: <strong className="text-emerald-700 font-sans font-bold">Crossref / Google Scholar</strong></span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  <a
                    href={downloadLink}
                    download={targetUrl ? `${doi.replace(/[^a-zA-Z0-9]/g, '_')}.pdf` : undefined}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition"
                    title="Download complete manuscript PDF"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Manuscript PDF</span>
                  </a>

                  <a
                    href={downloadLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl text-sm font-semibold border border-slate-300 shadow-xs transition"
                    title="Open document in a separate browser tab"
                  >
                    <ExternalLink className="w-4 h-4 text-sky-700" />
                    <span>Open in New Tab</span>
                  </a>
                </div>

                {/* User Option to attempt interactive iframe if valid URL exists */}
                {isValidUrl && !userRequestedEmbed && (
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => setUserRequestedEmbed(true)}
                    className="mt-4 text-xs text-sky-700 hover:text-sky-900 font-medium hover:underline inline-flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Attempt In-Browser Interactive Viewer</span>
                  </button>
                )}

                {/* Telemetry Footer Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl w-full mt-8 pt-6 border-t border-slate-200 text-[11px] text-slate-500">
                  <div>
                    <span className="block text-slate-400">Format:</span>
                    <strong className="text-slate-800">PDF/A Academic</strong>
                  </div>
                  <div>
                    <span className="block text-slate-400">Access:</span>
                    <strong className="text-emerald-700 font-semibold">Immediate OA</strong>
                  </div>
                  <div>
                    <span className="block text-slate-400">License:</span>
                    <strong className="text-slate-800">CC BY 4.0</strong>
                  </div>
                  <div>
                    <span className="block text-slate-400">Archival:</span>
                    <strong className="text-slate-800">Permanent DOI</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Subtle Footer Bar */}
        {!isFullscreen && isOpen && (
          <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-200 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
            <span className="truncate">
              Permanent Identifier: <span className="font-mono text-slate-700 font-medium">https://doi.org/{doi}</span>
            </span>
            <span className="text-slate-400">
              {journalTitle} &bull; Multidisciplinary Scientific Repository
            </span>
          </div>
        )}
      </div>

      {/* Backdrop blur when fullscreen */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          onClick={() => setIsFullscreen(false)}
        />
      )}
    </>
  );
}
