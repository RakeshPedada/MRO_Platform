import InstitutionalHeader from '@/components/layout/InstitutionalHeader';
import InstitutionalFooter from '@/components/layout/InstitutionalFooter';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Link from 'next/link';
import {
  FileText,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ListOrdered,
  Send,
  Download,
  Quote,
  ShieldCheck,
  Scale,
  Sparkles,
} from 'lucide-react';

export const metadata = {
  title: 'Author Guidelines & Instructions | MANI Research Organization (MRO)',
  description:
    'Comprehensive manuscript preparation, formatting rules, abstract standards, citation requirements, and ethical guidelines for authors submitting to MRO journals.',
};

export default function AuthorGuidelinesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <InstitutionalHeader />

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 flex-1 w-full">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={[{ label: 'Author Guidelines' }]} />

        {/* Header Banner */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-md border border-blue-100">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Instructions for Authors</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b1b3d] tracking-tight leading-tight">
            Manuscript Preparation &amp; Submission Guidelines
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
            Authors submitting to MANI Research Organization (MRO) journals must ensure their manuscripts strictly adhere to the formatting, ethical, and structural guidelines outlined below. Adherence accelerates the screening and peer-review process.
          </p>

          <div className="pt-2">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Manuscript Now</span>
            </Link>
          </div>
        </section>

        {/* 1. Article Types & Eligibility */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-[#0b1b3d] flex items-center gap-2 border-b border-slate-100 pb-3">
            <ListOrdered className="w-5 h-5 text-sky-700" />
            <span>1. Article Classifications Accepted</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm">Original Research Articles</h3>
              <p className="text-slate-600 leading-relaxed">
                Full-length papers reporting original empirical findings, theoretical frameworks, or novel experimental methodologies. Typically 4,000–8,000 words.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm">Review Articles</h3>
              <p className="text-slate-600 leading-relaxed">
                Comprehensive, authoritative surveys synthesizing recent advances, state-of-the-art developments, and future research trajectories in specialized fields.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm">Technical Communications</h3>
              <p className="text-slate-600 leading-relaxed">
                Concise reports on preliminary discoveries, software implementations, new algorithms, or industrial prototypes requiring accelerated dissemination.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Manuscript Structure & Preparation */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-5 text-xs text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-[#0b1b3d] flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-5 h-5 text-sky-700" />
            <span>2. Manuscript Structure &amp; Required Sections</span>
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">A. Title Page &amp; Author Metadata</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li><strong>Title:</strong> Concise, informative, and grammatically precise (avoid uncommon acronyms).</li>
                <li><strong>Author Roster:</strong> Full legal names, institutional affiliations (department, university/company, city, country).</li>
                <li><strong>Corresponding Author:</strong> Explicitly marked with official institutional email address.</li>
                <li><strong>ORCID iDs:</strong> Mandatory for corresponding author; highly encouraged for all co-authors.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">B. Abstract &amp; Keywords Requirements</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li><strong>Abstract:</strong> Maximum 250–300 words. Must be self-contained and structured to cover: <em>Objective, Methodology, Core Findings, and Conclusions</em>. Do not cite references within the abstract.</li>
                <li><strong>Keywords:</strong> 4 to 8 specific, relevant keywords separated by commas (e.g., <em>High-Voltage Systems, Neural Networks, Fault Detection</em>). Avoid overly generic single words.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">C. Standard Body Organization (IMRaD)</h3>
              <p className="text-slate-600 mb-2">
                Manuscripts must follow the standard scientific IMRaD sequence:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 bg-white rounded border border-slate-200">
                  <strong className="text-slate-900 block">1. Introduction:</strong> Provide context, literature review, problem formulation, and explicit novel contributions.
                </div>
                <div className="p-2.5 bg-white rounded border border-slate-200">
                  <strong className="text-slate-900 block">2. Materials &amp; Methods:</strong> Transparent, reproducible detailing of setups, algorithms, datasets, and mathematical formulations.
                </div>
                <div className="p-2.5 bg-white rounded border border-slate-200">
                  <strong className="text-slate-900 block">3. Results &amp; Discussion:</strong> Objective empirical data, comparative benchmarks, statistical significance, and contextual interpretation.
                </div>
                <div className="p-2.5 bg-white rounded border border-slate-200">
                  <strong className="text-slate-900 block">4. Conclusions:</strong> Clear summary of verified findings, practical implications, and future research directions.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Citations & References Standard */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-4 text-xs text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-[#0b1b3d] flex items-center gap-2 border-b border-slate-100 pb-3">
            <Quote className="w-5 h-5 text-sky-700" />
            <span>3. Citation &amp; Reference Standards</span>
          </h2>

          <p>
            MRO accepts IEEE (bracketed numbers e.g. [1]) or APA 7th (Author, Year) citation formats. Consistency throughout the entire bibliography is strictly mandatory.
          </p>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] space-y-2">
            <span className="text-slate-500 font-bold block uppercase tracking-wider text-[10px]">
              Standard IEEE Reference Format:
            </span>
            <p className="text-slate-800 bg-white p-2.5 rounded border border-slate-200 select-all">
              [1] J. K. Author, &quot;Title of manuscript,&quot; <em>MRO Journal of Advanced Engineering</em>, vol. 1, no. 1, pp. 1-8, 2026, doi: 10.5555/mro.2026.d4e36f74.
            </p>
          </div>

          <p className="text-amber-800 bg-amber-50 p-3 rounded-lg border border-amber-200 text-[11px]">
            <strong>Mandatory DOI Rule:</strong> Every cited journal article or conference proceeding MUST include its resolved digital object identifier (DOI) link (e.g., <code>https://doi.org/10...</code>).
          </p>
        </section>

        {/* 4. Mandatory Ethical Disclosures */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-4 text-xs text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-[#0b1b3d] flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-sky-700" />
            <span>4. Mandatory Back-Matter Declarations</span>
          </h2>

          <p>Before the References section, authors must include the following explicit statements:</p>

          <ul className="space-y-3">
            <li className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <strong className="text-slate-900 block mb-0.5">Author Contributions (CRediT Taxonomy):</strong>
              Detail individual contributions: Conceptualization, Methodology, Software, Validation, Formal Analysis, Writing – Original Draft, Supervision.
            </li>
            <li className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <strong className="text-slate-900 block mb-0.5">Conflict of Interest:</strong>
              Authors must declare any financial or personal relationships that could inappropriately bias their work. If none exist, state: <em>&quot;The authors declare no conflict of interest.&quot;</em>
            </li>
            <li className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <strong className="text-slate-900 block mb-0.5">Data Availability Statement:</strong>
              Explain how readers can access underlying datasets, repositories, or source code (e.g., GitHub, Zenodo, Figshare).
            </li>
            <li className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <strong className="text-slate-900 block mb-0.5">Funding Statement:</strong>
              List all grant numbers and sponsoring government/corporate bodies supporting the investigation.
            </li>
          </ul>
        </section>

        {/* 5. Pre-Submission Checklist & CTA */}
        <section className="bg-[#0b1b3d] text-white rounded-2xl p-8 sm:p-10 shadow-md space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Pre-Submission Verification Checklist</h2>
            <p className="text-xs text-slate-300">Ensure the following criteria are met before uploading your file:</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>PDF format, clean layout, figures &ge;300 DPI</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Structured abstract (250–300 words) &amp; 4–8 keywords</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Plagiarism threshold &lt;15% overall, zero AI fabrication</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>All authors agreed to CC BY 4.0 Open Access license</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              <Send className="w-4 h-4" />
              <span>Proceed to Manuscript Submission Portal</span>
            </Link>
          </div>
        </section>
      </main>

      <InstitutionalFooter />
    </div>
  );
}
