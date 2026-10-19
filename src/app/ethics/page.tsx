import InstitutionalHeader from '@/components/layout/InstitutionalHeader';
import InstitutionalFooter from '@/components/layout/InstitutionalFooter';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Link from 'next/link';
import {
  ShieldCheck,
  Scale,
  FileWarning,
  Users,
  EyeOff,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Lock,
  Building2,
  BookOpen,
} from 'lucide-react';

export const metadata = {
  title: 'Publication Ethics & Malpractice Policies | MANI Research Organization (MRO)',
  description:
    'COPE-compliant publishing ethics, peer-review integrity, plagiarism prevention, authorship standards, and scientific misconduct procedures at MRO.',
};

export default function PublicationEthicsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <InstitutionalHeader />

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 flex-1 w-full">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={[{ label: 'Publication Ethics' }]} />

        {/* Header Banner */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider rounded-md border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>COPE Compliance Statement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b1b3d] tracking-tight leading-tight">
            Publication Ethics &amp; Publication Malpractice Statement
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
            MANI Research Organization (MRO) is committed to upholding the highest standards of scientific integrity, transparency, and ethical publishing. Our policies adhere strictly to the guidelines and Code of Conduct established by the <strong>Committee on Publication Ethics (COPE)</strong> and the <strong>International Committee of Medical Journal Editors (ICMJE)</strong>.
          </p>
        </section>

        {/* 1. Duties of Editors & Editorial Independence */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-4 text-xs text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-[#0b1b3d] flex items-center gap-2 border-b border-slate-100 pb-3">
            <Scale className="w-5 h-5 text-sky-700" />
            <span>1. Duties &amp; Independence of Editors</span>
          </h2>

          <div className="space-y-3">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm">Editorial Impartiality &amp; Fair Play</h3>
              <p>
                Editors evaluate manuscripts solely on intellectual and scientific merit (significance, originality, methodological validity, and clarity), completely without regard to race, gender, sexual orientation, religious belief, ethnic origin, citizenship, or political philosophy of the authors.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm">Confidentiality</h3>
              <p>
                The Editor-in-Chief, Section Editors, and editorial staff must not disclose any information concerning a submitted manuscript to anyone other than the corresponding author, assigned peer reviewers, and potential reviewers. Unpublished materials disclosed in a submission must not be used in an editor&apos;s own research without express written consent.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Peer Reviewer Responsibilities & Integrity */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-4 text-xs text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-[#0b1b3d] flex items-center gap-2 border-b border-slate-100 pb-3">
            <EyeOff className="w-5 h-5 text-sky-700" />
            <span>2. Double-Blind Peer Reviewer Obligations</span>
          </h2>

          <ul className="space-y-3">
            <li className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <strong className="text-slate-900 block mb-0.5">Contribution to Editorial Decisions:</strong>
              Peer review assists the editor in making editorial decisions and, through editorial communications with the author, may assist the author in improving the paper.
            </li>
            <li className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <strong className="text-slate-900 block mb-0.5">Promptness &amp; Recusal:</strong>
              Any selected referee who feels unqualified to evaluate the research reported in a manuscript or knows that its prompt review will be impossible should notify the editor and decline the invitation.
            </li>
            <li className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <strong className="text-slate-900 block mb-0.5">Standards of Objectivity:</strong>
              Reviews must be conducted objectively. Personal criticism of the author is inappropriate. Referees should express their views clearly with supporting scientific arguments.
            </li>
            <li className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <strong className="text-slate-900 block mb-0.5">Acknowledgment of Sources &amp; Redundancy:</strong>
              Reviewers should identify relevant published work that has not been cited by the authors and bring to the editor&apos;s attention any substantial similarity or overlap.
            </li>
          </ul>
        </section>

        {/* 3. Plagiarism, Data Fabrication & Image Manipulation */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-4 text-xs text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-[#0b1b3d] flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileWarning className="w-5 h-5 text-rose-600" />
            <span>3. Zero-Tolerance Policy: Plagiarism &amp; Fabrication</span>
          </h2>

          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-rose-950">
            <p className="font-bold text-sm text-rose-900">
              Plagiarism in all its forms constitutes severe academic malpractice.
            </p>
            <p className="leading-relaxed">
              MRO performs automated similarity screening on all submissions. Manuscripts exhibiting unauthorized reproduction of text, ideas, or data without proper attribution, or showing evidence of data falsification, image tampering, or AI-generated hallucinated literature will be immediately rejected with notifications sent to author institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900 block mb-1">Permissible Similarity Threshold:</strong>
              Total similarity must be &lt;15%, with no single source exceeding 2% (excluding common technical names, author affiliations, and standard bibliographies).
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900 block mb-1">Image Manipulation:</strong>
              Adjusting brightness or contrast is acceptable only if applied uniformly across the entire image and does not obscure or misrepresent information.
            </div>
          </div>
        </section>

        {/* 4. Authorship & Contributorship Criteria */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-4 text-xs text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-[#0b1b3d] flex items-center gap-2 border-b border-slate-100 pb-3">
            <Users className="w-5 h-5 text-sky-700" />
            <span>4. Authorship Criteria (ICMJE Standards)</span>
          </h2>

          <p>
            Authorship should be restricted to those who have made a substantial contribution to the conception, design, execution, or interpretation of the reported study. MRO strictly enforces the four ICMJE criteria:
          </p>

          <ol className="list-decimal list-inside space-y-1.5 p-4 bg-slate-50 rounded-xl border border-slate-100 font-medium text-slate-800">
            <li>Substantial contributions to the conception or design of the work; or the acquisition, analysis, or interpretation of data for the work; AND</li>
            <li>Drafting the work or revising it critically for important intellectual content; AND</li>
            <li>Final approval of the version to be published; AND</li>
            <li>Agreement to be accountable for all aspects of the work in ensuring that questions related to the accuracy or integrity of any part of the work are appropriately investigated and resolved.</li>
          </ol>

          <p className="text-amber-800 bg-amber-50 p-3 rounded-lg border border-amber-200 text-[11px]">
            <strong>Prohibition of Ghost/Gift Authorship:</strong> Individuals who do not meet all four criteria (such as general supervisory heads or purely financial sponsors) must be acknowledged in the Acknowledgments section rather than listed as co-authors.
          </p>
        </section>

        {/* 5. Corrections, Expressions of Concern, and Retractions */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-4 text-xs text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-[#0b1b3d] flex items-center gap-2 border-b border-slate-100 pb-3">
            <RotateCcw className="w-5 h-5 text-sky-700" />
            <span>5. Corrections, Expressions of Concern &amp; Retractions</span>
          </h2>

          <p>
            When errors, scientific misconduct, or data disputes arise regarding published papers, MRO follows the standardized COPE retraction guidelines:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <strong className="text-slate-900 block text-sm">Corrigenda / Addenda</strong>
              <p className="text-[11px] text-slate-600">
                Published when a minor unintentional error is identified (e.g., spelling in author names, typographic errors in equations) that does not alter the fundamental conclusions.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <strong className="text-slate-900 block text-sm">Expressions of Concern</strong>
              <p className="text-[11px] text-slate-600">
                Issued by the Editor-in-Chief if an investigation into potential research misconduct is ongoing or inconclusive, alerting readers to potential caveats.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <strong className="text-slate-900 block text-sm">Formal Retraction</strong>
              <p className="text-[11px] text-slate-600">
                Enacted if findings are verified to be unreliable due to misconduct or honest error, or if plagiarism/duplicate publication is proven. The PDF is watermarked &quot;RETRACTED&quot; and remains accessible for archival transparency.
              </p>
            </div>
          </div>
        </section>
      </main>

      <InstitutionalFooter />
    </div>
  );
}
