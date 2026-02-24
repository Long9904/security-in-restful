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

// Nav bar (Larger & Easier to interact)
const NavBar = () => (
  <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b-2 border-slate-100 shadow-sm">
    <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-4 group cursor-pointer">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <span className="text-white text-lg font-black italic">S</span>
        </div>
        <div>
          <span className="block font-black text-slate-900 text-lg leading-tight tracking-tight">Security in RESTful</span>
          <span className="block text-[10px] font-bold text-blue-600 uppercase tracking-widest">Tech Documentation</span>
        </div>
      </div>
      <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-500">
        <a href="#flow" className="hover:text-blue-600 transition-colors py-2 border-b-2 border-transparent hover:border-blue-600">Luồng Standard</a>
        <a href="#concepts" className="hover:text-blue-600 transition-colors py-2 border-b-2 border-transparent hover:border-blue-600">Khái niệm</a>
        <a href="#jwt" className="hover:text-blue-600 transition-colors py-2 border-b-2 border-transparent hover:border-blue-600">JWT</a>
        <a href="#abac" className="hover:text-blue-600 transition-colors py-2 border-b-2 border-transparent hover:border-blue-600">ABAC (Advanced)</a>
      </div>
      <div className="lg:hidden">
        <button className="p-2 bg-slate-100 rounded-lg text-slate-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
    </div>
  </nav>
);

// Footer
const Footer = () => (
  <footer className="mt-20 py-12 border-t border-slate-200 bg-white">
    <div className="max-w-5xl mx-auto px-6 text-center">
      <div className="w-12 h-1 bg-slate-100 mx-auto mb-6 rounded-full" />
      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
        Security in RESTful WebService — 2024 Technical Guide
      </p>
      <p className="text-[10px] text-slate-300 mt-2 font-medium">Build with React + Tailwind + ByteByteGo Aesthetic</p>
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

      </main>

      <Footer />
    </div>
  );
}

export default App;
