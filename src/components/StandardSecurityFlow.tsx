import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor, Smartphone, Tablet, Terminal, Radio,
  ShieldAlert, Activity, Server, FileCheck, Layers,
  UserCheck, Key, Database, CheckCircle2, XCircle,
  Wifi, Code2, FileJson, Lock, Unlock, ShieldCheck, User,
  AlertCircle, HardDrive
} from 'lucide-react';
import SectionWrapper from './SectionWrapper';

let pid = 0;
const uid = () => ++pid;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TAB 1 — DoS / Rate Limiting  (absolute-canvas packet animation)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const LANE_H = 60;
const CANVAS_H = 5 * LANE_H;
const PKT_START = 0;   // relative x inside animation band
const GUARD_DELTA = 210; // x to reach guard
const SERVER_DELTA = 380; // x to reach server

const DEVICE_CFGS = [
  { icon: Monitor,    label: 'Browser',   sub: 'Chrome v121', bg: 'bg-blue-50',    border: 'border-blue-300',   text: 'text-blue-700',   pktColor: '#3b82f6', pktIcon: FileJson,  pktLabel: 'GET /api' },
  { icon: Smartphone, label: 'iOS App',   sub: 'Swift v3.2',  bg: 'bg-purple-50',  border: 'border-purple-300', text: 'text-purple-700', pktColor: '#8b5cf6', pktIcon: FileJson,  pktLabel: 'POST /data' },
  { icon: Tablet,     label: 'Android',   sub: 'React Native',bg: 'bg-emerald-50', border: 'border-emerald-300',text: 'text-emerald-700',pktColor: '#10b981', pktIcon: Code2,     pktLabel: '{query}' },
  { icon: Terminal,   label: 'Bot Script',sub: '⚠ Automated', bg: 'bg-amber-50',   border: 'border-amber-300',  text: 'text-amber-700',  pktColor: '#f59e0b', pktIcon: Code2,     pktLabel: 'FLOOD' },
  { icon: Radio,      label: 'IoT Sensor',sub: 'MQTT Bridge',  bg: 'bg-rose-50',    border: 'border-rose-300',   text: 'text-rose-700',   pktColor: '#ef4444', pktIcon: Activity,  pktLabel: 'PING×99' },
];

interface Pkt { id: number; lane: number; blocked: boolean; }

