import React, { useState, useEffect } from 'react';
import { Zap, Power, Lightbulb, Activity, ArrowRight, Gauge } from 'lucide-react';

type CircuitMode = 'single' | 'series' | 'parallel';

export const CircuitLab: React.FC = () => {
  const [circuitMode, setCircuitMode] = useState<CircuitMode>('series');
  const [voltage, setVoltage] = useState<number>(12); // Volts
  const [r1, setR1] = useState<number>(4); // Ohms
  const [r2, setR2] = useState<number>(6); // Ohms
  const [isSwitchClosed, setIsSwitchClosed] = useState<boolean>(true);
  const [electronOffset, setElectronOffset] = useState<number>(0);

  // Resistance calculations
  let equivalentResistance = 0;
  let current = 0;
  let current1 = 0;
  let current2 = 0;
  let v1 = 0;
  let v2 = 0;

  if (circuitMode === 'single') {
    equivalentResistance = r1;
    current = isSwitchClosed ? voltage / equivalentResistance : 0;
    current1 = current;
    v1 = isSwitchClosed ? voltage : 0;
  } else if (circuitMode === 'series') {
    equivalentResistance = r1 + r2;
    current = isSwitchClosed ? voltage / equivalentResistance : 0;
    current1 = current;
    current2 = current;
    v1 = current * r1;
    v2 = current * r2;
  } else {
    // Parallel: 1/Req = 1/r1 + 1/r2 => Req = (r1*r2)/(r1+r2)
    equivalentResistance = (r1 * r2) / (r1 + r2);
    current = isSwitchClosed ? voltage / equivalentResistance : 0;
    current1 = isSwitchClosed ? voltage / r1 : 0;
    current2 = isSwitchClosed ? voltage / r2 : 0;
    v1 = isSwitchClosed ? voltage : 0;
    v2 = isSwitchClosed ? voltage : 0;
  }

  // Power dissipated (Watts)
  const totalPower = current * voltage;

  // Electron animation
  useEffect(() => {
    if (!isSwitchClosed || current <= 0.01) return;
    const interval = setInterval(() => {
      setElectronOffset((prev) => (prev + current * 0.8) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, [isSwitchClosed, current]);

  // Bulb brightness scale (0 to 1)
  const bulbBrightness = Math.min(1, Math.max(0, totalPower / 40));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Zap className="w-4 h-4" />
            <span>চলতড়িৎ ল্যাব · Class 10</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            ইন্টারেক্টিভ ইলেকট্রিক সার্কিট ও ওহমের সূত্র
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            ব্যাটারি, বাল্ব, সুইচ এবং রোধের শ্রেণি ও সমান্তরাল সমবায়ের কারেন্ট ও ভোল্টেজ পরীক্ষা করো।
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setCircuitMode('single')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              circuitMode === 'single'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            একক রোধ
          </button>
          <button
            onClick={() => setCircuitMode('series')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              circuitMode === 'series'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            শ্রেণি সমবায় (Series)
          </button>
          <button
            onClick={() => setCircuitMode('parallel')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              circuitMode === 'parallel'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            সমান্তরাল সমবায় (Parallel)
          </button>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 p-6 flex items-center justify-center min-h-[300px]">
        <svg viewBox="0 0 640 240" className="w-full max-w-[640px] h-auto">
          {/* Main Circuit Wires */}
          <path
            d="M 80 180 L 80 60 L 520 60 L 520 180 L 80 180"
            fill="none"
            stroke="#475569"
            strokeWidth="4"
          />

          {/* Animated Current (Electron flow dots) */}
          {isSwitchClosed && current > 0 && (
            <path
              d="M 80 180 L 80 60 L 520 60 L 520 180 L 80 180"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray="6 14"
              strokeDashoffset={-electronOffset}
              opacity="0.8"
            />
          )}

          {/* 1. Battery (Bottom Center) */}
          <g transform="translate(260, 160)">
            <rect x="-10" y="5" width="80" height="30" fill="#1e293b" rx="4" stroke="#64748b" strokeWidth="1.5" />
            <text x="30" y="24" fill="#f8fafc" fontSize="11" textAnchor="middle" fontWeight="bold">
              {voltage}V ব্যাটারি
            </text>
            {/* Battery terminals */}
            <line x1="15" y1="5" x2="15" y2="-5" stroke="#ef4444" strokeWidth="3" />
            <line x1="45" y1="5" x2="45" y2="-5" stroke="#3b82f6" strokeWidth="3" />
            <text x="15" y="-7" fill="#ef4444" fontSize="10" textAnchor="middle" fontWeight="bold">+</text>
            <text x="45" y="-7" fill="#3b82f6" fontSize="10" textAnchor="middle" fontWeight="bold">-</text>
          </g>

          {/* 2. Switch (Bottom Left) */}
          <g transform="translate(130, 180)">
            <circle cx="0" cy="0" r="4" fill="#cbd5e1" />
            <circle cx="40" cy="0" r="4" fill="#cbd5e1" />
            <line
              x1="0"
              y1="0"
              x2={isSwitchClosed ? 40 : 25}
              y2={isSwitchClosed ? 0 : -20}
              stroke="#fbbf24"
              strokeWidth="4"
            />
            <text x="20" y="22" fill="#94a3b8" fontSize="10" textAnchor="middle">
              {isSwitchClosed ? 'সুইচ ON' : 'সুইচ OFF'}
            </text>
          </g>

          {/* 3. Resistors & Bulb (Top Area) */}
          {circuitMode === 'single' ? (
            /* Single Resistor */
            <g transform="translate(300, 60)">
              <rect x="-35" y="-12" width="70" height="24" fill="#b45309" rx="3" stroke="#f59e0b" strokeWidth="2" />
              <text x="0" y="4" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">
                R₁ = {r1} Ω
              </text>
            </g>
          ) : circuitMode === 'series' ? (
            /* Series Resistors */
            <g transform="translate(0, 0)">
              {/* R1 */}
              <g transform="translate(220, 60)">
                <rect x="-30" y="-12" width="60" height="24" fill="#b45309" rx="3" stroke="#f59e0b" strokeWidth="2" />
                <text x="0" y="4" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">
                  R₁ = {r1} Ω
                </text>
                <text x="0" y="-18" fill="#38bdf8" fontSize="9" textAnchor="middle">
                  V₁ = {v1.toFixed(1)}V
                </text>
              </g>
              {/* R2 */}
              <g transform="translate(360, 60)">
                <rect x="-30" y="-12" width="60" height="24" fill="#7c3aed" rx="3" stroke="#a855f7" strokeWidth="2" />
                <text x="0" y="4" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">
                  R₂ = {r2} Ω
                </text>
                <text x="0" y="-18" fill="#38bdf8" fontSize="9" textAnchor="middle">
                  V₂ = {v2.toFixed(1)}V
                </text>
              </g>
            </g>
          ) : (
            /* Parallel Resistors */
            <g transform="translate(300, 60)">
              {/* Branch 1 */}
              <line x1="-80" y1="0" x2="-80" y2="-30" stroke="#475569" strokeWidth="3" />
              <line x1="-80" y1="-30" x2="80" y2="-30" stroke="#475569" strokeWidth="3" />
              <line x1="80" y1="-30" x2="80" y2="0" stroke="#475569" strokeWidth="3" />
              <rect x="-30" y="-42" width="60" height="24" fill="#b45309" rx="3" stroke="#f59e0b" strokeWidth="2" />
              <text x="0" y="-26" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">
                R₁ = {r1} Ω ({current1.toFixed(1)}A)
              </text>

              {/* Branch 2 */}
              <line x1="-80" y1="0" x2="-80" y2="30" stroke="#475569" strokeWidth="3" />
              <line x1="-80" y1="30" x2="80" y2="30" stroke="#475569" strokeWidth="3" />
              <line x1="80" y1="30" x2="80" y2="0" stroke="#475569" strokeWidth="3" />
              <rect x="-30" y="18" width="60" height="24" fill="#7c3aed" rx="3" stroke="#a855f7" strokeWidth="2" />
              <text x="0" y="34" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">
                R₂ = {r2} Ω ({current2.toFixed(1)}A)
              </text>
            </g>
          )}

          {/* 4. Glowing Bulb (Right side) */}
          <g transform="translate(520, 120)">
            {/* Filament aura glow */}
            {isSwitchClosed && bulbBrightness > 0.05 && (
              <circle
                cx="0"
                cy="0"
                r={16 + bulbBrightness * 25}
                fill="#facc15"
                opacity={bulbBrightness * 0.45}
              />
            )}
            <circle
              cx="0"
              cy="0"
              r="14"
              fill={isSwitchClosed && bulbBrightness > 0.05 ? '#fef08a' : '#334155'}
              stroke="#e2e8f0"
              strokeWidth="2"
            />
            {/* Filament shape */}
            <path
              d="M -5 6 L 0 -5 L 5 6"
              fill="none"
              stroke={isSwitchClosed && bulbBrightness > 0.05 ? '#ea580c' : '#64748b'}
              strokeWidth="2"
            />
            <text x="0" y="32" fill="#f8fafc" fontSize="10" fontWeight="bold" textAnchor="middle">
              বাল্ব ({totalPower.toFixed(1)} W)
            </text>
          </g>

          {/* 5. Ammeter (Left side) */}
          <g transform="translate(80, 120)">
            <circle cx="0" cy="0" r="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <text x="0" y="4" fill="#38bdf8" fontSize="12" textAnchor="middle" fontWeight="bold">
              A
            </text>
            <text x="-40" y="4" fill="#38bdf8" fontSize="10" fontWeight="bold">
              {current.toFixed(2)} A
            </text>
          </g>
        </svg>

        {/* Floating switch toggle */}
        <button
          onClick={() => setIsSwitchClosed(!isSwitchClosed)}
          className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${
            isSwitchClosed
              ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
              : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          {isSwitchClosed ? 'সুইচ বন্ধ করো (Turn OFF)' : 'সুইচ চালু করো (Turn ON)'}
        </button>
      </div>

      {/* Control Sliders & Real-Time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sliders */}
        <div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            বর্তনী পরামিতি নিয়ন্ত্রণ
          </h4>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-600 dark:text-slate-300">ভোল্টেজ (V)</span>
              <span className="font-mono text-amber-600 font-bold">{voltage} V</span>
            </div>
            <input
              type="range"
              min={2}
              max={24}
              step={1}
              value={voltage}
              onChange={(e) => setVoltage(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-600 dark:text-slate-300">প্রথম রোধ (R₁)</span>
              <span className="font-mono text-blue-600 font-bold">{r1} Ω</span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={r1}
              onChange={(e) => setR1(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          {circuitMode !== 'single' && (
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-600 dark:text-slate-300">দ্বিতীয় রোধ (R₂)</span>
                <span className="font-mono text-purple-600 font-bold">{r2} Ω</span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={r2}
                onChange={(e) => setR2(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
            </div>
          )}
        </div>

        {/* Live Digital Meters */}
        <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-4">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            ওহমের সূত্র ডিজিটাল মিটার ($V = IR$)
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block">তুল্য রোধ (Req)</span>
              <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                {equivalentResistance.toFixed(2)} Ω
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block">মোট তড়িৎপ্রবাহ (I)</span>
              <span className="font-mono text-base font-bold text-sky-600">
                {current.toFixed(2)} A
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block">মোট ক্ষমতা (P = VI)</span>
              <span className="font-mono text-base font-bold text-amber-500">
                {totalPower.toFixed(1)} W
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block">বর্তনী অবস্থা</span>
              <span
                className={`text-xs font-bold block mt-0.5 ${
                  isSwitchClosed ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {isSwitchClosed ? '● মুক্ত বর্তনী (কারেন্ট চালু)' : '○ বিচ্ছিন্ন বর্তনী (বন্ধ)'}
              </span>
            </div>
          </div>

          {/* Educational Insights Box */}
          <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-sky-500" />
              শ্রেণি বনাম সমান্তরাল সমবায়ের বৈশিষ্ট্য:
            </p>
            {circuitMode === 'series' ? (
              <p>
                • <strong>শ্রেণি সমবায়:</strong> তুল্য রোধ R_s = R₁ + R₂ = {r1} + {r2} = {r1 + r2} Ω (বৃদ্ধি পায়)। উভয়ের মধ্য দিয়ে একই প্রবাহমাত্রা ({current.toFixed(2)} A) চলছে, কিন্তু ভোল্টেজ ভাগ হয়ে গেছে (V₁ = {v1.toFixed(1)}V, V₂ = {v2.toFixed(1)}V)।
              </p>
            ) : circuitMode === 'parallel' ? (
              <p>
                • <strong>সমান্তরাল সমবায়:</strong> তুল্য রোধ 1/R_p = 1/R₁ + 1/R₂ ⇒ R_p = {equivalentResistance.toFixed(2)} Ω (সবচেয়ে ছোট রোধটির চেয়েও কম!)। উভয়ের দুই প্রান্তেই পূর্ণ {voltage}V ভোল্টেজ রয়েছে, কিন্তু কারেন্ট ভাগ হয়ে গেছে (I₁ = {current1.toFixed(2)}A, I₂ = {current2.toFixed(2)}A)।
              </p>
            ) : (
              <p>
                • <strong>একক রোধ:</strong> সরাসরি ওহমের সূত্র: I = V / R = {voltage} / {r1} = {current.toFixed(2)} A।
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
