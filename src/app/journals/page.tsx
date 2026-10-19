import { createClient } from '@/lib/supabase/server';
import InstitutionalHeader from '@/components/layout/InstitutionalHeader';
import InstitutionalFooter from '@/components/layout/InstitutionalFooter';
import JournalsCatalogClient, { JournalItem } from '@/components/journals/JournalsCatalogClient';

export const revalidate = 0;

export const metadata = {
  title: 'MRO Academic Journals Catalog | MANI Research Organization',
  description:
    'Explore peer-reviewed open access journals published by MANI Research Organization (MRO). Aims and scopes, ISSN registrations, editorial boards, and published volumes across 17 multidisciplinary domains.',
};

// 17 Canonical Multidisciplinary Categories from Section 7 of Specifications
const CANONICAL_17_SUBJECTS = [
  'Aerospace and Aeronautical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical and Electronics Engineering',
  'Computer Science and Artificial Intelligence',
  'Robotics and Automation',
  'Physics and Mathematics',
  'Chemistry and Materials Science',
  'Space Science and Astronomy',
  'Biotechnology and Life Sciences',
  'Medical and Health Sciences',
  'Environmental Science',
  'Energy and Renewable Technologies',
  'Agriculture and Food Science',
  'Economics and Management',
  'Social Sciences and Humanities',
  'Interdisciplinary Research',
];

