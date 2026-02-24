import { motion } from 'framer-motion';
import { 
  User, 
  FileText, 
  Settings, 
  Clock, 
  Cpu, 
  CheckCircle,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Brain
} from 'lucide-react';
import SectionWrapper from './SectionWrapper';

/* ─── Attribute Card ─────────────────────────────────────────────────────── */
const AttrCard = ({ icon: Icon, title, label, value, color }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`p-4 rounded-2xl border-2 ${color} bg-white shadow-sm flex flex-col gap-2 w-full lg:w-48 transition-all`}
  >
    <div className="flex items-center gap-2">
      <div className={`p-1.5 rounded-lg ${color.replace('border-', 'bg-').replace('-200', '-100')} text-slate-700`}>
        <Icon size={16} />
      </div>
      <span className="font-black text-[10px] uppercase tracking-widest text-slate-400">{title}</span>
    </div>
    <div className="flex flex-col">
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mb-0.5">{label}</span>
      <span className="text-xs font-black text-slate-800 break-words">{value}</span>
    </div>
  </motion.div>
);

const AbacDiagram = () => {
  return (
    <SectionWrapper id="abac" className="mb-24 mt-20">
      <div className="text-center mb-12">
        <span className="px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-black uppercase tracking-widest border-2 border-indigo-200 shadow-sm animate-bounce">
          Must Know: Modern Security
        </span>
        <h2 className="text-4xl font-black text-slate-900 mt-6 tracking-tight">Attribute-Based Access Control</h2>
        <p className="text-slate-500 font-medium mt-3 max-w-3xl mx-auto">
          "ABAC không chỉ kiểm tra Role, mà kiểm tra mọi thuộc tính có sẵn của User, Tài nguyên và cả bối cảnh xung quanh để đưa ra quyết định thông minh."
        </p>
      </div>

      <div className="bg-white rounded-[64px] border-2 border-slate-200 p-12 lg:p-20 relative overflow-hidden shadow-2xl">
        {/* Background Network Effect */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>

        <div className="relative z-10">
          
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            
            {/* INPUTS: The 4 Attributes Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-shrink-0">
              <AttrCard 
                icon={User} 
                title="Subject (Who?)" 
                label="Identity" 
                value="Alice (Position: Nurse)" 
                color="border-blue-200"
              />
              <AttrCard 
                icon={FileText} 
                title="Resource (What?)" 
                label="Data Type" 
                value="Patient Record (ID: #404)" 
                color="border-emerald-200"
              />
              <AttrCard 
                icon={Settings} 
                title="Action (Method)" 
                label="Operation" 
                value="READ / VIEW" 
                color="border-amber-200"
              />
              <AttrCard 
                icon={Clock} 
                title="Context (When?)" 
                label="Environment" 
                value="Time: 10:00 AM (In-Shift)" 
                color="border-purple-200"
              />
            </div>

            {/* THE ENGINE: Policy Decision Point (PDP) */}
            <div className="flex-1 flex flex-col items-center justify-center relative min-h-[300px]">
              
              {/* Flow Arrows (Left side) */}
              <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full">
                <div className="flex flex-col gap-1.5 items-end">
                   {[...Array(4)].map((_,i) => (
                     <div key={i} className="flex items-center">
                        <div className="w-12 h-0.5 bg-slate-200 border-t border-dashed border-slate-400 animated-dash" />
                        <ArrowRight size={10} className="text-slate-300 -ml-1" />
                     </div>
                   ))}
                </div>
              </div>

              <motion.div
                animate={{ 
                  boxShadow: ['0 0 20px rgba(79,70,229,0.1)', '0 0 40px rgba(79,70,229,0.3)', '0 0 20px rgba(79,70,229,0.1)']
                }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="w-full max-w-[320px] bg-slate-900 rounded-[48px] border-4 border-slate-800 p-8 flex flex-col items-center relative"
              >
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white">
                    <Brain className="text-white" size={32} />
                 </div>
                 
                 <div className="mt-10 text-center">
                    <h4 className="text-white font-black text-lg tracking-widest">PDP ENGINE</h4>
                    <p className="text-indigo-400 text-[9px] font-black uppercase tracking-widest mt-1">Policy Decision Point</p>
                 </div>

                 <div className="w-full mt-6 space-y-2">
                    <div className="bg-slate-800 rounded-lg p-2.5 font-mono text-[9px] text-emerald-400 border border-slate-700">
                       IF user.position == 'Nurse' AND resource.dept == user.dept
                    </div>
                    <div className="bg-slate-800 rounded-lg p-2.5 font-mono text-[9px] text-blue-400 border border-slate-700">
                       AND env.time WITHIN shift_range
                    </div>
                 </div>

                 <div className="mt-6 flex gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[9px] font-bold text-white uppercase tracking-wider">
                       <ShieldCheck size={10} /> Policies: 4,028
                    </span>
                 </div>
              </motion.div>

              {/* Flow Success Arrow (Right side) */}
              <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
                  <div className="flex items-center">
                    <div className="w-16 h-1 bg-emerald-500 animated-dash" />
                    <CheckCircle className="text-emerald-500 ml-1" size={20} />
                  </div>
              </div>
            </div>

            {/* OUTPUT: Result Enforcement */}
            <div className="flex flex-col gap-6 flex-shrink-0">
               <motion.div 
                 whileHover={{ scale: 1.05 }}
                 className="p-6 rounded-[32px] bg-emerald-50 border-4 border-emerald-100 flex flex-col items-center gap-2 w-48 shadow-lg shadow-emerald-100/50"
               >
                 <CheckCircle className="text-emerald-500" size={40} strokeWidth={2.5} />
                 <div className="text-center">
                    <span className="font-black text-emerald-950 text-base block uppercase tracking-tighter">PERMIT</span>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Access Granted</span>
                 </div>
               </motion.div>

               <div className="opacity-40 grayscale pointer-events-none">
                 <div className="p-4 rounded-[24px] bg-rose-50 border-2 border-rose-100 flex items-center gap-3 w-48">
                    <XCircle className="text-rose-500" size={24} />
                    <span className="font-black text-rose-800 text-xs">DENY ACCESS</span>
                 </div>
               </div>
            </div>

          </div>

          {/* Educational Comparison */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-slate-100">
             <div>
                <h5 className="font-black text-slate-900 text-sm mb-4 uppercase tracking-widest flex items-center gap-2">
                   <div className="w-1.5 h-4 bg-blue-500 rounded-full" /> 
                   RBAC (Old Way)
                </h5>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  "Nếu là <b>Quản lý</b> thì được xóa." <br/> — Quá thô sơ, không kiểm tra được Alice xóa vào ban đêm hay ban ngày, xóa dữ liệu của ai.
                </p>
             </div>
             <div>
                <h5 className="font-black text-slate-900 text-sm mb-4 uppercase tracking-widest flex items-center gap-2">
                   <div className="w-1.5 h-4 bg-indigo-500 rounded-full" /> 
                   ABAC (New Way)
                </h5>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  "Nếu Alice là <b>Y tá</b>, trực <b>ca sáng</b>, và bệnh nhân này thuộc <b>khoa</b> của Alice thì mới được xem." <br/> — Bảo mật tuyệt đối và cực kỳ linh hoạt.
                </p>
             </div>
          </div>

        </div>
      </div>
    </SectionWrapper>
  );
};

export default AbacDiagram;
