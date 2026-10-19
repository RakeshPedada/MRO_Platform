import Link from 'next/link';
import { ShieldCheck, Scale, FileText, Globe2, Building2 } from 'lucide-react';

export default function InstitutionalFooter() {
  return (
    <footer className="bg-[#0b1b3d] text-slate-400 text-xs py-12 border-t border-slate-800 mt-auto font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-[11px]">
        {/* Column 1: Organization & Corporate Registration */}
        <div className="space-y-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="bg-[#0284c7] text-white font-extrabold text-xs px-2 py-0.5 rounded">
              MRO
            </span>
            <span className="text-white font-bold text-sm tracking-tight">
              MANI Research Organization
            </span>
          </div>
          <p className="leading-relaxed text-slate-300">
            Multidisciplinary Advanced Network for Innovation and Research Organization. An academic publishing initiative of <strong>MANI Market Private Limited</strong>.
          </p>
          <div className="text-slate-400 font-mono text-[10px] pt-1 space-y-0.5">
            <p>CIN: <span className="text-slate-300">U58130AP2026PTC127065</span></p>
            <p>GSTIN: <span className="text-slate-300">37AAVCM2351A1ZI</span></p>
          </div>
        </div>

        {/* Column 2: Registered Office & Administration */}
        <div className="space-y-2">
          <h4 className="text-white font-bold uppercase tracking-wider text-xs flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Registered Office</span>
          </h4>
          <p className="leading-relaxed text-slate-300">
            Kuntinavalasa Village, Mentada Mandal,<br />
            Vizianagaram District, Andhra Pradesh - 535580, India.
          </p>
          <p className="text-slate-400 pt-1 text-[10px]">
            Founder: <strong className="text-white">Nangireddy Manikanta</strong>
          </p>
          <p className="text-slate-400 text-[10px]">
            Official Support: <Link href="/contact" className="text-sky-400 hover:underline">Contact Office</Link>
          </p>
        </div>

        {/* Column 3: Publishing Ethics & Open Access */}
        <div className="space-y-2">
          <h4 className="text-white font-bold uppercase tracking-wider text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ethics &amp; Licensing</span>
          </h4>
          <p className="leading-relaxed text-slate-300">
            MRO adheres strictly to the standards set by the <strong>Committee on Publication Ethics (COPE)</strong>.
          </p>
          <p className="text-slate-400">
            Articles are distributed Open Access under the <strong>Creative Commons Attribution 4.0 International License (CC BY 4.0)</strong>.
          </p>
          <Link href="/ethics" className="inline-block text-sky-400 hover:underline text-[10px]">
            Read Complete Ethics Policies &rarr;
          </Link>
        </div>

        {/* Column 4: Institutional Links */}
        <div className="space-y-2">
          <h4 className="text-white font-bold uppercase tracking-wider text-xs">
            Scholarly Navigation
          </h4>
          <ul className="space-y-1.5 text-slate-300">
            <li>
              <Link href="/about" className="hover:text-white">
                &bull; About MANI Research Org
              </Link>
            </li>
            <li>
              <Link href="/articles" className="hover:text-white">
                &bull; Open Access Articles Catalog
              </Link>
            </li>
            <li>
              <Link href="/guidelines" className="hover:text-white">
                &bull; Author Guidelines &amp; Formatting
              </Link>
            </li>
            <li>
              <Link href="/editorial-board" className="hover:text-white">
                &bull; Editorial Board Directory
              </Link>
            </li>
            <li>
              <Link href="/submit" className="hover:text-white">
                &bull; Submit Manuscript
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                &bull; Contact &amp; Grievance Redressal
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
        <p>
          &copy; {new Date().getFullYear()} MANI Research Organization (MRO). An initiative of MANI Market Private Limited. All rights reserved.
        </p>
        <div className="flex flex-wrap gap-4 text-[10px]">
          <span>Peer-Reviewed Literature</span>
          <span>&bull;</span>
          <span>CC BY 4.0 Open Access</span>
          <span>&bull;</span>
          <span>Permanent Crossref DOI Archiving</span>
        </div>
      </div>
    </footer>
  );
}