export default async function JournalsDirectoryPage() {
  const supabase = await createClient();

  // 1. Fetch active journals from database
  const { data: dbJournals } = await supabase
    .from('journals')
    .select('*')
    .order('title', { ascending: true });

  // 2. Fetch counts of published articles per journal
  const { data: pubData } = await supabase
    .from('published_articles')
    .select('journal_id');

  const pubCountMap = new Map<string, number>();
  pubData?.forEach((p) => {
    if (p.journal_id) {
      pubCountMap.set(p.journal_id, (pubCountMap.get(p.journal_id) || 0) + 1);
    }
  });

  // Canonical portfolio covering all 17 multidisciplinary engineering & scientific disciplines
  const canonicalPortfolio: JournalItem[] = [
    {
      id: '2e40b00b-46cb-4cf1-93a9-2e8cc107ebc1', // Matches primary Supabase DB ID
      title: 'MRO Journal of Advanced Engineering & Technology',
      short_code: 'MRO-JAET',
      slug: 'mro-jaet',
      issn: '3048-5231',
      aims_scope:
        'A premier peer-reviewed open-access journal covering multidisciplinary research in electrical, electronics, mechanical, computer science, robotics, and energy systems.',
      subject_area: 'Electrical and Electronics Engineering',
      launched_year: 2026,
      article_count: pubCountMap.get('2e40b00b-46cb-4cf1-93a9-2e8cc107ebc1') || 1,
      current_issue: 'Vol. 1, Issue 1 (2026)',
    },
    {
      id: 'mro-jcsai-canonical',
      title: 'MRO Journal of Computer Science & Artificial Intelligence',
      short_code: 'MRO-JCSAI',
      slug: 'mro-jcsai',
      issn: '3048-524X',
      aims_scope:
        'Publishes cutting-edge machine learning architectures, neural graph algorithms, edge AI optimization, distributed systems, and post-quantum cryptographic protocols.',
      subject_area: 'Computer Science and Artificial Intelligence',
      launched_year: 2026,
      article_count: pubCountMap.get('mro-jcsai-canonical') || 0,
      current_issue: 'Vol. 1, Issue 1 (2026)',
    },
    {
      id: 'mro-jsei-canonical',
      title: 'MRO Journal of Sustainable Energy & Renewable Technologies',
      short_code: 'MRO-JSEI',
      slug: 'mro-jsei',
      issn: '3048-5258',
      aims_scope:
        'Focuses on smart grid integration, renewable energy generation, energy storage matrices, solar photovoltaics, and zero-emission microgrid topologies.',
      subject_area: 'Energy and Renewable Technologies',
      launched_year: 2026,
      article_count: pubCountMap.get('mro-jsei-canonical') || 0,
      current_issue: 'Vol. 1, Issue 1 (2026)',
    },
    {
      id: 'mro-jras-canonical',
      title: 'MRO Journal of Robotics & Autonomous Systems',
      short_code: 'MRO-JRAS',
      slug: 'mro-jras',
      issn: '3048-5266',
      aims_scope:
        'Dedicated to autonomous robotic platforms, multi-agent cooperative control, SLAM, human-robot interaction, and soft mechatronics.',
      subject_area: 'Robotics and Automation',
      launched_year: 2026,
      article_count: 0,
      current_issue: 'Vol. 1, Issue 1 (2026)',
    },
    {
      id: 'mro-jme-canonical',
      title: 'MRO Journal of Mechanical Engineering & Mechatronics',
      short_code: 'MRO-JMEM',
      slug: 'mro-jmem',
      issn: '3048-5274',
      aims_scope:
        'Investigates advanced finite element analysis, computational fluid dynamics, thermal dissipation, additive manufacturing, and biomechanical machines.',
      subject_area: 'Mechanical Engineering',
      launched_year: 2026,
      article_count: 0,
      current_issue: 'Vol. 1, Issue 1 (2026)',
    },
    {
      id: 'mro-jaae-canonical',
      title: 'MRO Journal of Aerospace & Aeronautical Engineering',
      short_code: 'MRO-JAAE',
      slug: 'mro-jaae',
      issn: '3048-5282',
      aims_scope:
        'Covers hypersonic flight dynamics, orbital mechanics, propulsion thermo-physics, avionics fault tolerance, and uncrewed aerial systems.',
      subject_area: 'Aerospace and Aeronautical Engineering',
      launched_year: 2026,
      article_count: 0,
      current_issue: 'Vol. 1, Issue 1 (2026)',
    },
    {
      id: 'mro-jce-canonical',
      title: 'MRO Journal of Civil Engineering & Smart Infrastructure',
      short_code: 'MRO-JCESI',
      slug: 'mro-jcesi',
      issn: '3048-5290',
      aims_scope:
        'Presents research on earthquake resilient structures, green concrete materials, geotechnical modeling, smart transportation networks, and structural health monitoring.',
      subject_area: 'Civil Engineering',
      launched_year: 2026,
      article_count: 0,
      current_issue: 'Vol. 1, Issue 1 (2026)',
    },
    {
      id: 'mro-jcms-canonical',
      title: 'MRO Journal of Chemistry & Materials Science',
      short_code: 'MRO-JCMS',
      slug: 'mro-jcms',
      issn: '3048-5304',
      aims_scope:
        'Addresses nanoscale chemical synthesis, biomimetic composites, polymer membranes, catalytic electrochemistry, and functional 2D nanomaterials.',
      subject_area: 'Chemistry and Materials Science',
      launched_year: 2026,
      article_count: 0,
      current_issue: 'Vol. 1, Issue 1 (2026)',
    },
    {
      id: 'mro-jpm-canonical',
      title: 'MRO Journal of Physics & Applied Mathematics',
      short_code: 'MRO-JPAM',
      slug: 'mro-jpam',
      issn: '3048-5312',
      aims_scope:
        'Publishes original theoretical physics, condensed matter dynamics, quantum information theory, non-linear differential systems, and computational statistics.',
      subject_area: 'Physics and Mathematics',
      launched_year: 2026,
      article_count: 0,
      current_issue: 'Vol. 1, Issue 1 (2026)',
    },
    {
      id: 'mro-jssa-canonical',
      title: 'MRO Journal of Space Science & Astronomy',
      short_code: 'MRO-JSSA',
      slug: 'mro-jssa',
      issn: '3048-5320',
      aims_scope:
        'Covers planetary astronomy, cosmic radiation monitoring, deep space telemetry, exoplanet atmospheric spectroscopy, and astrophysical instrumentation.',
      subject_area: 'Space Science and Astronomy',
      launched_year: 2026,
      article_count: 0,
      current_issue: 'Vol. 1, Issue 1 (2026)',
    },
    {
      id: 'mro-jbls-canonical',
      title: 'MRO Journal of Biotechnology & Life Sciences',
      short_code: 'MRO-JBLS',
      slug: 'mro-jbls',
      issn: '3048-5339',
      aims_scope:
        'Explores genetic engineering, cellular metabolic modeling, synthetic biology, bioinformatics pipelines, and molecular biotechnology solutions.',
      subject_area: 'Biotechnology and Life Sciences',
      launched_year: 2026,
      article_count: 0,
      current_issue: 'Vol. 1, Issue 1 (2026)',
    },
    {
      id: 'mro-jmhs-canonical',
      title: 'MRO Journal of Medical & Health Sciences',
      short_code: 'MRO-JMHS',
      slug: 'mro-jmhs',
      issn: '3048-5347',
      aims_scope:
        'Disseminates clinical health discoveries, biomedical diagnostics, epidemiological modeling, digital health informatics, and evidence-based medicine.',
      subject_area: 'Medical and Health Sciences',
      launched_year: 2026,
      article_count: 0,
      current_issue: 'Vol. 1, Issue 1 (2026)',
    },
    {
      id: 'mro-jes-canonical',
      title: 'MRO Journal of Environmental Science & Climate Solutions',
      short_code: 'MRO-JESCS',
      slug: 'mro-jescs',
      issn: '3048-5355',
      aims_scope:
        'Investigates ecological modeling, atmospheric emission reduction, circular waste remediation, hydrology, and planetary conservation technologies.',
      subject_area: 'Environmental Science',
      launched_year: 2026,
      article_count: 0,
      current_issue: 'Vol. 1, Issue 1 (2026)',
    },
    {
      id: 'mro-jafs-canonical',
      title: 'MRO Journal of Agriculture & Food Science',
      short_code: 'MRO-JAFS',
      slug: 'mro-jafs',
      issn: '3048-5363',
      aims_scope:
        'Presents research on precision agriculture, crop genomics, food biochemical preservation, automated irrigation, and soil microbiology.',
      subject_area: 'Agriculture and Food Science',
      launched_year: 2026,
      article_count: 0,
      current_issue: 'Vol. 1, Issue 1 (2026)',
    },
    {
      id: 'mro-jem-canonical',
      title: 'MRO Journal of Economics & Management Science',
      short_code: 'MRO-JEMS',
      slug: 'mro-jems',
      issn: '3048-5371',
      aims_scope:
        'Covers econometrics, financial engineering, supply chain resilience, technology governance, corporate sustainability, and quantitative market policy.',
      subject_area: 'Economics and Management',
      launched_year: 2026,
      article_count: 0,
      current_issue: 'Vol. 1, Issue 1 (2026)',
    },
    {
      id: 'mro-jssh-canonical',
      title: 'MRO Journal of Social Sciences & Humanities',
      short_code: 'MRO-JSSH',
      slug: 'mro-jssh',
      issn: '3048-538X',
      aims_scope:
        'Publishes peer-reviewed research in digital humanities, cognitive psychology, social network epistemology, ethics in technology, and education science.',
      subject_area: 'Social Sciences and Humanities',
      launched_year: 2026,
      article_count: 0,
      current_issue: 'Vol. 1, Issue 1 (2026)',
    },
    {
      id: 'mro-jmir-canonical',
      title: 'MRO Journal of Interdisciplinary Research & Innovation',
      short_code: 'MRO-JMIR',
      slug: 'mro-jmir',
      issn: '3048-5398',
      aims_scope:
        'Dedicated to cross-disciplinary scientific breakthroughs connecting engineering, computational biology, cognitive science, and sustainable social systems.',
      subject_area: 'Interdisciplinary Research',
      launched_year: 2026,
      article_count: 0,
      current_issue: 'Vol. 1, Issue 1 (2026)',
    },
  ];

  // If DB contains custom journals, merge them smoothly
  const finalJournalsList: JournalItem[] = canonicalPortfolio.map((item) => {
    const dbMatch = dbJournals?.find((dj) => dj.id === item.id || dj.slug === item.slug);
    if (dbMatch) {
      return {
        ...item,
        title: dbMatch.title || item.title,
        aims_scope: dbMatch.aims_scope || item.aims_scope,
        issn: dbMatch.issn || item.issn,
        short_code: dbMatch.short_code || item.short_code,
        article_count: pubCountMap.get(dbMatch.id) ?? item.article_count,
      };
    }
    return item;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      <InstitutionalHeader />

      <JournalsCatalogClient
        initialJournals={finalJournalsList}
        allSubjects={CANONICAL_17_SUBJECTS}
      />

      <InstitutionalFooter />
    </div>
  );
}
