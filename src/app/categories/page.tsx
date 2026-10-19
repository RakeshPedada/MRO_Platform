'use client';

import { useState } from 'react';
import Link from 'next/link';
import InstitutionalHeader from '@/components/layout/InstitutionalHeader';
import InstitutionalFooter from '@/components/layout/InstitutionalFooter';
import {
  Compass,
  Search,
  BookOpen,
  Send,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Zap,
  Cog,
  Building,
  Bot,
  Sun,
  FlaskConical,
  Atom,
  Dna,
  HeartPulse,
  Leaf,
  Sprout,
  TrendingUp,
  Landmark,
  Share2,
  Sparkles,
} from 'lucide-react';

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  scope: string;
  topics: string[];
}

const CANONICAL_17_CATEGORIES: CategoryItem[] = [
  {
    id: 1,
    name: 'Aerospace and Aeronautical Engineering',
    slug: 'aerospace-engineering',
    scope:
      'Aerodynamics, computational fluid dynamics, propulsion systems, flight mechanics, autonomous avionics, spacecraft structural dynamics, and satellite subsystems.',
    topics: ['Hypersonics', 'Turbomachinery', 'Avionics', 'UAV Guidance', 'Orbital Mechanics'],
  },
  {
    id: 2,
    name: 'Mechanical Engineering',
    slug: 'mechanical-engineering',
    scope:
      'Thermodynamics, heat and mass transfer, solid mechanics, manufacturing systems, fracture analysis, machine design, acoustics, and fluid power.',
    topics: ['Additive Manufacturing', 'CFD Modeling', 'Thermal Dissipation', 'Stress Analysis', 'Vibration Suppression'],
  },
  {
    id: 3,
    name: 'Civil Engineering',
    slug: 'civil-engineering',
    scope:
      'Structural integrity, earthquake engineering, geotechnical mechanics, transportation networks, smart concrete formulations, and sustainable urban infrastructure.',
    topics: ['Seismic Resiliency', 'Structural Health Monitoring', 'Green Concrete', 'Soil Stabilization', 'Bridges'],
  },
  {
    id: 4,
    name: 'Electrical and Electronics Engineering',
    slug: 'electrical-electronics-engineering',
    scope:
      'High-voltage DC transmission, power electronics, microgrid synchronization, power system stability, semiconductor physics, and embedded signal processing.',
    topics: ['HVDC Converters', 'Wide-Bandgap Devices', 'Fault Diagnostics', 'Power Quality', 'VLSI Design'],
  },
  {
    id: 5,
    name: 'Computer Science and Artificial Intelligence',
    slug: 'computer-science-artificial-intelligence',
    scope:
      'Deep neural architectures, natural language processing, computer vision, distributed cloud computing, graph analytics, and algorithmic complexity.',
    topics: ['Graph Neural Networks', 'Edge AI', 'Reinforcement Learning', 'Distributed Consensus', 'Parallel Computing'],
  },
  {
    id: 6,
    name: 'Robotics and Automation',
    slug: 'robotics-automation',
    scope:
      'Humanoid robotics, unmanned aerial navigation, SLAM algorithms, industrial mechatronic actuators, soft robotics, and cooperative multi-agent swarms.',
    topics: ['Visual Odometry', 'Inverse Kinematics', 'Haptic Control', 'Warehouse Automation', 'Tactile Sensing'],
  },
  {
    id: 7,
    name: 'Physics and Mathematics',
    slug: 'physics-mathematics',
    scope:
      'Quantum mechanics, condensed matter physics, statistical mechanics, differential equations, numerical analysis, applied topology, and mathematical modeling.',
    topics: ['Quantum Computing', 'Topological Insulators', 'Dynamical Systems', 'Stochastic Calculus', 'Optics'],
  },
  {
    id: 8,
    name: 'Chemistry and Materials Science',
    slug: 'chemistry-materials-science',
    scope:
      'Nanomaterials, polymer chemistry, battery electrolytes, heterogeneous catalysis, 2D graphene composites, and corrosion-resistant alloys.',
    topics: ['Solid-State Batteries', 'Graphene Composites', 'Catalysis', 'Bio-polymers', 'Superconductors'],
  },
  {
    id: 9,
    name: 'Space Science and Astronomy',
    slug: 'space-science-astronomy',
    scope:
      'Astrophysics, planetary geology, cosmic ray spectroscopy, satellite remote sensing, solar wind telemetry, and exoplanetary detection techniques.',
    topics: ['Deep Space Telemetry', 'Spectroscopy', 'Planetary Rovers', 'Stellar Evolution', 'Remote Sensing'],
  },
  {
    id: 10,
    name: 'Biotechnology and Life Sciences',
    slug: 'biotechnology-life-sciences',
    scope:
      'Genetic engineering, synthetic biology, molecular bioinformatics, enzyme kinetics, bioprocess fermentation, and cellular biosensors.',
    topics: ['CRISPR Editing', 'Metabolic Engineering', 'Protein Modeling', 'Biosensors', 'Fermentation'],
  },
  {
    id: 11,
    name: 'Medical and Health Sciences',
    slug: 'medical-health-sciences',
    scope:
      'Biomedical instrumentation, medical imaging analysis, clinical diagnostic devices, drug delivery systems, biomaterials, and health informatics.',
    topics: ['Medical Imaging AI', 'Nanomedicine', 'Bio-MEMS', 'Prosthetics', 'Telemedicine Protocols'],
  },
  {
    id: 12,
    name: 'Environmental Science',
    slug: 'environmental-science',
    scope:
      'Climate modeling, atmospheric aerosol analysis, water purification technologies, environmental toxicology, ecological restoration, and waste valorization.',
    topics: ['Carbon Capture', 'Membrane Filtration', 'Aerosol Transport', 'Hydrology', 'Bioremediation'],
  },
  {
    id: 13,
    name: 'Energy and Renewable Technologies',
    slug: 'energy-renewable-technologies',
    scope:
      'Photovoltaic solar cells, wind turbine aerodynamics, hydrogen electrolysis, thermoelectric generators, fuel cells, and grid-scale battery storage.',
    topics: ['Perovskite Solar', 'Green Hydrogen', 'Redox Flow Batteries', 'Wind Aerodynamics', 'Thermal Energy'],
  },
  {
    id: 14,
    name: 'Agriculture and Food Science',
    slug: 'agriculture-food-science',
    scope:
      'Precision agriculture, drone crop monitoring, soil microbiome, sustainable food packaging, post-harvest engineering, and automated irrigation.',
    topics: ['Precision Agronomy', 'Food Processing', 'Soil Sensing', 'Irrigation AI', 'Post-Harvest Losses'],
  },
  {
    id: 15,
    name: 'Economics and Management',
    slug: 'economics-management',
    scope:
      'Econometric modeling, supply chain optimization, circular economy strategies, industrial technology management, and technological innovation forecasting.',
    topics: ['Circular Economy', 'Game Theory', 'Supply Chain Analytics', 'Technology Adoption', 'Financial Risk'],
  },
  {
    id: 16,
    name: 'Social Sciences and Humanities',
    slug: 'social-sciences-humanities',
    scope:
      'Ethics of artificial intelligence, sociology of technological change, science policy, intellectual property law, and human-machine interaction governance.',
    topics: ['AI Governance', 'Technology Ethics', 'Open Science Policy', 'Digital Sociology', 'Digital Humanities'],
  },
  {
    id: 17,
    name: 'Interdisciplinary Research',
    slug: 'interdisciplinary-research',
    scope:
      'Transdisciplinary cross-pollination merging computational models, physical sciences, engineering prototypes, and social governance systems.',
    topics: ['Complex Systems', 'Cyber-Physical Systems', 'Bio-Informatics', 'Socio-Technical Systems', 'Smart Cities'],
  },
];

