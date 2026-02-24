import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { ProsConsTableProps } from '../types';
import SectionWrapper from './SectionWrapper';

const ProsConsTable: React.FC<ProsConsTableProps> = ({ title, pros, cons }) => {
  return (
    <SectionWrapper>
      <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pros */}
        <div className="rounded-xl border-2 border-emerald-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2.5 px-5 py-3.5 bg-emerald-600">
            <CheckCircle2 className="text-white" size={18} strokeWidth={2.5} />
            <span className="font-black text-white text-sm uppercase tracking-wider">
              Điểm mạnh (Pros)
            </span>
          </div>

          <div className="bg-white divide-y divide-slate-100">
            {pros.map((pro, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-start gap-3 px-5 py-4 hover:bg-emerald-50 transition-colors duration-150"
              >
                <CheckCircle2
                  className="text-emerald-500 flex-shrink-0 mt-0.5"
                  size={16}
                  strokeWidth={2.5}
                />
                <p className="text-slate-700 text-sm leading-relaxed">{pro}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Cons */}
        <div className="rounded-xl border-2 border-rose-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2.5 px-5 py-3.5 bg-rose-600">
            <XCircle className="text-white" size={18} strokeWidth={2.5} />
            <span className="font-black text-white text-sm uppercase tracking-wider">
              Điểm yếu (Cons)
            </span>
          </div>

          <div className="bg-white divide-y divide-slate-100">
            {cons.map((con, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-start gap-3 px-5 py-4 hover:bg-rose-50 transition-colors duration-150"
              >
                <XCircle
                  className="text-rose-500 flex-shrink-0 mt-0.5"
                  size={16}
                  strokeWidth={2.5}
                />
                <p className="text-slate-700 text-sm leading-relaxed">{con}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ProsConsTable;
