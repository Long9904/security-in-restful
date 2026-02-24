import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Zap, TrendingDown, Terminal, ShieldCheck } from 'lucide-react';
import type { HeroSectionProps } from '../types';

const icons = [ShieldAlert, Zap, TrendingDown];

const iconColors = [
  'bg-blue-100 text-blue-600',
  'bg-amber-100 text-amber-600',
  'bg-rose-100 text-rose-600',
];

const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle, content }) => {
  return (
    <section className="relative overflow-hidden bg-[#fcfdfe] border-b border-slate-200">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-indigo-50/50 rounded-full blur-3xl -z-0" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] -z-0"
        style={{
          backgroundImage: `linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(to right, #0f172a 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Text */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border-2 border-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest mb-8 shadow-sm"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
               Enterprise Security Standard v2.0
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.95] mb-6"
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-xl md:text-2xl font-semibold text-slate-500 mb-12 max-w-xl leading-relaxed"
            >
              {subtitle}
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {content.map((text, i) => {
                const Icon = icons[i];
                const borderColors = [
                  'border-blue-200',
                  'border-amber-200',
                  'border-rose-200',
                ];
                const parts = text.split(':');
                const cardTitle = parts[0];
                const cardDesc = parts.slice(1).join(':');
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    className={`flex flex-col gap-3 p-4 rounded-2xl border bg-white/60 group ${borderColors[i]}`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border-2 transform group-hover:rotate-6 transition-transform ${iconColors[i]} ${borderColors[i]}`}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-[13px] mb-1 uppercase tracking-tight">
                        {cardTitle.trim()}
                      </p>
                      <p className="text-slate-500 text-[11px] font-medium leading-relaxed">
                        {cardDesc.trim()}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Visual Decoration */}
          <div className="hidden lg:block lg:col-span-5 relative">
             <motion.div 
               initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
               animate={{ opacity: 1, scale: 1, rotate: 0 }}
               transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
               className="relative z-10 p-8 rounded-[40px] bg-slate-900 shadow-2xl border-4 border-slate-800 overflow-hidden"
             >
                <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <div className="ml-4 flex items-center gap-2 text-slate-500 font-mono text-[10px]">
                    <Terminal size={12} />
                    <span>auth_middleware.ts</span>
                  </div>
                </div>
                
                <div className="font-mono text-[11px] space-y-2.5">
                   <div className="flex gap-4">
                      <span className="text-slate-600">01</span>
                      <span className="text-blue-400">async function</span> <span className="text-white">secureRequest</span><span className="text-slate-400">(req, res) {'{'}</span>
                   </div>
                   <div className="flex gap-4">
                      <span className="text-slate-600">02</span>
                      <span className="text-slate-400 ml-4">const token = req.headers[</span><span className="text-amber-300">'Authorization'</span><span className="text-slate-400">];</span>
                   </div>
                   <div className="flex gap-4">
                      <span className="text-slate-600">03</span>
                      <span className="text-blue-400 ml-4">if</span> <span className="text-slate-400">(!token)</span> <span className="text-blue-400">return</span> <span className="text-emerald-400">ChallengeAsync</span><span className="text-slate-400">();</span>
                   </div>
                   <div className="flex gap-4">
                      <span className="text-slate-600">04</span>
                      <span className="text-slate-400 ml-4">const user =</span> <span className="text-blue-400">await</span> <span className="text-white">verifyJWT</span><span className="text-slate-400">(token);</span>
                   </div>
                   <div className="flex gap-4">
                      <span className="text-slate-600">05</span>
                      <span className="text-blue-400 ml-4">await</span> <span className="text-white">enforceABAC</span><span className="text-slate-400">(user, req.resource);</span>
                   </div>
                   <div className="flex gap-4">
                      <span className="text-slate-600">06</span>
                      <span className="text-slate-400">{'}'}</span>
                   </div>
                </div>

                {/* Floating Elements */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute bottom-6 right-6 p-4 bg-emerald-500 rounded-2xl border-2 border-emerald-300 flex items-center gap-3"
                >
                   <ShieldCheck className="text-white" size={24} />
                   <div className="text-white">
                      <p className="text-[10px] font-black uppercase tracking-widest">Secure</p>
                      <p className="text-[8px] opacity-80 font-bold uppercase">Middleware Active</p>
                   </div>
                </motion.div>
             </motion.div>

             {/* Background Decoration blobs */}
             <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-200 rounded-full blur-2xl opacity-50" />
             <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-50" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
