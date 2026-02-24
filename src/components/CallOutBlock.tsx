import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Lock, ShieldCheck, Database, Layers } from 'lucide-react';
import type { CallOutBlockProps } from '../types';
import SectionWrapper from './SectionWrapper';

const pillItems = [
  { label: 'TLS/SSL', icon: Lock },
  { label: 'Input Validation', icon: ShieldCheck },
  { label: 'Authentication', icon: Database },
  { label: 'Authorization', icon: Layers },
  { label: 'JWT', icon: Lightbulb },
];

const CallOutBlock: React.FC<CallOutBlockProps> = ({ title, content }) => {
  return (
    <SectionWrapper>
      <motion.div
        whileHover={{ scale: 1.005 }}
        transition={{ duration: 0.2 }}
        className="relative rounded-2xl overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-lg"
      >
        {/* Left accent bar */}
        <div className="absolute left-0 inset-y-0 w-1.5 bg-gradient-to-b from-blue-500 to-indigo-600" />

        <div className="pl-8 pr-6 py-8">
          {/* Icon + Title */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
              <Lightbulb className="text-white" size={22} strokeWidth={2} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">{title}</h2>
          </div>

          {/* Pill tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {pillItems.map((pill, i) => {
              const Icon = pill.icon;
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold"
                >
                  <Icon size={11} />
                  {pill.label}
                </motion.span>
              );
            })}
          </div>

          {/* Content */}
          <p className="text-slate-700 text-base leading-relaxed max-w-3xl">{content}</p>
        </div>
      </motion.div>
    </SectionWrapper>
  );
};

export default CallOutBlock;
