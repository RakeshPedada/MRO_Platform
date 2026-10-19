import InstitutionalHeader from '@/components/layout/InstitutionalHeader';
import InstitutionalFooter from '@/components/layout/InstitutionalFooter';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  Award,
  BookOpen,
  Mail,
  ShieldCheck,
  Send,
  Building2,
  Globe2,
} from 'lucide-react';

export const metadata = {
  title: 'Editorial Board & Advisory Council | MANI Research Organization (MRO)',
  description:
    'Institutional directory of the Editor-in-Chief, Section Editors, and Academic Advisory Council for MANI Research Organization journals.',
};

export default function EditorialBoardPage() {
  const editorialSections = [
    {
      domain: 'Computer Science, Artificial Intelligence & Data Systems',
      description: 'Covering deep learning, computer vision, natural language processing, cloud architectures, and algorithmic theory.',
      editors: [
        {
          name: 'Dr. Suresh Kumar R.',
          title: 'Associate Editor',
          affiliation: 'Department of Computer Science & Engineering, National Institute of Technology',
          interests: 'Machine Learning, Distributed Systems, Graph Neural Networks',
        },
        {
          name: 'Dr. Elena Rostova',
          title: 'Section Editor',
          affiliation: 'Institute for Information Technology & Automation',
          interests: 'Cyber-Physical Systems, Edge Computing, Cryptography',
        },
      ],
    },
    {
      domain: 'Electrical, Electronics & Power Engineering',
      description: 'Focusing on smart grid operations, high-voltage transmission, renewable integration, and power electronics.',
      editors: [
        {
          name: 'Dr. K. Venkata Rao',
          title: 'Senior Associate Editor',
          affiliation: 'School of Electrical & Renewable Energy Engineering',
          interests: 'HVDC Transmission, Microgrid Control, Power Quality Analysis',
        },
        {
          name: 'Dr. Marcus Vance',
          title: 'Section Editor',
          affiliation: 'Centre for Advanced Power Technologies',
          interests: 'Wide-Bandgap Semiconductors, Photovoltaic Inverters',
        },
      ],
    },
    {
      domain: 'Robotics, Mechatronics & Autonomous Navigation',
      description: 'Research in unmanned aerial systems, humanoid robotics, SLAM algorithms, and precision industrial automation.',
      editors: [
        {
          name: 'Dr. Aris Thorne',
          title: 'Associate Editor',
          affiliation: 'Robotics Research Laboratory',
          interests: 'Autonomous Mobile Robots, Lidar SLAM, Reinforcement Learning',
        },
        {
          name: 'Dr. Priya Narayanan',
          title: 'Section Editor',
          affiliation: 'Department of Mechatronics & Automation Engineering',
          interests: 'Sensor Fusion, Kinematics, Soft Robotics',
        },
      ],
    },
    {
      domain: 'Mechanical, Materials & Sustainable Infrastructure',
      description: 'Advancing composite materials, fracture mechanics, additive manufacturing, and resilient civil structures.',
      editors: [
        {
          name: 'Dr. David H. Zhang',
          title: 'Associate Editor',
          affiliation: 'Materials Science & Nano-Engineering Institute',
          interests: 'Nanocomposites, Computational Fluid Dynamics (CFD), Additive Manufacturing',
        },
        {
          name: 'Dr. Anita Deshmukh',
          title: 'Section Editor',
          affiliation: 'Faculty of Civil & Environmental Engineering',
          interests: 'Structural Health Monitoring, Green Concrete Formulations',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <InstitutionalHeader />

      <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12 flex-1 w-full">
        {/* Banner */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-md border border-blue-100">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Academic Leadership</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b1b3d] tracking-tight leading-tight">
            Editorial Board &amp; Scientific Advisory Council
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
            The editorial leadership of MANI Research Organization (MRO) comprises esteemed scholars, domain specialists, and dedicated peer-reviewers committed to objective peer-review and academic rigor.
          </p>
        </section>

        {/* Editor-in-Chief Feature Card */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0b1b3d] uppercase tracking-wider text-xs flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Editor-in-Chief</span>
            </h2>
            <span className="text-xs bg-amber-50 text-amber-800 font-bold px-2.5 py-0.5 rounded border border-amber-200">
              Founding Leadership
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#0b1b3d] text-white flex items-center justify-center font-extrabold text-2xl sm:text-3xl shrink-0 shadow-md">
              NM
            </div>

            <div className="space-y-3 flex-1">
              <div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight">
                  Prof. / Dr. Nangireddy Manikanta
                </h3>
                <p className="text-xs font-semibold text-sky-700">
                  Founder &amp; Editor-in-Chief, MANI Research Organization (MRO)
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Director, MANI Market Private Limited &bull; Andhra Pradesh, India
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-serif">
                Directing the scholarly policy, open-access protocols, and cross-disciplinary review frameworks across MRO publications. Primary research interests include robust control systems, high-voltage transmission fault analytics, embedded IoT architectures, and multidisciplinary engineering education.
              </p>

              <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">
                  Autonomous Systems
                </span>
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">
                  Electrical Infrastructure
                </span>
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">
                  Signal Processing
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section Editors Categorized by Subject Stream */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0b1b3d] flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-sky-700" />
                <span>Associate &amp; Section Editorial Boards</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Organized by primary academic disciplinary divisions
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {editorialSections.map((sec, sIdx) => (
              <div
                key={sIdx}
                className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4"
              >
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-[#0b1b3d]">{sec.domain}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{sec.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sec.editors.map((ed, eIdx) => (
                    <div
                      key={eIdx}
                      className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-xs">{ed.name}</h4>
                        <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded border border-blue-100">
                          {ed.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium">{ed.affiliation}</p>
                      <p className="text-[11px] text-slate-500 pt-0.5">
                        <strong className="text-slate-700">Specialization:</strong> {ed.interests}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Join the Editorial Board / Call for Reviewers */}
        <section className="bg-[#0b1b3d] text-white rounded-2xl p-8 sm:p-10 shadow-md space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider rounded-md border border-blue-400/30">
            <Users className="w-3.5 h-3.5" />
            <span>Call for Reviewers &amp; Editors</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Join the MRO Reviewer Board</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            We actively welcome qualified researchers, postdoctoral fellows, and professors holding PhDs to join our international peer review community. Enhance scholarly communication and contribute to objective double-blind manuscript evaluation.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold">
            <Link
              href="/register"
              className="px-5 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-xl shadow-md transition text-center"
            >
              Register as a Reviewer &rarr;
            </Link>
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition text-center"
            >
              Contact Editorial Office
            </Link>
          </div>
        </section>
      </main>

      <InstitutionalFooter />
    </div>
  );
}
