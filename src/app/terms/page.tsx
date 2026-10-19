import InstitutionalHeader from '@/components/layout/InstitutionalHeader';
import InstitutionalFooter from '@/components/layout/InstitutionalFooter';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Link from 'next/link';
import {
  FileText,
  Scale,
  ShieldCheck,
  Building2,
  Lock,
  Globe2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | MANI Research Organization (MRO)',
  description:
    'Terms and Conditions of publication and service for MANI Research Organization (MRO), an academic initiative of MANI Market Private Limited (CIN: U58130AP2026PTC127065).',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <InstitutionalHeader />

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 flex-1 w-full">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={[{ label: 'Terms of Service' }]} />

        {/* Header Banner */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-800 text-xs font-bold uppercase tracking-wider rounded-md border border-sky-100">
            <Scale className="w-3.5 h-3.5 text-sky-700" />
            <span>Legal Framework &amp; Publishing Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b1b3d] tracking-tight leading-tight">
            Terms of Service &amp; Publication Agreement
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
            These Terms of Service constitute a legally binding agreement between you (as an author, peer reviewer, editor, or reader) and <strong>MANI Research Organization (MRO)</strong>, an academic scholarly publishing division of <strong>MANI Market Private Limited</strong>.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500 font-mono">
            <span>Effective Date: October 2026</span>
            <span>&bull;</span>
            <span>Licensing: CC BY 4.0 Open Access</span>
            <span>&bull;</span>
            <span>CIN: U58130AP2026PTC127065</span>
          </div>
        </section>

        {/* Corporate Entity Identification */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0b1b3d] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-sky-700" />
              <span>1. Corporate Entity &amp; Institutional Governance</span>
            </h2>
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded border border-slate-200">
              Incorporated Entity
            </span>
          </div>

          <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
            <p>
              The platform is operated by <strong>MANI Market Private Limited</strong>, an incorporated company registered under the Companies Act, 2013, Ministry of Corporate Affairs, Government of India:
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <p className="font-bold text-slate-900 text-sm">
                MANI Market Private Limited
              </p>
              <p className="font-serif text-slate-700">
                Division: MANI Research Organization (MRO)<br />
                Founder: Nangireddy Manikanta<br />
                Registered Office: Kuntinavalasa Village, Mentada Mandal, Vizianagaram District, Andhra Pradesh - 535580, India.
              </p>
              <div className="pt-1 font-mono text-[11px] text-slate-600 flex flex-wrap gap-4">
                <span>CIN: <strong className="text-slate-900">U58130AP2026PTC127065</strong></span>
                <span>GSTIN: <strong className="text-slate-900">37AAVCM2351A1ZI</strong></span>
              </div>
            </div>
            <p>
              By accessing, submitting manuscripts, reviewing, or reading content published by MRO, you accept and agree to be bound by these terms without limitation or qualification.
            </p>
          </div>
        </section>

        {/* CC BY 4.0 Open Access Licensing & Copyright */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0b1b3d] flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-sky-700" />
              <span>2. Copyright Retention &amp; Creative Commons Licensing</span>
            </h2>
            <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
              CC BY 4.0 Standard
            </span>
          </div>

          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <p>
              MRO is an uncompromising Diamond/Gold Open Access publisher:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <span className="font-bold text-slate-900 block text-xs">Author Copyright Retention</span>
                <p className="text-slate-600 text-[11px]">
                  Authors retain unencumbered copyright of their published articles. Authors grant MRO a non-exclusive, irrevocable license to publish, syndicate, archive, and display the article in perpetuity across digital repositories.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <span className="font-bold text-slate-900 block text-xs">CC BY 4.0 Open Access License</span>
                <p className="text-slate-600 text-[11px]">
                  All published articles are distributed under the terms of the Creative Commons Attribution 4.0 International License (CC BY 4.0). Readers may share, adapt, and build upon the material for any purpose, provided proper academic citation is given.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Author Warranties & Ethics */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-bold text-[#0b1b3d] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>3. Author Warranties &amp; Ethical Responsibilities</span>
            </h2>
          </div>

          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <p>
              By submitting a manuscript to MRO, the corresponding author warrants on behalf of all co-authors that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>The manuscript represents original research and has not been published or submitted concurrently elsewhere.</li>
              <li>The work contains no plagiarism, fabricated data, manipulated figures, or uncredited third-party intellectual property.</li>
              <li>All declared authors made substantial contributions and have approved the final manuscript draft.</li>
              <li>All potential financial, commercial, or personal conflicts of interest have been disclosed in the designated submission fields.</li>
              <li>Research involving human subjects or animal models strictly complies with the Declaration of Helsinki or institutional ethics review boards (IRB/IACUC).</li>
            </ul>
          </div>
        </section>

        {/* Retractions, Corrections & Misconduct */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-bold text-[#0b1b3d] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>4. Corrections, Retractions &amp; Post-Publication Integrity</span>
            </h2>
          </div>

          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <p>
              MRO adheres strictly to the guidelines established by the Committee on Publication Ethics (COPE). In the event of verified scientific errors or academic misconduct:
            </p>
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <strong className="text-slate-900 block">Corrections (Errata / Corrigenda):</strong>
                <span className="text-slate-600 text-[11px]">Issued for unintentional typographical or computational errors that do not compromise core findings.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <strong className="text-slate-900 block">Formal Retractions:</strong>
                <span className="text-slate-600 text-[11px]">Enacted for substantiated instances of data falsification, severe plagiarism, or peer-review manipulation. Retracted articles remain accessible with a permanent watermark and Crossref retraction notice to preserve the scientific record.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Jurisdiction & Governing Law */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0b1b3d] flex items-center gap-2">
              <Scale className="w-5 h-5 text-sky-700" />
              <span>5. Governing Law &amp; Judicial Jurisdiction</span>
            </h2>
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded border border-slate-200">
              Statutory Jurisdiction
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <p>
              These Terms and any dispute arising from the use of MRO publishing platforms or services shall be governed and interpreted in accordance with the laws of the Republic of India.
            </p>
            <p>
              The parties irrevocably agree that the courts located in <strong>Vizianagaram District, Andhra Pradesh, India</strong> shall have exclusive jurisdiction to settle any dispute, claim, or controversy arising out of or in connection with these Terms or the operations of MANI Market Private Limited.
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Legal Inquiries: legal@maniresearch.org</span>
              <Link href="/privacy" className="text-sky-700 hover:underline font-semibold">
                Read Privacy Policy &rarr;
              </Link>
            </div>
          </div>
        </section>
      </main>

      <InstitutionalFooter />
    </div>
  );
}
