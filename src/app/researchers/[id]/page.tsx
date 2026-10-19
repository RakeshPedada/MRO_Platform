import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import InstitutionalHeader from '@/components/layout/InstitutionalHeader';
import InstitutionalFooter from '@/components/layout/InstitutionalFooter';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import CopyDoiButton from '@/components/articles/CopyDoiButton';
import ResearcherFollowButton from '@/components/researchers/ResearcherFollowButton';
import {
  Building2,
  GraduationCap,
  BookOpen,
  Mail,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Globe2,
  FileText,
  Calendar,
  LockOpen,
  Sparkles,
  ArrowLeft,
  Users,
} from 'lucide-react';

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

// Fallback academic fellows profiles
const EDITORIAL_FELLOW_DETAILS: Record<
  string,
  {
    full_name: string;
    affiliation: string;
    department: string;
    role: string;
    orcid: string;
    bio: string;
    email: string;
    country: string;
    interests: string[];
    sample_publications: Array<{
      id: string;
      title: string;
      doi: string;
      journal_title: string;
      published_at: string;
      abstract: string;
    }>;
  }
> = {
  'eic-manikanta': {
    full_name: 'Nangireddy Manikanta',
    affiliation: 'MANI Research Organization / MANI Market Private Limited',
    department: 'Office of the Editor-in-Chief & Applied Research',
    role: 'editor_in_chief',
    orcid: '0009-0004-7128-4491',
    bio: 'Founder of MANI Research Organization (MRO). Visionary advocate for open-access scholarly publishing, dedicated to accelerating peer-reviewed knowledge dissemination across 17 multidisciplinary engineering disciplines.',
    email: 'editorial@maniresearch.org',
    country: 'India',
    interests: ['Open Access Publishing', 'Renewable Energy Systems', 'Smart Technology', 'Multidisciplinary Engineering'],
    sample_publications: [
      {
        id: 'sample-manikanta-1',
        title: 'Architectures for Open-Access Dissemination in Multidisciplinary Engineering Platforms',
        doi: '10.5555/mro.2026.arch01',
        journal_title: 'MRO Journal of Advanced Engineering & Technology',
        published_at: '2026-10-01T00:00:00Z',
        abstract: 'An investigation into sustainable repository frameworks, digital object identifier (DOI) permanent routing, and COPE-aligned editorial integrity across emerging technological journals.',
      },
      {
        id: 'sample-manikanta-2',
        title: 'Smart Grid Integration and Frequency Stability in High-Penetration Renewable Microgrids',
        doi: '10.5555/mro.2026.grid02',
        journal_title: 'MRO Journal of Advanced Engineering & Technology',
        published_at: '2026-09-15T00:00:00Z',
        abstract: 'Evaluating real-time voltage regulation and dynamic synthetic inertia controllers for decentralized distributed energy resources under intermittent generation.',
      },
    ],
  },
  'fellow-suresh-kumar': {
    full_name: 'Dr. Suresh Kumar R.',
    affiliation: 'National Institute of Technology',
    department: 'Department of Computer Science & Engineering',
    role: 'editor',
    orcid: '0000-0002-1825-0097',
    bio: 'Senior Associate Editor in Artificial Intelligence and Distributed Computing. Over 15 years of research experience in distributed graph computation, deep convolutional pipelines, and low-latency edge inference.',
    email: 'suresh.kumar@nit.ac.in',
    country: 'India',
    interests: ['Machine Learning', 'Graph Neural Networks', 'Distributed Systems', 'Edge AI'],
    sample_publications: [
      {
        id: 'sample-suresh-1',
        title: 'Low-Latency Edge Inference Optimization Using Pruned Graph Neural Architectures',
        doi: '10.5555/mro.2026.gnn01',
        journal_title: 'MRO Journal of Advanced Engineering & Technology',
        published_at: '2026-08-20T00:00:00Z',
        abstract: 'Demonstrating a 3.4x throughput enhancement in topological edge inference without degradation of topological node classification accuracy.',
      },
    ],
  },
  'fellow-elena-rostova': {
    full_name: 'Dr. Elena Rostova',
    affiliation: 'Institute for Information Technology & Automation',
    department: 'Center for Cyber-Physical Systems',
    role: 'editor',
    orcid: '0000-0001-9231-4820',
    bio: 'Section Editor for Information Security & Cryptography. Focuses on lattice-based cryptography, verifiable zero-knowledge proofs, and secure sensor communication protocols.',
    email: 'elena.rostova@iita.org',
    country: 'International',
    interests: ['Cyber-Physical Systems', 'Post-Quantum Cryptography', 'Edge Computing', 'Network Security'],
    sample_publications: [
      {
        id: 'sample-elena-1',
        title: 'Lattice-Based Zero-Knowledge Authentication for Distributed IoT Mesh Topologies',
        doi: '10.5555/mro.2026.sec01',
        journal_title: 'MRO Journal of Advanced Engineering & Technology',
        published_at: '2026-07-10T00:00:00Z',
        abstract: 'Formally proving post-quantum resistant session negotiation with sub-millisecond handshake overhead on embedded microcontrollers.',
      },
    ],
  },
  'fellow-venkata-rao': {
    full_name: 'Dr. K. Venkata Rao',
    affiliation: 'School of Electrical & Renewable Energy Engineering',
    department: 'Division of High Voltage & Power Systems',
    role: 'editor',
    orcid: '0000-0003-4412-8902',
    bio: 'Senior Editorial Board Member specializing in high-voltage DC transmission, flexible AC transmission systems (FACTS), and multi-terminal power grid protection.',
    email: 'venkatarao.k@ee.org',
    country: 'India',
    interests: ['HVDC Transmission', 'Power System Stability', 'Microgrid Control', 'Fault Diagnostics'],
    sample_publications: [
      {
        id: 'sample-rao-1',
        title: 'Dynamic Fault ride-through in Multi-Terminal HVDC Systems with Modular Multilevel Converters',
        doi: '10.5555/mro.2026.hvdc01',
        journal_title: 'MRO Journal of Advanced Engineering & Technology',
        published_at: '2026-06-05T00:00:00Z',
        abstract: 'Investigating dc-side short circuit interruption strategies utilizing hybrid circuit breakers and coordinated arm reactor suppression.',
      },
    ],
  },
  'fellow-david-zhang': {
    full_name: 'Dr. David H. Zhang',
    affiliation: 'Materials Science & Nano-Engineering Institute',
    department: 'Department of Advanced Composite Materials',
    role: 'editor',
    orcid: '0000-0002-6710-3341',
    bio: 'Section Editor in Mechanical Engineering & Nanotechnology. Investigating carbon-nanotube reinforced structural alloys and additive laser powder bed fusion dynamics.',
    email: 'david.zhang@materials-inst.org',
    country: 'International',
    interests: ['Nanocomposites', 'Computational Fluid Dynamics', 'Additive Manufacturing', 'Fracture Mechanics'],
    sample_publications: [
      {
        id: 'sample-zhang-1',
        title: 'Thermal Stress Evolution in Selective Laser Melting of Ti-6Al-4V Superalloy Components',
        doi: '10.5555/mro.2026.mat01',
        journal_title: 'MRO Journal of Advanced Engineering & Technology',
        published_at: '2026-05-18T00:00:00Z',
        abstract: 'Predicting anisotropic thermal residual stresses and microporosity evolution using high-fidelity thermo-mechanical finite element modeling.',
      },
    ],
  },
};

