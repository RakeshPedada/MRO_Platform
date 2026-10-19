'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyDoiButtonProps {
  doi: string;
  className?: string;
  showUrlOnCopy?: boolean;
}

export default function CopyDoiButton({
  doi,
  className = '',
  showUrlOnCopy = true,
}: CopyDoiButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const textToCopy = showUrlOnCopy && !doi.startsWith('http')
      ? `https://doi.org/${doi}`
      : doi;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleCopy}
        title="Click to copy permanent DOI link"
        className={`scholarly-badge-doi group hover:border-sky-300 hover:bg-sky-50/50 hover:text-sky-800 transition-all duration-150 cursor-pointer ${className}`}
      >
        <span className="text-slate-500 font-sans font-medium text-[10px]">DOI:</span>
        <span className="text-slate-800 font-mono font-semibold">{doi}</span>
        <span className="ml-1 text-slate-400 group-hover:text-sky-600 transition-colors">
          {copied ? (
            <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </span>
      </button>

      {/* Floating Toast Notification */}
      {copied && (
        <div
          role="status"
          aria-live="polite"
          className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#0b1b3d] text-white text-[10px] font-sans font-semibold rounded shadow-md z-30 whitespace-nowrap animate-in fade-in zoom-in-95 duration-150 flex items-center gap-1"
        >
          <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />
          <span>DOI Copied!</span>
        </div>
      )}
    </div>
  );
}
