import InstitutionalHeader from '@/components/layout/InstitutionalHeader';
import InstitutionalFooter from '@/components/layout/InstitutionalFooter';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  FileText,
  Building2,
  Scale,
  UserCheck,
  Database,
  Mail,
  AlertCircle,
} from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | MANI Research Organization (MRO)',
  description:
    'Privacy Policy and Data Protection Framework of MANI Research Organization (MRO), governed by MANI Market Private Limited under the DPDP Act 2023 and COPE confidentiality standards.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <InstitutionalHeader />

      <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10 flex-1 w-full">
        {/* Header Banner */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-800 text-xs font-bold uppercase tracking-wider rounded-md border border-sky-100">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-700" />
            <span>Institutional Governance &amp; Data Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b1b3d] tracking-tight leading-tight">
            Privacy Policy &amp; Data Safeguards
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
            This Privacy Policy governs the processing, retention, and strict confidentiality of academic, personal, and manuscript data collected across <strong>MANI Research Organization (MRO)</strong>, an academic scholarly publishing division of <strong>MANI Market Private Limited</strong>.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500 font-mono">
            <span>Last Updated: October 2026</span>
            <span>&bull;</span>
            <span>Framework: DPDP Act 2023 &amp; COPE</span>
            <span>&bull;</span>
            <span>CIN: U58130AP2026PTC127065</span>
          </div>
        </section>

        {/* Corporate Identity & Legal Entity Notice */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0b1b3d] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-sky-700" />
              <span>1. Corporate Fiduciary &amp; Data Controller</span>
            </h2>
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded border border-slate-200">
              Statutory Fiduciary
            </span>
          </div>

          <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
            <p>
              The data fiduciary responsible for data collected on this platform is:
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <p className="font-bold text-slate-900 text-sm">
                MANI Market Private Limited (Parent Entity)
              </p>
              <p className="font-serif text-slate-700">
                Operating Division: MANI Research Organization (MRO)<br />
                Founder: Nangireddy Manikanta<br />
                Registered Office: Kuntinavalasa Village, Mentada Mandal, Vizianagaram District, Andhra Pradesh - 535580, India.
              </p>
              <div className="pt-1 font-mono text-[11px] text-slate-600 flex flex-wrap gap-4">
                <span>CIN: <strong className="text-slate-900">U58130AP2026PTC127065</strong></span>
                <span>GSTIN: <strong className="text-slate-900">37AAVCM2351A1ZI</strong></span>
              </div>
            </div>
            <p>
              We operate in full compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act, India), the Information Technology Act, 2000 (and associated Reasonable Security Practices rules), and global academic privacy norms including the EU General Data Protection Regulation (GDPR) for international scientific contributors.
            </p>
          </div>
        </section>

        {/* Double-Blind Peer Review Confidentiality */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-bold text-[#0b1b3d] flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-emerald-600" />
              <span>2. Strict Confidentiality in Double-Blind Peer Review</span>
            </h2>
          </div>

          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <p>
              Under COPE guidelines and MRO editorial protocols, unpublished manuscripts are legally treated as confidential privileged communications:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-900 block text-xs">Reviewer Anonymity</span>
                <p className="text-slate-600 text-[11px]">
                  Referees evaluate manuscripts under double-blind isolation. Reviewer identities are never disclosed to authors, public directories, or third parties.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-900 block text-xs">Unpublished Manuscripts</span>
                <p className="text-slate-600 text-[11px]">
                  Drafts, figures, raw data, and rebuttal letters remain isolated behind PostgreSQL Row-Level Security (RLS) and are never exposed publicly or indexed prior to formal acceptance.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-900 block text-xs">Confidential Editor Notes</span>
                <p className="text-slate-600 text-[11px]">
                  Remarks directed strictly to the Editorial Board remain sealed from author view to ensure uninhibited, objective critical appraisal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Collected & Purpose */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-bold text-[#0b1b3d] flex items-center gap-2">
              <Database className="w-5 h-5 text-sky-700" />
              <span>3. Information We Collect and Grounds for Processing</span>
            </h2>
          </div>

          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <p>
              MRO collects only the minimum necessary information required to coordinate scholarly peer review and index permanent academic records:
            </p>
            <div className="space-y-2.5">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                <UserCheck className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Author &amp; Reviewer Credentials:</strong> Full name, institutional affiliation, department, academic email, ORCID identifier, and biographical research interests.
                </div>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                <FileText className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Manuscript Metadata:</strong> Scientific title, structured abstract, keywords, research category, co-author affiliations, conflict-of-interest declarations, and institutional ethics approvals.
                </div>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                <Lock className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Authentication &amp; Security Logs:</strong> Supabase Auth session tokens, encrypted passwords, IP telemetry, and access logs required for audit trails and cybersecurity defense.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rights & Grievance Redressal */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0b1b3d] flex items-center gap-2">
              <Scale className="w-5 h-5 text-sky-700" />
              <span>4. Rights of Data Principals &amp; Grievance Redressal</span>
            </h2>
            <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
              DPDP Act Compliant
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <p>
              Under applicable statutory regulations, authors, reviewers, and readers retain the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Request summary confirmation of personal data held by MRO.</li>
              <li>Request correction, updating, or completion of inaccurate profile metadata.</li>
              <li>Request erasure of personal data, subject to immutable archival retention requirements mandated for published scientific papers with Crossref DOIs.</li>
              <li>Withdraw consent for optional community participation or newsletter notifications.</li>
            </ul>

            <div className="p-4 bg-sky-50 border border-sky-100 rounded-xl space-y-2 mt-4">
              <span className="font-bold text-[#0b1b3d] text-xs flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-sky-700" />
                <span>Statutory Grievance Redressal Officer</span>
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                For queries, data correction requests, or formal grievances regarding privacy practices under the DPDP Act 2023, address your communication to:
              </p>
              <div className="text-[11px] font-mono text-slate-800 space-y-0.5">
                <p>Attention: Data Protection &amp; Grievance Officer</p>
                <p>MANI Market Private Limited (MRO Division)</p>
                <p>Email: <a href="mailto:privacy@maniresearch.org" className="text-sky-700 hover:underline">privacy@maniresearch.org</a> / <a href="mailto:support@maniresearch.org" className="text-sky-700 hover:underline">support@maniresearch.org</a></p>
                <p>Postal: Kuntinavalasa Village, Mentada Mandal, Vizianagaram District, Andhra Pradesh - 535580, India</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <InstitutionalFooter />
    </div>
  );
}