function DosTab() {
  const [packets, setPackets] = useState<Pkt[]>([]);
  const [devState, setDevState] = useState<('idle'|'active'|'blocked')[]>(DEVICE_CFGS.map(() => 'idle'));
  const [attacking, setAttacking] = useState(false);
  const [stats, setStats] = useState({ passed: 0, blocked: 0 });
  const qRef = useRef(0);

  const spawn = useCallback(() => {
    const lane = Math.floor(Math.random() * DEVICE_CFGS.length);
    const THRESHOLD = attacking ? 2 : 4;
    const blocked = qRef.current >= THRESHOLD;
    if (!blocked) qRef.current++;
    const id = uid();

    setPackets(p => [...p.slice(-20), { id, lane, blocked }]);
    setStats(s => blocked ? { ...s, blocked: s.blocked + 1 } : { ...s, passed: s.passed + 1 });
    setDevState(s => s.map((v, i) => i === lane ? (blocked ? 'blocked' : 'active') : v));

    setTimeout(() => {
      setDevState(s => s.map((v, i) => i === lane ? 'idle' : v));
      if (!blocked) qRef.current = Math.max(0, qRef.current - 1);
    }, blocked ? 900 : 1600);

    setTimeout(() => setPackets(p => p.filter(pk => pk.id !== id)), 2000);
  }, [attacking]);

  useEffect(() => {
    const iv = setInterval(spawn, attacking ? 200 : 1300);
    return () => clearInterval(iv);
  }, [attacking, spawn]);

  const guardStatus = qRef.current >= (attacking ? 2 : 4) ? 'danger' : 'ok';

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => { setAttacking(false); setStats({ passed: 0, blocked: 0 }); qRef.current = 0; }}
          className={`px-4 py-2 rounded-xl text-sm font-black border-2 transition-all ${!attacking ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
          ✓ Normal Traffic
        </button>
        <button onClick={() => setAttacking(true)}
          className={`px-4 py-2 rounded-xl text-sm font-black border-2 transition-all ${attacking ? 'bg-rose-600 text-white border-rose-700 animate-pulse shadow-lg shadow-rose-200' : 'bg-white text-slate-500 border-slate-200 hover:border-rose-300 hover:text-rose-600'}`}>
          ⚡ Simulate DDoS Attack
        </button>
        <div className="ml-auto flex gap-3">
          <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 rounded-xl text-[11px] font-black text-emerald-700">✓ {stats.passed} passed</div>
          <div className="px-3 py-1.5 bg-rose-50   border border-rose-300   rounded-xl text-[11px] font-black text-rose-700">  ✕ {stats.blocked} blocked</div>
        </div>
      </div>

      {/* Canvas */}
      <div className="overflow-x-auto rounded-2xl border-2 border-slate-100 bg-[#f8fafc]">
        <div className="flex gap-0" style={{ minWidth: 700 }}>

          {/* Device column — 160px fixed */}
          <div className="flex flex-col flex-shrink-0 w-40 py-2">
            {DEVICE_CFGS.map((d, i) => {
              const st = devState[i];
              return (
                <motion.div key={i}
                  animate={st === 'blocked' ? { x: [-3, 3, -3, 3, 0], borderColor: '#ef4444', backgroundColor: '#fef2f2' }
                          : st === 'active'  ? { borderColor: d.border.replace('border-',''), scale: 1.03 }
                          : { x: 0, borderColor: '#e2e8f0', scale: 1 }}
                  transition={{ duration: 0.35 }}
                  className={`relative mx-2 my-1.5 px-3 py-2 rounded-xl border-2 flex items-center gap-2 ${d.bg} ${d.border} transition-colors`}
                  style={{ height: LANE_H - 12 }}
                >
                  <d.icon size={18} className={`${d.text} flex-shrink-0`} />
                  <div className="min-w-0">
                    <div className="text-[10px] font-black text-slate-800 leading-none truncate">{d.label}</div>
                    <div className="text-[8px] font-bold text-slate-400 uppercase truncate">{d.sub}</div>
                  </div>
                  {st === 'blocked' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 rounded-full border-2 border-white flex items-center justify-center shadow">
                      <XCircle size={10} className="text-white" />
                    </motion.div>
                  )}
                  {st === 'active' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center shadow">
                      <span className="text-white text-[8px] font-black">→</span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Animation band — relative container for packets */}
          <div className="relative flex-1" style={{ height: CANVAS_H }}>
            {/* Lane dashed guide lines */}
            {DEVICE_CFGS.map((_, i) => (
              <div key={i} className="absolute border-t border-dashed border-slate-200"
                style={{ top: i * LANE_H + LANE_H / 2, left: 0, right: 0 }} />
            ))}

            {/* Packets */}
            <AnimatePresence>
              {packets.map(pk => {
                const cfg = DEVICE_CFGS[pk.lane];
                const PktIcon = cfg.pktIcon;
                const y = pk.lane * LANE_H + LANE_H / 2 - 14;
                return (
                  <motion.div key={pk.id}
                    initial={{ x: PKT_START, opacity: 1 }}
                    animate={pk.blocked
                      ? { x: [PKT_START, GUARD_DELTA, PKT_START - 20], opacity: [1, 1, 0] }
                      : { x: [PKT_START, GUARD_DELTA, SERVER_DELTA, SERVER_DELTA + 40], opacity: [1, 1, 1, 0] }}
                    transition={{ duration: pk.blocked ? 1.2 : 1.8, times: pk.blocked ? [0, 0.45, 1] : [0, 0.4, 0.75, 1], ease: 'easeInOut' }}
                    className="absolute flex flex-col items-center gap-0.5 pointer-events-none z-10"
                    style={{ top: y, left: 0 }}>
                    <div className="text-white rounded-lg px-2 py-1 flex items-center gap-1 shadow-lg text-[9px] font-black border border-white/20"
                      style={{ background: pk.blocked ? '#ef4444' : cfg.pktColor }}>
                      <PktIcon size={9} />
                      {cfg.pktLabel}
                    </div>
                    {pk.blocked && (
                      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }}
                        className="text-[8px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 leading-none">
                        BLOCKED
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Guard box — positioned at GUARD_DELTA */}
          <div className="flex flex-col items-center justify-center gap-2 flex-shrink-0 w-28 border-l border-dashed border-slate-200">
            <motion.div
              animate={guardStatus === 'danger' ? { boxShadow: ['0 0 0px #ef4444', '0 0 20px #ef4444', '0 0 0px #ef4444'] } : {}}
              transition={{ repeat: Infinity, duration: 0.7 }}
              className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 w-full mx-2 text-center transition-all ${guardStatus === 'danger' ? 'bg-rose-50 border-rose-400' : 'bg-orange-50 border-orange-300'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${guardStatus === 'danger' ? 'bg-rose-200' : 'bg-orange-100'}`}>
                <Activity size={20} className={guardStatus === 'danger' ? 'text-rose-600' : 'text-orange-600'} />
              </div>
              <span className="text-[9px] font-black text-slate-700 uppercase leading-tight">Rate Limiter</span>
              <div className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase ${guardStatus === 'danger' ? 'bg-rose-200 text-rose-700' : 'bg-orange-100 text-orange-700'}`}>
                {guardStatus === 'danger' ? '🔴 OVERLOAD' : '🟢 OK'}
              </div>
              {/* Queue bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                <motion.div animate={{ width: `${Math.min(qRef.current / 4 * 100, 100)}%` }}
                  className={`h-full rounded-full ${guardStatus === 'danger' ? 'bg-rose-500' : 'bg-orange-400'}`} />
              </div>
            </motion.div>
          </div>

          {/* Server box */}
          <div className="flex flex-col items-center justify-center gap-2 flex-shrink-0 w-28 border-l border-dashed border-slate-200">
            <div className="flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 bg-emerald-50 border-emerald-300 w-full mx-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Server size={20} className="text-emerald-600" />
              </div>
              <span className="text-[9px] font-black text-slate-700 uppercase leading-tight">Origin Server</span>
              <div className="text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase bg-emerald-100 text-emerald-700">🟢 ACTIVE</div>
            </div>
          </div>

        </div>
      </div>

      {attacking && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-rose-950 border border-rose-700 font-mono text-xs text-rose-300 flex items-start gap-3">
          <AlertCircle size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
          <span>DDoS Attack detected — Rate Limiter in OVERLOAD. Requests exceeding threshold ({'>'}2/200ms) are dropped with HTTP 429 Too Many Requests. Legitimate traffic from trusted IPs may still pass through a whitelist policy.</span>
        </motion.div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TAB 2 — Validation — Scanner-style
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const VAL_CASES = [
  {
    label: '✓ Valid JSON', ok: true,
    payload: '{\n  "username": "alice",\n  "age": 28,\n  "role": "user"\n}',
    rules: [
      { rule: 'JSON Schema', detail: 'username: string ✓, age: number ✓, role: enum ✓', pass: true },
      { rule: 'Length Check', detail: 'Payload 82 bytes — within 10KB limit ✓', pass: true },
      { rule: 'Type Coercion', detail: 'No unexpected type coercion detected ✓', pass: true },
    ],
    response: '200 OK — Forwarded to Business Logic',
  },
  {
    label: '✗ SQL Injection', ok: false,
    payload: "{\n  \"username\": \"' OR 1=1--\",\n  \"password\": \"anything\"\n}",
    rules: [
      { rule: 'JSON Schema', detail: 'username: string ✓ (syntactically valid)', pass: true },
      { rule: 'Length Check', detail: 'Payload 52 bytes — within limit ✓', pass: true },
      { rule: 'SQL Pattern', detail: "Dangerous pattern detected: \\' OR 1=1-- ✗", pass: false },
    ],
    response: "400 Bad Request — SQL injection pattern in 'username'",
  },
  {
    label: '✗ XSS Attack', ok: false,
    payload: '{\n  "comment": "<script>\\n    document.cookie=\'x\'\\n  </script>"\n}',
    rules: [
      { rule: 'JSON Schema', detail: 'comment: string ✓', pass: true },
      { rule: 'XSS Pattern', detail: '<script> tag detected in "comment" field ✗', pass: false },
      { rule: 'HTML Encoding', detail: 'Unescaped HTML entities found ✗', pass: false },
    ],
    response: '400 Bad Request — XSS payload detected in request body',
  },
  {
    label: '✗ Missing Fields', ok: false,
    payload: '{\n  "email": "bob@example.com"\n  // missing: username, password\n}',
    rules: [
      { rule: 'JSON Schema', detail: 'Required field "username" missing ✗', pass: false },
      { rule: 'JSON Schema', detail: 'Required field "password" missing ✗', pass: false },
      { rule: 'Length Check', detail: 'N/A — Schema failed first ✗', pass: false },
    ],
    response: '422 Unprocessable Entity — Missing required fields: username, password',
  },
];

function ValidationTab() {
  const [sel, setSel] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [rulesDone, setRulesDone] = useState<boolean[]>([]);
  const ex = VAL_CASES[sel];

  const scan = () => {
    setRulesDone([]);
    setScanning(true);
    ex.rules.forEach((_, i) => setTimeout(() => setRulesDone(p => [...p, true]), 700 * (i + 1)));
    setTimeout(() => setScanning(false), 700 * ex.rules.length + 400);
  };

  useEffect(() => setRulesDone([]), [sel]);

  return (
    <div className="flex flex-col gap-5">
      {/* Case picker */}
      <div className="flex flex-wrap gap-2">
        {VAL_CASES.map((c, i) => (
          <button key={i} onClick={() => { setSel(i); setRulesDone([]); setScanning(false); }}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-black border-2 transition-all ${sel === i ? (c.ok ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-rose-600 text-white border-rose-700') : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
            {c.label}
          </button>
        ))}
        <button onClick={scan} disabled={scanning}
          className={`ml-auto px-5 py-1.5 rounded-xl text-[11px] font-black border-2 transition-all ${scanning ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-wait' : 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700 shadow-lg shadow-blue-200'}`}>
          {scanning ? '⏳ Scanning...' : '▶ Run Validator'}
        </button>
      </div>

      {/* Main visual: 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Col 1: Payload */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <FileJson size={12} /> Raw Payload (Request Body)
          </div>
          <div className="flex-1 bg-slate-900 rounded-2xl p-4 font-mono text-[11px] text-slate-300 border border-slate-700 leading-relaxed relative overflow-hidden">
            <pre className="whitespace-pre-wrap break-all">{ex.payload}</pre>
            {scanning && (
              <motion.div
                initial={{ top: 0 }} animate={{ top: '110%' }}
                transition={{ duration: 1.6, ease: 'linear', repeat: Infinity, repeatDelay: 0.5 }}
                className="absolute left-0 right-0 h-6 pointer-events-none"
                style={{ background: 'linear-gradient(180deg, transparent, rgba(59,130,246,0.3), transparent)' }}
              />
            )}
          </div>
        </div>

        {/* Col 2: Rules being evaluated */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <ShieldAlert size={12} /> Security Rules Engine
          </div>
          <div className="flex flex-col gap-2 flex-1">
            {ex.rules.map((rule, i) => {
              const visible = rulesDone.length > i;
              return (
                <div key={i} className="relative">
                  <AnimatePresence>
                    {visible ? (
                      <motion.div key="done"
                        initial={{ opacity: 0, x: -10, height: 0 }} animate={{ opacity: 1, x: 0, height: 'auto' }}
                        transition={{ duration: 0.35 }}
                        className={`p-3 rounded-xl border-2 flex items-start gap-2.5 ${rule.pass ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-400'}`}>
                        {rule.pass
                          ? <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                          : <XCircle size={14} className="text-rose-500 flex-shrink-0 mt-0.5" />}
                        <div>
                          <span className="text-[10px] font-black text-slate-800 uppercase block">{rule.rule}</span>
                          <span className="text-[9px] font-medium text-slate-500 block mt-0.5">{rule.detail}</span>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="p-3 rounded-xl border-2 border-slate-100 bg-slate-50 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-200 flex-shrink-0" />
                        <span className="text-[10px] font-black text-slate-300 uppercase">{rule.rule}</span>
                      </div>
                    )}
                  </AnimatePresence>
                  {scanning && !visible && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity }}
                      className="absolute inset-0 rounded-xl border-2 border-blue-400 pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Col 3: Response */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <Server size={12} /> HTTP Response
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 min-h-[120px]">
            {rulesDone.length === ex.rules.length && rulesDone.length > 0 ? (
              <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300 }}
                className="flex flex-col items-center gap-3 text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-xl ${ex.ok ? 'bg-emerald-100 border-emerald-400 shadow-emerald-200' : 'bg-rose-100 border-rose-400 shadow-rose-200'}`}>
                  {ex.ok ? <CheckCircle2 size={32} className="text-emerald-600" /> : <XCircle size={32} className="text-rose-600" />}
                </div>
                <div className={`px-4 py-2 rounded-xl font-mono text-xs font-black border-2 ${ex.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800'}`}>
                  {ex.response}
                </div>
              </motion.div>
            ) : (
              <div className="text-slate-300 text-[10px] font-bold uppercase tracking-widest text-center">Awaiting validator...</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TAB 3 — Middleware Chain — Large flow
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const MW = [
  { icon: Wifi,      label: 'Incoming', sub: 'req arrives',     color: 'bg-blue-100',   border: 'border-blue-400',   detail: 'Raw HTTP request enters the API Gateway. Headers, method, and URL are parsed.' },
  { icon: Activity,  label: 'Rate Limit',sub: 'req/sec check',  color: 'bg-orange-100', border: 'border-orange-400', detail: 'IP-based rate limiting: 100 req/min by default. Burst protection prevents flooding.' },
  { icon: FileCheck, label: 'Body Parse',sub: 'schema check',   color: 'bg-amber-100',  border: 'border-amber-400',  detail: 'JSON body parsed, validated against OpenAPI schema. Rejects malformed or dangerous input.' },
  { icon: UserCheck, label: 'Auth Verify',sub: 'JWT/Cookie',    color: 'bg-purple-100', border: 'border-purple-400', detail: 'JWT signature verified with server secret. Claims extracted: userId, role, exp.' },
  { icon: Key,       label: 'Authz Check',sub: 'RBAC policy',   color: 'bg-indigo-100', border: 'border-indigo-400', detail: 'Policy engine evaluates: user.role vs resource.requiredRole. Scoped permissions enforced.' },
  { icon: Server,    label: 'Handler',   sub: 'business logic', color: 'bg-emerald-100',border: 'border-emerald-400',detail: 'Route handler executes business logic. Calls services, reads/writes DB, returns response.' },
];

function MiddlewareTab() {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);

  const run = () => {
    setStep(-1); setRunning(true);
    MW.forEach((_, i) => setTimeout(() => setStep(i), 700 * (i + 1)));
    setTimeout(() => setRunning(false), 700 * MW.length + 400);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <button onClick={run} disabled={running}
          className={`px-5 py-2.5 rounded-xl text-sm font-black border-2 transition-all ${running ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-blue-600 text-white border-blue-700 shadow-lg shadow-blue-200 hover:bg-blue-700'}`}>
          {running ? '⏳ Request traversing...' : '▶ Fire a Request Through the Chain'}
        </button>
        {step >= 0 && (
          <div className="ml-auto text-[11px] font-black text-slate-500 uppercase tracking-widest">
            Step {step + 1} / {MW.length}
          </div>
        )}
      </div>

      {/* Pipeline */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-0 min-w-[860px]">
          {MW.map((mw, i) => {
            const active = step === i, done = step > i;
            return (
              <div key={i} className="flex items-center flex-1 min-w-[130px]">
                <motion.div
                  animate={active ? { y: -8, scale: 1.06 } : { y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className={`flex-1 flex flex-col items-center gap-3 p-5 rounded-2xl border-2 mx-1 relative transition-all duration-200
                    ${active ? mw.color + ' ' + mw.border + ' shadow-xl' : done ? 'bg-slate-50 border-slate-100 opacity-50' : 'bg-white border-slate-200'}`}>
                  {/* Step number */}
                  <div className={`absolute -top-3 -right-3 w-6 h-6 rounded-full text-[9px] font-black text-white flex items-center justify-center shadow ${active ? 'bg-blue-600' : done ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                    {done ? '✓' : i + 1}
                  </div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border ${active ? 'bg-white border-white shadow-md' : 'bg-slate-50 border-slate-100'}`}>
                    <mw.icon size={22} className={active ? 'text-slate-800' : done ? 'text-slate-400' : 'text-slate-300'} />
                  </div>
                  <div className="text-center">
                    <span className={`text-[11px] font-black leading-tight block ${active ? 'text-slate-900' : done ? 'text-slate-400' : 'text-slate-300'}`}>{mw.label}</span>
                    <span className={`text-[8px] font-bold uppercase tracking-tighter block mt-0.5 ${active ? 'text-slate-500' : 'text-slate-300'}`}>{mw.sub}</span>
                  </div>
                </motion.div>
                {i < MW.length - 1 && (
                  <motion.div animate={done ? { color: '#10b981' } : active ? { color: '#3b82f6' } : { color: '#d1d5db' }} className="font-black text-xl flex-shrink-0">›</motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {step >= 0 && (
          <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            className={`p-5 rounded-2xl border-2 ${MW[step].color} ${MW[step].border}`}>
            <div className="flex items-center gap-3 mb-2">
              {(() => { const Icon = MW[step].icon; return <Icon size={18} className="text-slate-700" />; })()}
              <span className="font-black text-slate-900 text-sm">{MW[step].label}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase bg-white px-2 py-0.5 rounded-full border ml-auto">Step {step + 1}</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">{MW[step].detail}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TAB 4 — Authentication — 4 scenarios
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const AUTHN_SCENARIOS = [
  {
    label: '✓ Login Success', color: 'emerald',
    steps: [
      { from: 0, to: 1, label: 'POST /login', payload: '{"user":"alice","pass":"••••"}', color: '#3b82f6', icon: User },
      { from: 1, to: 2, label: 'SQL Lookup', payload: 'SELECT * FROM users WHERE email=? LIMIT 1', color: '#8b5cf6', icon: Database },
      { from: 2, to: 1, label: 'Row Found', payload: '{ id:42, role:"admin", hash:"$2b$..." }', color: '#10b981', icon: CheckCircle2 },
      { from: 1, to: 1, label: 'bcrypt.compare()', payload: 'Verify password hash — match ✓', color: '#059669', icon: Lock, self: true },
      { from: 1, to: 0, label: 'JWT Issued', payload: 'eyJhbGci.eyJzdWIiOiI0Mn0.SflK...', color: '#f59e0b', icon: Key },
      { from: 0, to: 3, label: 'Stored in localStorage', payload: 'key: "auth_token" ← JWT saved', color: '#6366f1', icon: HardDrive },
    ],
    result: 'User authenticated. JWT token (exp: 24h) issued and stored client-side.',
  },
  {
    label: '✗ Wrong Password', color: 'rose',
    steps: [
      { from: 0, to: 1, label: 'POST /login', payload: '{"user":"alice","pass":"wrong123"}', color: '#3b82f6', icon: User },
      { from: 1, to: 2, label: 'SQL Lookup', payload: 'SELECT * FROM users WHERE email=?', color: '#8b5cf6', icon: Database },
      { from: 2, to: 1, label: 'Row Found', payload: '{ id:42, hash:"$2b$..." }', color: '#10b981', icon: CheckCircle2 },
      { from: 1, to: 1, label: 'bcrypt.compare()', payload: 'Hash mismatch ✗ — reject!', color: '#ef4444', icon: XCircle, self: true },
      { from: 1, to: 0, label: '401 Unauthorized', payload: '{"error":"Invalid credentials"}', color: '#ef4444', icon: AlertCircle },
    ],
    result: '401 Unauthorized — Password hash mismatch. Generic error to prevent username enumeration.',
  },
  {
    label: '⏰ Token Expired', color: 'amber',
    steps: [
      { from: 0, to: 1, label: 'GET /api/data', payload: 'Authorization: Bearer eyJhbGci... (old)', color: '#3b82f6', icon: Lock },
      { from: 1, to: 1, label: 'jwt.verify()', payload: 'Check signature OK. Check exp: 1708000000 ✗ EXPIRED', color: '#f59e0b', icon: AlertCircle, self: true },
      { from: 1, to: 0, label: '401 Token Expired', payload: '{"error":"Token expired","code":"JWT_EXP"}', color: '#f59e0b', icon: AlertCircle },
      { from: 0, to: 1, label: 'POST /auth/refresh', payload: '{ refreshToken: "eyJ..." }', color: '#10b981', icon: Key },
      { from: 1, to: 0, label: 'New JWT Issued', payload: 'eyJhbGci.eyJuZXci0.newToken...', color: '#10b981', icon: CheckCircle2 },
    ],
    result: '401 Expired → Client uses Refresh Token → New JWT issued without re-login.',
  },
  {
    label: '🔒 No Token', color: 'slate',
    steps: [
      { from: 0, to: 1, label: 'GET /api/profile', payload: '(no Authorization header)', color: '#94a3b8', icon: Unlock },
      { from: 1, to: 1, label: 'Auth Middleware', payload: 'req.headers.authorization === undefined', color: '#ef4444', icon: ShieldAlert, self: true },
      { from: 1, to: 0, label: '401 Challenge', payload: 'WWW-Authenticate: Bearer realm="api"', color: '#ef4444', icon: AlertCircle },
    ],
    result: '401 Unauthorized — No credentials. Auth Middleware calls ChallengeAsync() immediately.',
  },
];

const ACTORS = [
  { label: 'Browser / Client', icon: Monitor, bg: 'bg-blue-50', border: 'border-blue-300' },
  { label: 'Auth Server', icon: ShieldCheck, bg: 'bg-indigo-50', border: 'border-indigo-300' },
  { label: 'Database', icon: Database, bg: 'bg-violet-50', border: 'border-violet-300' },
  { label: 'localStorage', icon: HardDrive, bg: 'bg-emerald-50', border: 'border-emerald-300' },
];
const ACTOR_W_PCT = [12, 40, 68, 92]; // percent positions

function AuthNTab() {
  const [scene, setScene] = useState(0);
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const sc = AUTHN_SCENARIOS[scene];

  const runFlow = () => {
    setStep(-1); setRunning(true);
    sc.steps.forEach((_, i) => setTimeout(() => setStep(i), 800 * (i + 1)));
    setTimeout(() => setRunning(false), 800 * sc.steps.length + 300);
  };

  useEffect(() => { setStep(-1); setRunning(false); }, [scene]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {AUTHN_SCENARIOS.map((s, i) => (
          <button key={i} onClick={() => setScene(i)}
            className={`px-3 py-2 rounded-xl text-[11px] font-black border-2 transition-all ${scene === i ? `bg-${s.color}-600 text-white border-${s.color}-700` : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
            style={scene === i ? { background: s.color === 'emerald' ? '#059669' : s.color === 'rose' ? '#e11d48' : s.color === 'amber' ? '#d97706' : '#475569' } : {}}>
            {s.label}
          </button>
        ))}
        <button onClick={runFlow} disabled={running}
          className={`ml-auto px-5 py-2 rounded-xl text-[11px] font-black border-2 ${running ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-blue-600 text-white border-blue-700 shadow-lg shadow-blue-200'}`}>
          {running ? '⏳ Simulating...' : '▶ Play Flow'}
        </button>
      </div>

      {/* Sequence diagram */}
      <div className="relative rounded-2xl border-2 border-slate-100 bg-[#f8fafc] p-6 min-h-[280px]" style={{ overflow: 'hidden' }}>
        {/* Actors at top */}
        <div className="flex justify-around mb-6">
          {ACTORS.map((a, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5" style={{ width: '22%' }}>
              <div className={`w-12 h-12 rounded-2xl border-2 ${a.bg} ${a.border} flex items-center justify-center shadow-sm`}>
                <a.icon size={22} className="text-slate-600" />
              </div>
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter text-center leading-tight">{a.label}</span>
            </div>
          ))}
        </div>

        {/* Lifelines */}
        {ACTOR_W_PCT.map((pct, i) => (
          <div key={i} className="absolute top-[100px] bottom-4 border-l-2 border-dashed border-slate-200 pointer-events-none" style={{ left: `${pct}%` }} />
        ))}

        {/* Steps */}
        <div className="flex flex-col gap-2 mt-1">
          <AnimatePresence>
            {sc.steps.map((s, i) => {
              if (step < i) return null;
              const isSelf = s.from === s.to;
              const from = ACTOR_W_PCT[s.from];
              const to = ACTOR_W_PCT[s.to];
              const leftPct = isSelf ? from - 1 : Math.min(from, to);
              const widthPct = isSelf ? 8 : Math.abs(to - from);
              const toRight = to >= from;
              const PktIcon = s.icon;
              const bg = s.color;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className={`relative ${isSelf ? 'h-12' : 'h-9'}`}>
                  {/* Self-loop: show as a pill badge centered on actor */}
                  {isSelf ? (
                    <div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: `${from - 4}%`, width: '12%' }}>
                      <div className="text-white rounded-lg px-2 py-1 flex items-center gap-1 text-[8px] font-black shadow-md border border-white/20 leading-tight"
                        style={{ background: bg }}>
                        <PktIcon size={8} />
                        <span className="truncate">{s.label}</span>
                      </div>
                      <div className="text-[7px] text-slate-400 mt-0.5 truncate max-w-[100%] text-center px-1">↩ {s.payload}</div>
                    </div>
                  ) : (
                    <>
                      {/* Arrow line */}
                      <div className="absolute top-1/2 -translate-y-1/2"
                        style={{ left: `${leftPct + 1}%`, width: `${Math.max(widthPct - 2, 2)}%` }}>
                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                          className="w-full h-0.5 rounded"
                          style={{ background: bg, transformOrigin: toRight ? 'left' : 'right' }} />
                        <div className={`absolute top-1/2 -translate-y-1/2 ${toRight ? 'right-0' : 'left-0'}`}
                          style={{ color: bg, transform: `translateY(-50%) ${!toRight ? 'rotate(180deg)' : 'none'}` }}>
                          <svg width="8" height="8" viewBox="0 0 8 8"><path d="M0 0L8 4L0 8Z" fill="currentColor" /></svg>
                        </div>
                      </div>
                      {/* Label */}
                      <div className="absolute top-0 flex flex-col items-center"
                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}>
                        <div className="text-white rounded-md px-2 py-0.5 flex items-center gap-1 text-[8px] font-black shadow-md overflow-hidden max-w-full"
                          style={{ background: bg }}>
                          <PktIcon size={8} />
                          <span className="truncate">{s.label}</span>
                          <span className="opacity-75 truncate max-w-[80px] hidden sm:inline"> — {s.payload}</span>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Result */}
      {step >= sc.steps.length - 1 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border-2 font-mono text-xs leading-relaxed ${sc.color === 'emerald' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : sc.color === 'rose' ? 'bg-rose-50 border-rose-300 text-rose-900' : sc.color === 'amber' ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-slate-100 border-slate-300 text-slate-700'}`}>
          {sc.result}
        </motion.div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TAB 5 — Authorization
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ROLES = [
  { role: 'Admin', icon: ShieldCheck, color: 'bg-violet-100 border-violet-400', httpStatus: '200 OK',
    access: { '/admin/panel': true, '/api/users': true, '/api/billing': true, '/api/reports': true } },
  { role: 'Manager', icon: User, color: 'bg-blue-100 border-blue-400', httpStatus: '200 / 403',
    access: { '/admin/panel': false, '/api/users': true, '/api/billing': false, '/api/reports': true } },
  { role: 'Guest', icon: Unlock, color: 'bg-slate-100 border-slate-400', httpStatus: '200 / 403',
    access: { '/admin/panel': false, '/api/users': false, '/api/billing': false, '/api/reports': false } },
  { role: 'No Auth', icon: AlertCircle, color: 'bg-rose-100 border-rose-400', httpStatus: '401',
    access: { '/admin/panel': false, '/api/users': false, '/api/billing': false, '/api/reports': false } },
];

function AuthZTab() {
  const [sel, setSel] = useState(0);
  const [resource, setResource] = useState('/api/users');
  const role = ROLES[sel];
  const allowed = role.access[resource as keyof typeof role.access];
  const isNoAuth = role.role === 'No Auth';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {ROLES.map((r, i) => (
          <button key={i} onClick={() => setSel(i)}
            className={`px-4 py-2 rounded-xl text-xs font-black border-2 flex items-center gap-2 transition-all ${sel === i ? r.color : 'bg-white border-slate-200 text-slate-500'}`}>
            <r.icon size={14} />
            {r.role}
          </button>
        ))}
      </div>

      <div className="flex items-stretch gap-6 flex-wrap">
        {/* User */}
        <div className="flex flex-col items-center gap-2">
          <motion.div key={sel} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
            className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center ${role.color}`}>
            <role.icon size={28} className="text-slate-700" />
          </motion.div>
          <span className="text-[11px] font-black text-slate-800">{role.role}</span>
          <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full border ${isNoAuth ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}>
            {isNoAuth ? 'Anonymous' : 'JWT Verified'}
          </span>
        </div>

        <div className="text-slate-300 font-black text-2xl self-center">→→</div>

        {/* Resource picker */}
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select Endpoint</span>
          {Object.keys(role.access).map(r => (
            <button key={r} onClick={() => setResource(r)}
              className={`px-3 py-2 rounded-xl text-[11px] font-mono font-bold border-2 transition-all text-left ${resource === r ? 'bg-slate-900 text-white border-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
              {r}
            </button>
          ))}
        </div>

        <div className="text-slate-300 font-black text-2xl self-center">→→</div>

        {/* Result */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 min-w-[200px]">
          <AnimatePresence mode="wait">
            <motion.div key={`${sel}-${resource}`}
              initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="flex flex-col items-center gap-3">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-xl ${isNoAuth ? 'bg-amber-50 border-amber-400 shadow-amber-100' : allowed ? 'bg-emerald-100 border-emerald-500 shadow-emerald-100' : 'bg-rose-100 border-rose-500 shadow-rose-100'}`}>
                {isNoAuth ? <AlertCircle size={36} className="text-amber-500" /> : allowed ? <CheckCircle2 size={36} className="text-emerald-600" /> : <XCircle size={36} className="text-rose-600" />}
              </div>
              <div className={`px-5 py-2.5 rounded-2xl font-mono text-sm font-black border-2 shadow ${isNoAuth ? 'bg-amber-50 border-amber-300 text-amber-900' : allowed ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'}`}>
                {isNoAuth ? '401 Unauthorized' : allowed ? '200 OK — Access Granted' : '403 Forbidden'}
              </div>
              <p className="text-[10px] text-slate-400 font-medium text-center max-w-[200px]">
                {isNoAuth ? 'No JWT token. ChallengeAsync() called.' : allowed ? `${role.role} has permission for ${resource}` : `${role.role} lacks permission for ${resource}`}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Policy code */}
      <div className="bg-slate-900 rounded-2xl p-5 font-mono text-[11px] border border-slate-700">
        <div className="text-slate-500 mb-2 text-[9px] uppercase tracking-widest">// Policy evaluation for: {role.role} → {resource}</div>
        <div className="text-blue-400">if <span className="text-white">(user.isAuthenticated === false)</span> <span className="text-amber-300">return</span> <span className="text-rose-400">Challenge</span><span className="text-white">();  </span><span className="text-slate-500">// ← 401</span></div>
        <div className="text-blue-400 mt-1">if <span className="text-white">(policy.evaluate(user.role, resource) === false)</span> <span className="text-amber-300">return</span> <span className="text-rose-400">Forbid</span><span className="text-white">();  </span><span className="text-slate-500">// ← 403</span></div>
        <div className="text-emerald-400 mt-1"><span className="text-amber-300">return</span> <span className="text-white">next()</span>;  <span className="text-slate-500">// ← 200</span></div>
        <div className="mt-3 text-slate-500">// Result: <span className={isNoAuth ? 'text-amber-400' : allowed ? 'text-emerald-400' : 'text-rose-400'}>{isNoAuth ? '401 Unauthorized' : allowed ? '200 — Proceed' : '403 Forbidden'}</span></div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const TABS = [
  { id: 'dos',        label: 'DoS / Rate Limit',   icon: ShieldAlert },
  { id: 'validation', label: 'Validation',          icon: FileCheck   },
  { id: 'middleware', label: 'Middleware Chain',    icon: Layers      },
  { id: 'authn',      label: 'Authentication',      icon: UserCheck   },
  { id: 'authz',      label: 'Authorization',       icon: Key         },
];

export default function StandardSecurityFlow() {
  const [activeTab, setActiveTab] = useState('dos');
  return (
    <SectionWrapper className="my-16">
      <div className="mb-10 text-center">
        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-200 mb-4 inline-block">
          Interactive Security Simulator
        </span>
        <h2 className="text-4xl font-black tracking-tighter text-slate-900">RESTful WebService Defense</h2>
        <p className="text-slate-500 mt-2 font-medium">Animated — click each tab to simulate a real security scenario</p>
      </div>

      <div className="bg-white rounded-[40px] border-2 border-slate-100 shadow-2xl overflow-hidden">
        <div className="flex overflow-x-auto border-b-2 border-slate-100 bg-slate-50">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-tighter whitespace-nowrap border-b-2 transition-all ${activeTab === t.id ? 'border-blue-600 text-blue-700 bg-white shadow-sm' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}>
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}>
              {activeTab === 'dos'        && <DosTab />}
              {activeTab === 'validation' && <ValidationTab />}
              {activeTab === 'middleware' && <MiddlewareTab />}
              {activeTab === 'authn'      && <AuthNTab />}
              {activeTab === 'authz'      && <AuthZTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </SectionWrapper>
  );
}
