import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center flex-wrap gap-1 text-[11px] text-slate-500 font-sans ${className}`}
    >
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-sky-700 transition-colors py-0.5 px-1 rounded hover:bg-slate-100"
        title="Home"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="sr-only">Home</span>
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={idx} className="flex items-center gap-1">
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-sky-700 transition-colors py-0.5 px-1 rounded hover:bg-slate-100 truncate max-w-[200px]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="font-semibold text-slate-800 py-0.5 px-1 truncate max-w-[280px]"
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
