import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Orbit, Activity, ShieldCheck } from 'lucide-react';

export const GravitationEnergyLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'energy' | 'gravitation'>('energy');

  // Mechanical Energy State
  const [towerHeight, setTowerHeight] = useState<number>(20); // meters
  const [ballMass, setBallMass] = useState<number>(2); // kg
  const [currentHeight, setCurrentHeight] = useState<number>(20);
  const [isFalling, setIsFalling] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // Gravitation State
  const [mass1, setMass1] = useState<number>(50); // in 10^22 kg units or relative
  const [mass2, setMass2] = useState<number>(30);
  const [distance, setDistance] = useState<number>(10); // in relative units

  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const g = 9.8; // m/s²

  // Calculate current kinetic and potential energy
  const currentPE = ballMass * g * currentHeight;
  const currentVelocity = Math.sqrt(Math.max(0, 2 * g * (towerHeight - currentHeight)));
  const currentKE = 0.5 * ballMass * currentVelocity * currentVelocity;
  const totalEnergy = ballMass * g * towerHeight;

  // Free fall loop
  useEffect(() => {
    if (!isFalling) {
      lastTimeRef.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = timestamp;

      setElapsedTime((prevT) => {
        const nextT = prevT + dt;
        const nextH = Math.max(0, towerHeight - 0.5 * g * nextT * nextT);
        setCurrentHeight(nextH);

        if (nextH <= 0) {
          setIsFalling(false);
          return Math.sqrt((2 * towerHeight) / g);
        }
        return nextT;
      });

      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isFalling, towerHeight, g]);

  const handleResetEnergy = () => {
    setIsFalling(false);
    setCurrentHeight(towerHeight);
    setElapsedTime(0);
    lastTimeRef.current = null;
  };

  // Gravitational force: F = G*(m1*m2)/r^2
  // Relative force calculation
  const relativeGravForce = (mass1 * mass2) / (distance * distance);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-2">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            মহাকর্ষ ও শক্তির নিত্যতা ল্যাব
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            স্থিতিশক্তি ও গতিশক্তির রূপান্তর এবং নিউটনের মহাকর্ষ সূত্রের আকর্ষণ বল পরীক্ষা।
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('energy')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'energy'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            শক্তির নিত্যতা (মুক্ত পতন)
          </button>
          <button
            onClick={() => setActiveTab('gravitation')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'gravitation'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            সার্বজনীন মহাকর্ষ সূত্র
          </button>
        </div>
      </div>

      {activeTab === 'energy' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Visual Falling Tower (4 cols) */}
            <div className="md:col-span-5 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 relative flex flex-col justify-between h-96">
              <div className="flex justify-between items-center text-xs font-medium text-slate-500">
                <span>উচ্চতা: {towerHeight}m</span>
                <span>বর্তমান উচ্চতা: {currentHeight.toFixed(1)}m</span>
              </div>

              {/* Tower Graphic */}
              <div className="relative flex-1 my-2 flex items-center justify-center">
                {/* Vertical ruler */}
                <div className="absolute left-6 top-2 bottom-4 w-1 bg-slate-300 dark:bg-slate-700"></div>
                {/* Ruler ticks */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
                  <div
                    key={i}
                    className="absolute left-4 text-[10px] text-slate-400 font-mono"
                    style={{ bottom: `${pct * 85 + 4}%` }}
                  >
                    — {(pct * towerHeight).toFixed(0)}m
                  </div>
                ))}

                {/* Ground */}
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-emerald-600/30 border-t-2 border-emerald-600 rounded-b-lg"></div>

                {/* Falling Ball */}
                <div
                  className="absolute w-8 h-8 rounded-full bg-red-500 shadow-md flex items-center justify-center text-white text-[10px] font-bold transition-all duration-75"
                  style={{
                    bottom: `${(currentHeight / towerHeight) * 82 + 4}%`,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  {ballMass}kg
                </div>

                {/* Speed vector arrow if moving */}
                {currentVelocity > 0.5 && (
                  <div
                    className="absolute text-rose-600 text-xs font-mono font-bold"
                    style={{
                      bottom: `${(currentHeight / towerHeight) * 82 - 2}%`,
                      left: '52%',
                    }}
                  >
                    ↓ {currentVelocity.toFixed(1)} m/s
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setIsFalling(!isFalling)}
                  className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  {isFalling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isFalling ? 'বিরতি' : 'বল ফেলে দিন'}
                </button>
                <button
                  onClick={handleResetEnergy}
                  className="p-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 rounded-lg text-slate-600"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Live Energy Bars & Controls (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              {/* Sliders */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-300 block mb-1">
                    টাওয়ারের উচ্চতা (H)
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    step={5}
                    value={towerHeight}
                    onChange={(e) => {
                      setTowerHeight(Number(e.target.value));
                      setCurrentHeight(Number(e.target.value));
                      setIsFalling(false);
                      setElapsedTime(0);
                    }}
                    className="w-full accent-indigo-600"
                  />
                  <span className="text-xs font-mono font-bold text-indigo-600">{towerHeight} m</span>
                </div>

                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-300 block mb-1">
                    বলের ভর (m)
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={ballMass}
                    onChange={(e) => setBallMass(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <span className="text-xs font-mono font-bold text-indigo-600">{ballMass} kg</span>
                </div>
              </div>

              {/* Energy Bars: PE vs KE */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    শক্তির নিত্যতা বারগ্রাফ (PE + KE = Constant)
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    মোট শক্তি: {Math.round(totalEnergy)} J
                  </span>
                </div>

                {/* Combined Progress Bar */}
                <div className="w-full h-8 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden flex shadow-inner">
                  <div
                    className="bg-blue-600 transition-all duration-75 flex items-center justify-center text-[11px] font-bold text-white overflow-hidden whitespace-nowrap"
                    style={{ width: `${(currentPE / totalEnergy) * 100}%` }}
                    title={`স্থিতিশক্তি: ${Math.round(currentPE)} J`}
                  >
                    {currentPE > totalEnergy * 0.15 && `PE: ${Math.round(currentPE)}J`}
                  </div>
                  <div
                    className="bg-emerald-500 transition-all duration-75 flex items-center justify-center text-[11px] font-bold text-white overflow-hidden whitespace-nowrap"
                    style={{ width: `${(currentKE / totalEnergy) * 100}%` }}
                    title={`গতিশক্তি: ${Math.round(currentKE)} J`}
                  >
                    {currentKE > totalEnergy * 0.15 && `KE: ${Math.round(currentKE)}J`}
                  </div>
                </div>

                <div className="flex justify-between text-xs font-medium">
                  <div className="flex items-center gap-1.5 text-blue-600">
                    <span className="w-3 h-3 bg-blue-600 rounded"></span>
                    <span>স্থিতিশক্তি (mgh): {Math.round(currentPE)} জুল</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <span className="w-3 h-3 bg-emerald-500 rounded"></span>
                    <span>গতিশক্তি (½mv²): {Math.round(currentKE)} জুল</span>
                  </div>
                </div>
              </div>

              {/* Key Concept Box */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg text-xs text-blue-900 dark:text-blue-300">
                <p className="font-bold mb-1">💡 পরীক্ষার জন্য মূল পর্যবেক্ষণ:</p>
                <p>
                  ১. সর্বোচ্চ চূড়ায় বেগ v = 0 হওয়ায় সমস্ত শক্তিই <strong>স্থিতিশক্তি (PE = mgh)</strong>।
                  <br />
                  ২. নিচে নামার সময় উচ্চতা কমায় স্থিতিশক্তি হ্রাস পায় এবং ঠিক সমপরিমাণ <strong>গতিশক্তি (KE = ½mv²) বৃদ্ধি পায়</strong>।
                  <br />
                  ৩. ভূমি স্পর্শ করার মুহূর্তে সমস্ত শক্তি গতিশক্তিতে পরিণত হয়। মোট যান্ত্রিক শক্তি সর্বদা ধ্রুবক থাকে!
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Gravitation Simulator */
        <div className="space-y-6">
          <div className="p-6 bg-slate-900 rounded-xl text-white relative overflow-hidden flex flex-col justify-between min-h-64">
            <div className="flex justify-between items-center z-10">
              <span className="text-xs text-slate-400">
                নিউটনের মহাকর্ষীয় আকর্ষণ বল: F = G (m₁·m₂) / r²
              </span>
              <span className="text-sm font-mono text-amber-400 font-bold">
                আপেক্ষিক আকর্ষণ বল: {relativeGravForce.toFixed(2)} ইউনিট
              </span>
            </div>

            {/* Orbit / 2 planet graphic */}
            <div className="relative flex items-center justify-center my-8 h-28">
              {/* Force line */}
              <div className="absolute h-0.5 bg-gradient-to-r from-blue-500 via-amber-400 to-indigo-500 w-2/3"></div>

              {/* Planet 1 */}
              <div
                className="absolute flex flex-col items-center transition-all duration-150"
                style={{ left: `calc(50% - ${distance * 12}px)` }}
              >
                <div
                  className="rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)] flex items-center justify-center text-xs font-bold"
                  style={{ width: `${mass1 * 0.8 + 20}px`, height: `${mass1 * 0.8 + 20}px` }}
                >
                  m₁
                </div>
                <span className="text-[11px] text-blue-300 mt-1 font-mono">{mass1} kg</span>
                <span className="text-[10px] text-amber-300 font-mono">→ F</span>
              </div>

              {/* Planet 2 */}
              <div
                className="absolute flex flex-col items-center transition-all duration-150"
                style={{ left: `calc(50% + ${distance * 12}px)` }}
              >
                <div
                  className="rounded-full bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)] flex items-center justify-center text-xs font-bold"
                  style={{ width: `${mass2 * 0.8 + 20}px`, height: `${mass2 * 0.8 + 20}px` }}
                >
                  m₂
                </div>
                <span className="text-[11px] text-purple-300 mt-1 font-mono">{mass2} kg</span>
                <span className="text-[10px] text-amber-300 font-mono">F ←</span>
              </div>
            </div>

            <div className="text-center z-10 text-xs text-slate-400">
              দূরত্ব r = {distance} একক
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <label className="text-xs text-slate-600 dark:text-slate-300 block mb-1">বস্তু ১ এর ভর (m₁)</label>
              <input
                type="range"
                min={10}
                max={80}
                value={mass1}
                onChange={(e) => setMass1(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <span className="text-xs font-mono font-bold text-blue-600">{mass1} kg</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <label className="text-xs text-slate-600 dark:text-slate-300 block mb-1">বস্তু ২ এর ভর (m₂)</label>
              <input
                type="range"
                min={10}
                max={80}
                value={mass2}
                onChange={(e) => setMass2(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
              <span className="text-xs font-mono font-bold text-purple-600">{mass2} kg</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <label className="text-xs text-slate-600 dark:text-slate-300 block mb-1">মধ্যবর্তী দূরত্ব (r)</label>
              <input
                type="range"
                min={5}
                max={25}
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
              <span className="text-xs font-mono font-bold text-amber-600">{distance} একক</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg text-xs text-amber-900 dark:text-amber-200">
            📌 <span className="font-bold">বর্গের ব্যস্তানুপাতী নিয়ম (Inverse Square Law):</span> দূরত্ব দ্বিগুণ (2r) করলে আকর্ষণ বল চার ভাগের এক ভাগ (¼) হয়ে যায়। ভর বাড়ালে আকর্ষণ বৃদ্ধি পায়।
          </div>
        </div>
      )}
    </div>
  );
};
