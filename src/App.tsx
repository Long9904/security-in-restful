import './index.css';
import HeroSection from './components/HeroSection';
import SideBySideComparisonCard from './components/SideBySideComparisonCard';
import GridList from './components/GridList';
import InteractiveDiagram from './components/InteractiveDiagram';
import SequenceDiagramList from './components/SequenceDiagramList';
import ProsConsTable from './components/ProsConsTable';
import CallOutBlock from './components/CallOutBlock';
import AbacDiagram from './components/AbacDiagram';
import StandardSecurityFlow from './components/StandardSecurityFlow';
import CSharpCodeExamples from './components/CSharpCodeExamples';

import {
  heroData,
  comparisonData,
  bestPracticesData,
  jwtDiagramData,
  securityFlowData,
  prosConsData,
  conclusionData,
} from './data/content';

// Function to clean content from [cite: X] markers
const clean = (text: string) => text.replace(/\[cite:\s*\d*(,\s*\d*)*\]/g, '').trim();

// Section divider component
const SectionDivider = () => (
  <div className="flex items-center gap-4 my-8">
    <div className="flex-1 h-px bg-slate-200" />
    <div className="w-2 h-2 rounded-full border-2 border-slate-300" />
    <div className="flex-1 h-px bg-slate-200" />
  </div>
);

// Nav bar
const NAV_LINKS = [
  { href: '#flow',     label: 'Security Flow' },
  { href: '#concepts', label: 'Core Concepts' },
  { href: '#jwt',      label: 'JWT' },
  { href: '#abac',     label: 'ABAC' },
  { href: '#csharp',   label: 'C# Examples' },
];

const NavBar = () => (
  <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-slate-200/80 shadow-[0_1px_12px_0_rgba(15,23,42,0.06)]">
    <div className="max-w-6xl mx-auto px-6 h-[75px] flex items-center justify-between gap-8">

      {/* Logo */}
      <div className="flex items-center gap-3 group cursor-pointer select-none flex-shrink-0">
        <div className="leading-none">
          <span className="block font-black text-slate-900 text-[16.5px] tracking-tight">Security in RESTful</span>
          <span className="block text-[10px] font-bold text-blue-500 uppercase tracking-[0.18em] mt-0.5">Tech Documentation</span>
        </div>
      </div>

      {/* Nav Links */}
      <div className="hidden lg:flex items-center gap-1">
        {NAV_LINKS.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="relative px-4 py-2 rounded-lg text-[14px] font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50/70 transition-all duration-150 group"
          >
            {label}
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 group-hover:w-4 h-0.5 bg-blue-500 rounded-full transition-all duration-200" />
          </a>
        ))}
      </div>


      {/* Mobile hamburger */}
      <div className="lg:hidden">
        <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>

    </div>
  </nav>
);

// Footer
const Footer = () => (
  <footer className="mt-20 border-t border-slate-200 bg-slate-50/60">
    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center">
          <span className="text-white text-[9px] font-black">S/R</span>
        </div>
        <span className="text-[11px] font-bold text-slate-500 tracking-tight">Security in RESTful WebService</span>
      </div>
      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Technical Guide · 2024</p>
      <p className="text-[10px] text-slate-400 font-medium">Built with React + Tailwind + Framer Motion</p>
    </div>
  </footer>
);

// ─── App: Pure Orchestrator ─────────
function App() {
  return (
    <div className="min-h-screen bg-[#fcfdfe] font-sans selection:bg-blue-100 selection:text-blue-900">
      <NavBar />

      {/* Hero */}
      <HeroSection 
        title={clean(heroData.title)} 
        subtitle={clean(heroData.subtitle)} 
        content={heroData.content.map(clean)} 
      />

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        
        {/* Standard Security Flow */}
        <section id="flow" className="scroll-mt-24">
          <StandardSecurityFlow />
        </section>

        <SectionDivider />

        {/* Authentication vs Authorization */}
        <section id="concepts" className="scroll-mt-24">
          <SideBySideComparisonCard 
            title={clean(comparisonData.title)}
            leftCard={{...comparisonData.leftCard, description: clean(comparisonData.leftCard.description), analogy: clean(comparisonData.leftCard.analogy)}}
            rightCard={{...comparisonData.rightCard, description: clean(comparisonData.rightCard.description), analogy: clean(comparisonData.rightCard.analogy)}}
          />
        </section>

        <SectionDivider />

        {/* Best Practices */}
        <section>
          <GridList 
            title={clean(bestPracticesData.title)} 
            items={bestPracticesData.items.map(i => ({...i, desc: clean(i.desc)}))} 
          />
        </section>

        <SectionDivider />

        {/* JWT Diagram */}
        <section id="jwt" className="scroll-mt-24">
          <InteractiveDiagram 
            title={clean(jwtDiagramData.title)}
            description={clean(jwtDiagramData.description)}
            diagramSteps={jwtDiagramData.diagramSteps.map(s => ({...s, detail: clean(s.detail)}))}
          />
        </section>

        <SectionDivider />

        {/* Security Flow Sequence */}
        <section id="sequence" className="scroll-mt-24">
          <SequenceDiagramList 
            title={clean(securityFlowData.title)}
            flows={securityFlowData.flows.map(f => ({...f, steps: f.steps.map(clean)}))}
          />
        </section>

        <SectionDivider />

        {/* Pros & Cons */}
        <section>
          <ProsConsTable 
            title={clean(prosConsData.title)}
            pros={prosConsData.pros.map(clean)}
            cons={prosConsData.cons.map(clean)}
          />
        </section>

        <SectionDivider />

        {/* Conclusion */}
        <section id="conclusion" className="scroll-mt-24">
          <CallOutBlock 
            title={clean(conclusionData.title)}
            content={clean(conclusionData.content)}
          />
        </section>

        {/* ABAC Section (Added as requested) */}
        <SectionDivider />
        <section id="abac" className="scroll-mt-24">
          <AbacDiagram />
        </section>

        {/* C# Code Examples */}
        <SectionDivider />
        <section id="csharp" className="scroll-mt-24">
          <CSharpCodeExamples />
        </section>

      </main>

      <Footer />
    </div>
  );
}

export default App;
