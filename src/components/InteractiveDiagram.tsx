import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode2, Database, ShieldCheck, ArrowRight } from 'lucide-react';
import type { InteractiveDiagramProps } from '../types';
import SectionWrapper from './SectionWrapper';

/* ─── Animated SVG Arrow ─────────────────────────────────────────────────── */
const ArrowConnector: React.FC<{ label?: string; color?: string }> = ({
  label,
  color = '#3b82f6',
}) => (
  <div className="flex flex-col items-center justify-center gap-1 px-1 flex-shrink-0 select-none">
    <svg width="56" height="24" viewBox="0 0 56 24" fill="none">
      <line
        x1="4" y1="12" x2="46" y2="12"
        stroke={color}
        strokeWidth="2"
        className="animated-dash"
      />
      <polygon points="46,7 56,12 46,17" fill={color} className="arrow-pulse" />
    </svg>
    {label && (
      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
        {label}
      </span>
    )}
  </div>
);

/* ─── Node Box ───────────────────────────────────────────────────────────── */
interface NodeBoxProps {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  colorClasses: string;
  active: boolean;
  onClick: () => void;
  step: string;
}

const NodeBox: React.FC<NodeBoxProps> = ({ icon, label, sublabel, colorClasses, active, onClick, step }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
    whileTap={{ scale: 0.97 }}
    animate={active ? { y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' } : {}}
    className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 w-full ${colorClasses} ${active ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
  >
    <span className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-slate-800 text-white text-[10px] font-black flex items-center justify-center shadow">
      {step}
    </span>
    <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center shadow-inner">
      {icon}
    </div>
    <div className="text-center">
      <p className="font-black text-sm leading-tight">{label}</p>
      <p className="text-[10px] font-semibold opacity-60 uppercase tracking-wider mt-0.5">{sublabel}</p>
    </div>
  </motion.button>
);

/* ─── JWT Token Display ──────────────────────────────────────────────────── */
const JwtTokenBar: React.FC<{ activeStep: number | null }> = ({ activeStep }) => (
  <div className="flex items-stretch rounded-xl overflow-hidden border-2 border-slate-700 bg-slate-900 font-mono text-xs shadow-xl">
    {[
      { text: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', cls: 'text-red-400', active: activeStep === 0 },
      { text: '.', cls: 'text-slate-500', active: false },
      { text: 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0', cls: 'text-purple-400', active: activeStep === 1 },
      { text: '.', cls: 'text-slate-500', active: false },
      { text: 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', cls: 'text-blue-400', active: activeStep === 2 },
    ].map((seg, i) => (
      <span
        key={i}
        className={`px-2 py-2.5 transition-all duration-300 ${seg.cls} ${seg.active ? 'bg-white/10 rounded' : ''} break-all`}
      >
        {seg.text}
      </span>
    ))}
  </div>
);

/* ─── Component ──────────────────────────────────────────────────────────── */
const nodeConfig = [
  { icon: <FileCode2 size={22} className="text-red-600" />, sublabel: 'Algorithm + Type', colorClasses: 'bg-red-100 text-red-800 border-red-300 hover:border-red-400' },
  { icon: <Database size={22} className="text-purple-600" />, sublabel: 'User Claims', colorClasses: 'bg-purple-100 text-purple-800 border-purple-300 hover:border-purple-400' },
  { icon: <ShieldCheck size={22} className="text-blue-600" />, sublabel: 'HMAC SHA256', colorClasses: 'bg-blue-100 text-blue-800 border-blue-300 hover:border-blue-400' },
];
const arrowColors = ['#ef4444', '#8b5cf6', '#3b82f6'];

const InteractiveDiagram: React.FC<InteractiveDiagramProps> = ({ title, description, diagramSteps }) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const toggle = (i: number) => setActiveStep(p => (p === i ? null : i));

  return (
    <SectionWrapper>
      <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900">{title}</h2>
        <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Click box to inspect
        </span>
      </div>
      <p className="text-slate-500 text-sm mb-6 leading-relaxed">{description}</p>

      {/* Token preview */}
      <div className="mb-6">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">JWT Token Preview</p>
        <JwtTokenBar activeStep={activeStep} />
      </div>

      {/* Node flow */}
      <div className="relative p-5 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 mb-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-5">JWT Structure</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-0">
          {diagramSteps.map((step, i) => (
            <React.Fragment key={i}>
              <div className="w-36">
                <NodeBox
                  step={step.step}
                  icon={nodeConfig[i].icon}
                  label={step.boxLabel}
                  sublabel={nodeConfig[i].sublabel}
                  colorClasses={nodeConfig[i].colorClasses}
                  active={activeStep === i}
                  onClick={() => toggle(i)}
                />
              </div>
              {i < diagramSteps.length - 1 && (
                <div className="rotate-90 sm:rotate-0">
                  <ArrowConnector color={arrowColors[i]} />
                </div>
              )}
            </React.Fragment>
          ))}

          {/* Combined arrow down */}
        </div>

        {/* Bottom: combined token */}
        <div className="flex flex-col items-center mt-5">
          <svg width="2" height="28" className="mb-1">
            <line x1="1" y1="0" x2="1" y2="28" stroke="#64748b" strokeWidth="2" className="animated-dash" />
          </svg>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-slate-600 bg-slate-800 text-white text-xs font-bold shadow-lg">
            <ArrowRight size={12} />
            JWT Token = Header.Payload.Signature
          </div>
        </div>
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {activeStep !== null && (
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className={`rounded-xl border-2 p-5 ${nodeConfig[activeStep].colorClasses}`}
          >
            <p className="text-[10px] font-black uppercase tracking-widest mb-1.5 opacity-60">
              Part {diagramSteps[activeStep].step} — {diagramSteps[activeStep].boxLabel}
            </p>
            <p className="text-sm font-medium leading-relaxed">{diagramSteps[activeStep].detail}</p>
          </motion.div>
        )}
      </AnimatePresence>
      {activeStep === null && (
        <p className="text-center text-slate-400 text-xs py-2">↑ Click một node để xem chi tiết</p>
      )}
    </SectionWrapper>
  );
};

export default InteractiveDiagram;
