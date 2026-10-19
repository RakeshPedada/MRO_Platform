import InstitutionalHeader from '@/components/layout/InstitutionalHeader';
import InstitutionalFooter from '@/components/layout/InstitutionalFooter';
import Link from 'next/link';
import {
  Building2,
  ShieldCheck,
  Globe2,
  BookOpen,
  Award,
  Layers,
  CheckCircle2,
  LockOpen,
  Users,
  Compass,
  ArrowRight,
} from 'lucide-react';

export const metadata = {
  title: 'About Us | MANI Research Organization (MRO)',
  description:
    'About MANI Research Organization (MRO) - an open-access multidisciplinary scholarly publishing initiative of MANI Market Private Limited.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <InstitutionalHeader />

      <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12 flex-1 w-full">
        {/* Hero Banner */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-md border border-blue-100">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Institutional Profile</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b1b3d] tracking-tight leading-tight">
            About MANI Research Organization (MRO)
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
            <strong>MANI Research Organization (MRO)</strong> — formally known as the <em>Multidisciplinary Advanced Network for Innovation and Research Organization</em> — is an academic open-access publishing platform dedicated to the rapid, rigorous, and barrier-free dissemination of scientific, engineering, and technological knowledge worldwide.
          </p>
        </section>

        {/* Corporate Identity & Legal Registration */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0b1b3d] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-700" />
              <span>Corporate Governance &amp; Legal Establishment</span>
            </h2>
            <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded border border-emerald-200">
              Active Entity
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 leading-relaxed">
            <div className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Parent Enterprise</h3>
              <p>
                MANI Research Organization operates as the academic scholarly publishing division of{' '}
                <strong className="text-slate-950">MANI Market Private Limited</strong>, an incorporated enterprise under the Ministry of Corporate Affairs, Government of India.
              </p>
              <div className="space-y-1 font-mono text-[11px] pt-1">
                <p>
                  <strong>Corporate Identity Number (CIN):</strong>{' '}
                  <span className="text-sky-800 font-bold">U58130AP2026PTC127065</span>
                </p>
                <p>
                  <strong>Goods and Services Tax (GSTIN):</strong>{' '}
                  <span className="text-sky-800 font-bold">37AAVCM2351A1ZI</span>
                </p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Founder &amp; Registered Office</h3>
              <p>
                Founded by <strong className="text-slate-950">Nangireddy Manikanta</strong> with a vision to democratize scholarly access across multidisciplinary engineering disciplines.
              </p>
              <div className="text-[11px] pt-1">
                <span className="font-bold text-slate-900 block">Registered Corporate Address:</span>
                <p className="text-slate-600 font-serif">
                  Kuntinavalasa Village, Mentada Mandal,<br />
                  Vizianagaram District, Andhra Pradesh - 535580, India.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision & Core Values */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-[#0b1b3d] flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-sky-700" />
            <span>Mission &amp; Publishing Philosophy</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <LockOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Universal Open Access</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Knowledge belongs to humanity. All articles published under MRO are immediately free to read, download, redistribute, and cite under the Creative Commons Attribution 4.0 International (CC BY 4.0) License without paywalls.
              </p>
            </div>

            <div className="p-5 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Rigorous Double-Blind Review</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every manuscript undergoes thorough double-blind peer review by international domain experts, ensuring unbiased, constructive, and uncompromising academic standards.
              </p>
            </div>

            <div className="p-5 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Archival Permanence &amp; DOIs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every accepted article receives a permanent, persistent Digital Object Identifier (DOI) and structured bibliographic metadata (Volume, Issue, Pagination) for Crossref and indexers.
              </p>
            </div>
          </div>
        </section>

        {/* 17 Multidisciplinary Areas */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0b1b3d] flex items-center gap-2">
              <Compass className="w-5 h-5 text-sky-700" />
              <span>17 Multidisciplinary Subject Classifications</span>
            </h2>
            <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
              Comprehensive Scope
            </span>
          </div>

          <p className="text-xs text-slate-600">
            MRO welcomes original research, clinical evaluations, and technical communications across our 17 core academic subject areas:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs text-slate-700">
            {[
              'Computer Science & Artificial Intelligence',
              'Electrical & Electronics Engineering',
              'Mechanical & Mechatronics Engineering',
              'Civil & Structural Infrastructure',
              'Robotics & Autonomous Systems',
              'Energy Systems & Renewable Technologies',
              'Chemical Engineering & Applied Chemistry',
              'Materials Science & Nanotechnology',
              'Biomedical Engineering & Health Informatics',
              'Data Science & Applied Mathematics',
              'Environmental Sciences & Sustainability',
              'Aerospace & Aviation Engineering',
              'Physics & Quantum Computing',
              'Telecommunications & Sensor Networks',
              'Industrial & Manufacturing Systems',
              'Mining, Geology & Earth Sciences',
              'Information Security & Cryptography',
            ].map((subject, index) => (
              <div
                key={index}
                className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2"
              >
                <span className="text-sky-600 font-mono font-bold text-[11px]">{index + 1}.</span>
                <span className="font-medium text-slate-800">{subject}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Editorial Independence & COPE Declaration */}
        <section className="bg-gradient-to-br from-[#0b1b3d] to-slate-900 text-white rounded-2xl p-8 sm:p-10 shadow-md space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider rounded-md border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ethical Standards &amp; Independence</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Editorial Independence Guarantee</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            MANI Market Private Limited maintains strict structural separation between commercial operations and editorial decisions. The Editor-in-Chief, Section Editors, and peer reviewers hold complete, uncompromised autonomy over manuscript acceptances, revisions, and rejections based strictly on scientific merit and COPE ethical guidelines.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
            <Link
              href="/ethics"
              className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 underline"
            >
              <span>Read Publication Ethics Statement</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/guidelines"
              className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 underline"
            >
              <span>View Author Guidelines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </main>

      <InstitutionalFooter />
    </div>
  );
}
