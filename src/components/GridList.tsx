import React from 'react';
import { motion } from 'framer-motion';
import type { GridListProps } from '../types';
import SectionWrapper from './SectionWrapper';

const badgeColors = [
  'bg-blue-600',
  'bg-violet-600',
  'bg-emerald-600',
  'bg-amber-500',
];

const GridList: React.FC<GridListProps> = ({ title, items }) => {
  return (
    <SectionWrapper>
      <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
            className="group relative flex gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-200 transition-colors duration-200 cursor-default"
          >
            {/* Number badge */}
            <div
              className={`w-8 h-8 rounded-lg ${badgeColors[i]} text-white text-sm font-black flex items-center justify-center flex-shrink-0 shadow-sm`}
            >
              {String(i + 1).padStart(2, '0')}
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-sm mb-1.5 font-mono group-hover:text-blue-700 transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>

            {/* Hover accent */}
            <div
              className={`absolute left-0 top-4 bottom-4 w-0.5 rounded-r ${badgeColors[i]} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
            />
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default GridList;
