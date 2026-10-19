'use client';

import { useState, useEffect } from 'react';
import { BookOpen, ListTree, ChevronRight } from 'lucide-react';

interface NavSection {
  id: string;
  label: string;
}

const SECTIONS: NavSection[] = [
  { id: 'abstract', label: 'Abstract' },
  { id: 'introduction', label: '1. Introduction' },
  { id: 'methodology', label: '2. Methodology' },
  { id: 'results', label: '3. Results' },
  { id: 'discussion', label: '4. Discussion' },
  { id: 'references', label: 'References & Citations' },
  { id: 'pdf-reader', label: 'Full-Text PDF' },
];

export default function ArticleOutlineNav() {
  const [activeSection, setActiveSection] = useState<string>('abstract');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(SECTIONS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
        <ListTree className="w-4 h-4 text-sky-700" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#0b1b3d]">
          Article Navigation
        </h3>
      </div>

      <nav className="space-y-1 text-xs">
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              suppressHydrationWarning
              onClick={() => scrollToSection(sec.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition flex items-center justify-between group ${
                isActive
                  ? 'bg-sky-50 text-[#0284c7] font-bold border-l-4 border-[#0284c7]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="truncate">{sec.label}</span>
              <ChevronRight
                className={`w-3 h-3 transition-transform ${
                  isActive ? 'text-[#0284c7] translate-x-0.5' : 'text-slate-300 opacity-0 group-hover:opacity-100'
                }`}
              />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
