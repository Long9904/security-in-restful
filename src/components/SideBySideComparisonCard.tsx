import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Key } from 'lucide-react';
import type { SideBySideComparisonCardProps, ComparisonCardData } from '../types';
import SectionWrapper from './SectionWrapper';

const iconMap = {
  ShieldCheck: ShieldCheck,
  Key: Key,
};

const cardStyle = {
  ShieldCheck: {
    iconBg: 'bg-blue-600',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    border: 'border-blue-200 hover:border-blue-400',
    accent: 'bg-blue-600',
    tag: 'WHO you are',
  },
  Key: {
    iconBg: 'bg-violet-600',
    badge: 'bg-violet-50 text-violet-700 border-violet-200',
    border: 'border-violet-200 hover:border-violet-400',
    accent: 'bg-violet-600',
    tag: 'WHAT you can do',
  },
};

interface CardProps {
  data: ComparisonCardData;
  delay: number;
}

const Card: React.FC<CardProps> = ({ data, delay }) => {
  const Icon = iconMap[data.icon];
  const style = cardStyle[data.icon];

  return (
    <motion.div
      initial={{ opacity: 0, x: data.icon === 'ShieldCheck' ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={`flex-1 rounded-xl border-2 ${style.border} bg-white p-6 shadow-sm transition-all duration-200`}
    >
      {/* Top */}
      <div className="flex items-start gap-4 mb-5">
        <div className={`w-12 h-12 rounded-xl ${style.iconBg} flex items-center justify-center flex-shrink-0 shadow-md`}>
          <Icon className="text-white" size={24} strokeWidth={2} />
        </div>
        <div>
          <h3 className="font-black text-slate-900 text-lg leading-tight">{data.header}</h3>
          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${style.badge}`}>
            {style.tag}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className={`h-0.5 w-12 ${style.accent} rounded-full mb-5`} />

      {/* Description */}
      <p className="text-slate-600 text-sm leading-relaxed mb-5">{data.description}</p>

      {/* Analogy box */}
      <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Analogy</p>
        <p className="text-slate-600 text-sm leading-relaxed italic">{data.analogy}</p>
      </div>
    </motion.div>
  );
};

const SideBySideComparisonCard: React.FC<SideBySideComparisonCardProps> = ({
  title,
  leftCard,
  rightCard,
}) => {
  return (
    <SectionWrapper>
      <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8">{title}</h2>

      {/* VS Connector */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        <Card data={leftCard} delay={0} />

        <div className="flex items-center justify-center flex-shrink-0">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <div className="hidden md:block w-8 h-px bg-slate-300" />
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-200 text-sm font-black text-slate-400">
              VS
            </div>
            <div className="hidden md:block w-8 h-px bg-slate-300" />
          </div>
        </div>

        <Card data={rightCard} delay={0.1} />
      </div>
    </SectionWrapper>
  );
};

export default SideBySideComparisonCard;
