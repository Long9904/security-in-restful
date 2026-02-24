import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldQuestion, Database, KeyRound, HardDrive, CheckCircle2 } from 'lucide-react';
import type { SequenceDiagramListProps } from '../types';
import SectionWrapper from './SectionWrapper';

/* ─── Animated horizontal arrow ─────────────────────────────────────────── */
const HArrow: React.FC<{ label?: string; color?: string; reverse?: boolean }> = ({
  label, color = '#3b82f6', reverse = false,
}) => (
  <div className="flex flex-col items-center gap-1 flex-shrink-0 px-1">
    <svg width="52" height="22" viewBox="0 0 52 22" fill="none">
      {reverse ? (
        <>
          <line x1="48" y1="11" x2="6" y2="11" stroke={color} strokeWidth="2" className="animated-dash" />
          <polygon points="6,6 -4,11 6,16" fill={color} className="arrow-pulse" />
        </>
      ) : (
        <>
          <line x1="4" y1="11" x2="44" y2="11" stroke={color} strokeWidth="2" className="animated-dash" />
          <polygon points="44,6 54,11 44,16" fill={color} className="arrow-pulse" />
        </>
      )}
    </svg>
    {label && (
      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
        {label}
      </span>
    )}
  </div>
);

/* ─── Actor / Node Box ───────────────────────────────────────────────────── */
interface ActorProps {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  bg: string;
  border: string;
  textColor: string;
}
const Actor: React.FC<ActorProps> = ({ icon, label, sublabel, bg, border, textColor }) => (
  <div className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 ${bg} ${border} w-[120px] flex-shrink-0`}
    style={{ animation: 'float-node 3s ease-in-out infinite' }}
  >
    <div className={`w-10 h-10 rounded-lg bg-white/70 flex items-center justify-center shadow-sm`}>
      {icon}
    </div>
    <div className="text-center">
      <p className={`font-black text-xs leading-tight ${textColor}`}>{label}</p>
      {sublabel && <p className="text-[9px] text-slate-400 mt-0.5">{sublabel}</p>}
    </div>
  </div>
);

/* ─── Flow configs ───────────────────────────────────────────────────────── */
const flowDiagrams = [
  {
    // Flow 0: Unauthenticated
    nodes: [
      { icon: <User size={20} className="text-slate-600" />, label: 'Client', sublabel: 'Anonymous', bg: 'bg-slate-100', border: 'border-slate-300', textColor: 'text-slate-700' },
      { icon: <ShieldQuestion size={20} className="text-amber-600" />, label: 'Auth Middleware', sublabel: 'Checks cred', bg: 'bg-amber-100', border: 'border-amber-300', textColor: 'text-amber-800' },
      { icon: <CheckCircle2 size={20} className="text-rose-600" />, label: 'ChallengeAsync', sublabel: '403 / Redirect', bg: 'bg-rose-100', border: 'border-rose-300', textColor: 'text-rose-800' },
    ],
    arrows: [
      { label: 'Request', color: '#f59e0b', reverse: false },
      { label: 'No cred → Reject', color: '#ef4444', reverse: false },
    ],
    layout: 'horizontal' as const,
    groupColor: 'border-amber-200 bg-amber-50',
  },
  {
    // Flow 1: Sign In
    nodes: [
      { icon: <User size={20} className="text-slate-600" />, label: 'User Client', sublabel: 'ID + Password', bg: 'bg-slate-100', border: 'border-slate-300', textColor: 'text-slate-700' },
      { icon: <Database size={20} className="text-emerald-600" />, label: 'Database', sublabel: 'Verify cred', bg: 'bg-emerald-100', border: 'border-emerald-300', textColor: 'text-emerald-800' },
      { icon: <KeyRound size={20} className="text-blue-600" />, label: 'JWT Service', sublabel: 'Create Token', bg: 'bg-blue-100', border: 'border-blue-300', textColor: 'text-blue-800' },
      { icon: <HardDrive size={20} className="text-violet-600" />, label: 'Client Storage', sublabel: 'localStorage', bg: 'bg-violet-100', border: 'border-violet-300', textColor: 'text-violet-800' },
    ],
    arrows: [
      { label: 'Login form', color: '#10b981', reverse: false },
      { label: 'Check', color: '#3b82f6', reverse: false },
      { label: 'JWT Token', color: '#8b5cf6', reverse: false },
    ],
    layout: 'horizontal' as const,
    groupColor: 'border-emerald-200 bg-emerald-50',
  },
  {
    // Flow 2: Subsequent Requests
    nodes: [
      { icon: <User size={20} className="text-slate-600" />, label: 'Client', sublabel: 'Auth header', bg: 'bg-slate-100', border: 'border-slate-300', textColor: 'text-slate-700' },
      { icon: <ShieldQuestion size={20} className="text-blue-600" />, label: 'Auth Middleware', sublabel: 'Reads token', bg: 'bg-blue-100', border: 'border-blue-300', textColor: 'text-blue-800' },
      { icon: <CheckCircle2 size={20} className="text-emerald-600" />, label: 'Authorization', sublabel: 'Check policy', bg: 'bg-emerald-100', border: 'border-emerald-300', textColor: 'text-emerald-800' },
    ],
    arrows: [
      { label: 'Bearer token', color: '#3b82f6', reverse: false },
      { label: 'ClaimsIdentity', color: '#10b981', reverse: false },
    ],
    layout: 'horizontal' as const,
    groupColor: 'border-blue-200 bg-blue-50',
  },
];

const tabStyles = [
  { active: 'bg-amber-500 text-white border-amber-500', dot: 'bg-amber-400' },
  { active: 'bg-emerald-600 text-white border-emerald-600', dot: 'bg-emerald-400' },
  { active: 'bg-blue-600 text-white border-blue-600', dot: 'bg-blue-400' },
];

/* ─── Component ──────────────────────────────────────────────────────────── */
const SequenceDiagramList: React.FC<SequenceDiagramListProps> = ({ title, flows }) => {
  const [tab, setTab] = useState(0);
  const diagram = flowDiagrams[tab];

  return (
    <SectionWrapper>
      <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6">{title}</h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {flows.map((f, i) => (
          <button
            key={i}
            onClick={() => setTab(i)}
            className={`px-4 py-2 rounded-lg border-2 text-xs font-bold transition-all duration-200 ${tab === i ? tabStyles[i].active : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
          >
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${tab === i ? 'bg-white' : tabStyles[i].dot}`} />
              {f.flowName}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Architecture diagram */}
          <div className={`rounded-2xl border-2 ${diagram.groupColor} p-6 mb-4`}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
              Architecture Flow
            </p>
            <div className="overflow-x-auto">
              <div className="flex flex-row items-center gap-0 min-w-max mx-auto w-fit pb-2">
                {diagram.nodes.map((node, ni) => (
                  <React.Fragment key={ni}>
                    <Actor {...node} />
                    {ni < diagram.nodes.length - 1 && (
                      <HArrow
                        label={diagram.arrows[ni]?.label}
                        color={diagram.arrows[ni]?.color}
                        reverse={diagram.arrows[ni]?.reverse}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Step list */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
              <p className="font-black text-slate-800 text-sm">{flows[tab].flowName}</p>
            </div>
            <div className="divide-y divide-slate-100">
              {flows[tab].steps.map((step, si) => (
                <motion.div
                  key={si}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: si * 0.06 }}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                >
                  <span className={`w-6 h-6 rounded-full text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 shadow-sm`}
                    style={{ background: diagram.arrows[0]?.color ?? '#3b82f6' }}
                  >
                    {si + 1}
                  </span>
                  <p className="text-slate-600 text-sm leading-relaxed pt-0.5">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  );
};

export default SequenceDiagramList;