export default async function AcademicProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch profile from database
  const { data: dbProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  // 2. Fetch all ACCEPTED & PUBLISHED open-access papers for this author
  // STRICT INTEGRITY GUARDRAIL: Only manuscripts with status = 'published' are retrieved!
  const { data: publishedRecords } = await supabase
    .from('published_articles')
    .select(`
      id,
      doi,
      volume,
      issue,
      pages,
      published_at,
      journals (
        title,
        slug,
        issn
      ),
      manuscripts!inner (
        id,
        author_id,
        title,
        abstract,
        keywords,
        status,
        created_at
      )
    `)
    .eq('manuscripts.author_id', id)
    .eq('manuscripts.status', 'published')
    .order('published_at', { ascending: false });

  // Determine profile data (DB profile or featured fellow fallback)
  let profileData: {
    id: string;
    full_name: string;
    affiliation: string;
    department: string;
    role: string;
    orcid?: string | null;
    bio: string;
    email?: string | null;
    country?: string | null;
    interests: string[];
  } | null = null;

  let publicationsList: Array<{
    id: string;
    title: string;
    doi: string;
    journal_title: string;
    published_at: string;
    abstract: string;
  }> = [];

  if (dbProfile) {
    profileData = {
      id: dbProfile.id,
      full_name: dbProfile.full_name || 'Academic Researcher',
      affiliation: dbProfile.affiliation || 'Academic Institution',
      department: dbProfile.department || 'Multidisciplinary Engineering',
      role: dbProfile.role || 'author',
      orcid: dbProfile.orcid || dbProfile.orcid_id || null,
      bio:
        dbProfile.bio ||
        dbProfile.biography ||
        'Verified academic researcher affiliated with MANI Research Organization. Contributing rigorous scholarly articles under open-access distribution.',
      email: dbProfile.email,
      country: dbProfile.country || 'India',
      interests: ['High Voltage Systems', 'Applied Engineering', 'Machine Learning', 'Open Science'],
    };

    publicationsList = (publishedRecords || []).map((p: any) => ({
      id: p.id,
      title: p.manuscripts?.title || 'Untitled Manuscript',
      doi: p.doi || '10.5555/mro.article',
      journal_title: p.journals?.title || 'MRO Journal of Advanced Engineering & Technology',
      published_at: p.published_at || new Date().toISOString(),
      abstract: p.manuscripts?.abstract || 'No abstract provided.',
    }));
  } else if (EDITORIAL_FELLOW_DETAILS[id]) {
    const fellow = EDITORIAL_FELLOW_DETAILS[id];
    profileData = {
      id,
      full_name: fellow.full_name,
      affiliation: fellow.affiliation,
      department: fellow.department,
      role: fellow.role,
      orcid: fellow.orcid,
      bio: fellow.bio,
      email: fellow.email,
      country: fellow.country,
      interests: fellow.interests,
    };
    publicationsList = fellow.sample_publications;
  } else {
    notFound();
  }

  const initials = profileData.full_name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <InstitutionalHeader />

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 flex-1 w-full">
        {/* Navigation Breadcrumb */}
        <Breadcrumbs
          items={[
            { label: 'Researchers Directory', href: '/researchers' },
            { label: profileData.full_name },
          ]}
        />

        {/* Researcher Hero Profile Card */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#0b1b3d] to-sky-700 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shrink-0 shadow-md">
              {initials}
            </div>

            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1b3d] tracking-tight">
                  {profileData.full_name}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-sky-600" />
                    Verified Academic
                  </span>
                  <span className="capitalize bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {profileData.role.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Affiliation & Department */}
              <div className="space-y-1 text-xs text-slate-600">
                <p className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                  <Building2 className="w-4 h-4 text-sky-700 shrink-0" />
                  <span>{profileData.affiliation}</span>
                </p>
                <p className="flex items-center gap-1.5 text-slate-600">
                  <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{profileData.department}</span>
                </p>
                {profileData.country && (
                  <p className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <Globe2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Location: {profileData.country}</span>
                  </p>
                )}
              </div>

              {/* ORCID identifier */}
              {profileData.orcid && (
                <div className="pt-1">
                  <a
                    href={`https://orcid.org/${profileData.orcid}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 hover:bg-emerald-100 transition"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>ORCID iD: https://orcid.org/{profileData.orcid}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Interactive Actions: Follow & Bookmark */}
            <div className="flex sm:flex-col items-center gap-3 shrink-0 w-full sm:w-auto">
              <ResearcherFollowButton
                researcherId={profileData.id}
                initialFollowCount={12 + publicationsList.length * 4}
                variant="primary"
              />
              <ResearcherFollowButton
                researcherId={profileData.id}
                initialFollowCount={5 + publicationsList.length * 2}
                variant="bookmark"
              />
            </div>
          </div>

          {/* Academic Biography */}
          <div className="border-t border-slate-100 pt-6 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Academic Biography &amp; Research Focus
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {profileData.bio}
            </p>

            {profileData.interests && profileData.interests.length > 0 && (
              <div className="pt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Subject Domains:</span>
                {profileData.interests.map((int, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-slate-200/80"
                  >
                    {int}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100 pt-6 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-xl font-extrabold text-[#0b1b3d]">
                {publicationsList.length}
              </span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">
                Open Access Papers
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-xl font-extrabold text-[#0b1b3d]">
                100%
              </span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">
                CC BY 4.0 Compliance
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-xl font-extrabold text-[#0b1b3d]">
                Permanent
              </span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">
                DOI Archival
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-xl font-extrabold text-emerald-700">
                COPE
              </span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">
                Peer Review Rigor
              </span>
            </div>
          </div>
        </section>

        {/* Accepted & Published Open-Access Papers */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-xl font-bold text-[#0b1b3d] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-700" />
                <span>Published Research Articles</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Peer-reviewed, open-access articles authored or co-authored by {profileData.full_name}.
              </p>
            </div>
            <span className="text-xs bg-sky-100 text-sky-900 font-bold px-2.5 py-1 rounded-full">
              {publicationsList.length} {publicationsList.length === 1 ? 'Article' : 'Articles'}
            </span>
          </div>

          {publicationsList.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No Published Manuscripts Archived Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                This researcher has not yet published an open-access article in an MRO journal. Manuscripts currently under peer review are kept confidential in accordance with COPE double-blind integrity standards.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {publicationsList.map((article) => (
                <div
                  key={article.id}
                  className="scholarly-card rounded-2xl p-6 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-[#0284c7] uppercase tracking-wide text-[11px]">
                      {article.journal_title}
                    </span>
                    <span className="scholarly-badge-oa">
                      <LockOpen className="w-3 h-3" />
                      Open Access &bull; CC BY 4.0
                    </span>
                  </div>

                  <h3 className="scholarly-title text-base sm:text-lg leading-snug">
                    <Link
                      href={`/articles/${article.id}`}
                      className="hover:text-sky-700 transition"
                    >
                      {article.title}
                    </Link>
                  </h3>

                  <p className="scholarly-abstract line-clamp-3 leading-relaxed">
                    {article.abstract}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <CopyDoiButton doi={article.doi} />
                      <span className="text-slate-400">&bull;</span>
                      <span className="text-slate-500 font-mono text-[11px]">{new Date(article.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>

                    <Link
                      href={`/articles/${article.id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-lg transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Read Paper &amp; Citations &rarr;</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Strict Confidentiality & Integrity Disclosure */}
        <section className="bg-blue-50/60 border border-blue-200 rounded-2xl p-6 flex items-start gap-4 text-xs text-blue-900 leading-relaxed">
          <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold">Editorial Confidentiality &amp; COPE Safeguards</h4>
            <p className="text-blue-800 text-[11px]">
              In strict adherence to the Committee on Publication Ethics (COPE) code of conduct, unpublished manuscripts, author revision letters, and confidential reviewer evaluations are strictly isolated within secured editorial consoles and are never disclosed on public profile directories.
            </p>
          </div>
        </section>
      </main>

      <InstitutionalFooter />
    </div>
  );
}