export default function ResearchCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = CANONICAL_17_CATEGORIES.filter(
    (c) =>
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.scope.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      <InstitutionalHeader />

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10 flex-1 w-full">
        {/* Banner Section */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider rounded-md border border-sky-100">
            <Compass className="w-3.5 h-3.5 text-sky-600" />
            <span>Section 7 Multidisciplinary Scopes</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b1b3d] tracking-tight leading-tight">
            17 Multidisciplinary Research Categories
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            MANI Research Organization (MRO) welcomes submissions across seventeen canonical academic domains. Each category is overseen by specialized section editors to ensure rigorous, competent double-blind evaluation.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Manuscript in Your Domain &rarr;</span>
            </Link>
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-700" />
              <span>Browse All Open Access Papers</span>
            </Link>
          </div>
        </section>

        {/* Search & Filter Toolbar */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search category, engineering topic, or keywords..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
            />
          </div>

          <div className="text-xs text-slate-500 self-end sm:self-center">
            Displaying <strong className="text-slate-900">{filtered.length} of 17</strong> Academic Disciplines
          </div>
        </section>

        {/* 17 Categories Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-academic-hover hover:border-sky-300 transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-0.5 rounded-full">
                    Category #{cat.id}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    COPE Model
                  </span>
                </div>

                <h2 className="scholarly-title text-base sm:text-lg leading-snug">
                  {cat.name}
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {cat.scope}
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Example Core Topics
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.topics.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <Link
                  href={`/articles`}
                  className="text-sky-700 hover:text-sky-800 font-semibold flex items-center gap-1"
                >
                  <span>Explore Papers</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <Link
                  href="/submit"
                  className="px-3 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-lg shadow-sm transition"
                >
                  Submit Paper &rarr;
                </Link>
              </div>
            </div>
          ))}
        </section>
      </main>

      <InstitutionalFooter />
    </div>
  );
}
