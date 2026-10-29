import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const NewtonLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'second-law' | 'third-law'>('second-law');

  // Second law state
  const [mass, setMass] = useState<number>(10); // kg
  const [appliedForce, setAppliedForce] = useState<number>(50); // N
  const [frictionCoeff, setFrictionCoeff] = useState<number>(0.2); // mu
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [position, setPosition] = useState<number>(50); // meters or px
  const [velocity, setVelocity] = useState<number>(0);
  const [time, setTime] = useState<number>(0);

  // Third law skaters state
  const [massA, setMassA] = useState<number>(40); // kg (student)
  const [massB, setMassB] = useState<number>(70); // kg (adult)
  const [pushForce, setPushForce] = useState<number>(140); // N
  const [skaterPosA, setSkaterPosA] = useState<number>(200);
  const [skaterPosB, setSkaterPosB] = useState<number>(200);
  const [isSkating, setIsSkating] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const skatersCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const g = 9.8; // m/s²
  const normalForce = mass * g;
  const maxFriction = frictionCoeff * normalForce;

  let netForce = 0;
  if (Math.abs(appliedForce) > maxFriction) {
    const frictionForce = maxFriction * Math.sign(appliedForce);
    netForce = appliedForce - frictionForce;
  } else if (Math.abs(velocity) > 0.01) {
    // Kinetic friction slowing it down
    netForce = -Math.sign(velocity) * maxFriction;
  } else {
    netForce = 0;
  }

  const acceleration = netForce / mass;
  const momentum = mass * velocity;

  // Animation for Second Law box
  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
      return;
    }

    const loop = (timestamp: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = timestamp;

      setVelocity((v) => {
        let newV = v + acceleration * dt;
        // Stop if friction overcomes motion and no applied force
        if (Math.abs(appliedForce) <= maxFriction && Math.sign(newV) !== Math.sign(v)) {
          newV = 0;
        }
        return newV;
      });

      setPosition((pos) => {
        const nextPos = pos + velocity * dt * 25; // scaling for canvas
        if (nextPos > 680 || nextPos < 40) {
          setIsPlaying(false);
          return pos;
        }
        return nextPos;
      });

      setTime((t) => t + dt);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, acceleration, velocity, appliedForce, maxFriction]);

  // Render Box Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const groundY = height * 0.72;

    // Ground surface
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, groundY, width, height - groundY);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();

    // Box dimensions
    const boxSize = 54;
    const boxX = Math.max(30, Math.min(width - 80, position));
    const boxY = groundY - boxSize;

    // Draw box
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxSize, boxSize, 6);
    ctx.fill();
    ctx.stroke();

    // Mass label on box
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 13px "JetBrains Mono", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${mass} kg`, boxX + boxSize / 2, boxY + boxSize / 2 + 5);

    // Free body vector arrows
    // 1. Weight (Downward)
    drawVector(ctx, boxX + boxSize / 2, boxY + boxSize, boxX + boxSize / 2, boxY + boxSize + 35, '#dc2626', `W = ${Math.round(normalForce)}N`);
    // 2. Normal Force (Upward)
    drawVector(ctx, boxX + boxSize / 2, boxY, boxX + boxSize / 2, boxY - 35, '#16a34a', `N = ${Math.round(normalForce)}N`);

    // 3. Applied Force (Right)
    if (Math.abs(appliedForce) > 0) {
      const arrowLength = (appliedForce / 100) * 80;
      drawVector(ctx, boxX + boxSize, boxY + boxSize / 2, boxX + boxSize + arrowLength, boxY + boxSize / 2, '#2563eb', `F = ${appliedForce}N`);
    }

    // 4. Friction (Left)
    if (frictionCoeff > 0 && Math.abs(appliedForce) > 0) {
      const frictionLength = -(Math.min(Math.abs(appliedForce), maxFriction) / 100) * 80 * Math.sign(appliedForce);
      drawVector(ctx, boxX, boxY + boxSize / 2, boxX + frictionLength, boxY + boxSize / 2, '#9333ea', `f = ${Math.round(Math.min(Math.abs(appliedForce), maxFriction))}N`);
    }
  }, [position, mass, appliedForce, frictionCoeff, normalForce, maxFriction]);

  // Helper to draw clean vector arrows
  const drawVector = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string, label: string) => {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Arrowhead
    const angle = Math.atan2(toY - fromY, toX - fromX);
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - 8 * Math.cos(angle - Math.PI / 6), toY - 8 * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - 8 * Math.cos(angle + Math.PI / 6), toY - 8 * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    // Label
    ctx.font = '11px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, toX + 15 * Math.cos(angle), toY + 15 * Math.sin(angle) + 4);
  };

  // Skaters animation for 3rd law
  const triggerSkaterPush = () => {
    setIsSkating(true);
    setSkaterPosA(200);
    setSkaterPosB(200);

    const accelA = pushForce / massA; // lighter accelerates faster
    const accelB = pushForce / massB;

    let localT = 0;
    const interval = setInterval(() => {
      localT += 0.05;
      setSkaterPosA((p) => Math.max(30, 200 - 0.5 * accelA * localT * localT * 20));
      setSkaterPosB((p) => Math.min(370, 200 + 0.5 * accelB * localT * localT * 20));

      if (localT > 2.5) {
        clearInterval(interval);
        setIsSkating(false);
      }
    }, 50);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-2">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            নিউটনের গতিসূত্র ও বলের ল্যাব
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            ভর ও বলের সম্পর্ক ($F = ma$) এবং ক্রিয়া-প্রতিক্রিয়ার যুগল ধর্ম প্রত্যক্ষ করো।
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('second-law')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'second-law'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            ২য় সূত্র: F = ma ও ঘর্ষণ
          </button>
          <button
            onClick={() => setActiveTab('third-law')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'third-law'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            ৩য় সূত্র: ক্রিয়া ও প্রতিক্রিয়া
          </button>
        </div>
      </div>

      {activeTab === 'second-law' ? (
        <div className="space-y-6">
          {/* Canvas View */}
          <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
            <canvas ref={canvasRef} width={760} height={200} className="w-full h-auto block" />
            <div className="absolute top-3 left-4 flex gap-4 text-xs font-medium">
              <span className="text-blue-600 font-bold">■ প্রযুক্ত বল (F)</span>
              <span className="text-purple-600 font-bold">■ ঘর্ষণ বল (f)</span>
              <span className="text-green-600 font-bold">■ প্রতিক্রিয়া (N)</span>
              <span className="text-red-600 font-bold">■ ওজন (W)</span>
            </div>
          </div>

          {/* Interactive controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                বল ও ভরের নিয়ন্ত্রণ
              </h4>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600 dark:text-slate-300">প্রযুক্ত বল (F)</span>
                  <span className="font-mono text-blue-600 font-bold">{appliedForce} N</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={120}
                  step={5}
                  value={appliedForce}
                  onChange={(e) => setAppliedForce(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600 dark:text-slate-300">বস্তুর ভর (m)</span>
                  <span className="font-mono text-amber-600 font-bold">{mass} kg</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={40}
                  step={1}
                  value={mass}
                  onChange={(e) => setMass(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600 dark:text-slate-300">ঘর্ষণ গুণাঙ্ক (μ)</span>
                  <span className="font-mono text-purple-600 font-bold">{frictionCoeff.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={0.5}
                  step={0.05}
                  value={frictionCoeff}
                  onChange={(e) => setFrictionCoeff(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>মসৃণ বরফ (0)</span>
                  <span>কাঠ (0.2)</span>
                  <span>খসখসে রাস্তা (0.5)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'বিরতি' : 'গতি দেখুন'}
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setPosition(50);
                    setVelocity(0);
                    setTime(0);
                  }}
                  className="p-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 rounded-lg text-slate-600"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Live Metrics */}
            <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-4">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                পদার্থবিজ্ঞানের হিসাব ও বিশ্লেষণ (F_net = ma)
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block">কার্যকর নিট বল (F_net)</span>
                  <span className="font-mono text-base font-bold text-blue-600">
                    {Math.max(0, netForce).toFixed(1)} N
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block">সৃষ্ট ত্বরণ (a = F/m)</span>
                  <span className="font-mono text-base font-bold text-amber-600">
                    {Math.max(0, acceleration).toFixed(2)} m/s²
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block">সর্বোচ্চ ঘর্ষণ বল</span>
                  <span className="font-mono text-base font-bold text-purple-600">
                    {maxFriction.toFixed(1)} N
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block">বর্তমান ভরবেগ (p = mv)</span>
                  <span className="font-mono text-base font-bold text-emerald-600">
                    {Math.round(momentum * 10) / 10} kg·m/s
                  </span>
                </div>
              </div>

              {/* Step by step educational takeaway */}
              <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  পদার্থবিজ্ঞানের সহজ ব্যাখ্যা:
                </p>
                {appliedForce <= maxFriction ? (
                  <p className="text-rose-600 font-medium">
                    ⚠️ প্রযুক্ত বল ({appliedForce} N) সর্বোচ্চ সীমা ঘর্ষণ বলের ({maxFriction.toFixed(1)} N) চেয়ে কম বা সমান। তাই নিট বল শূন্য (F_net = 0) এবং ত্বরণ a = 0—বস্তুটি একচুলও নড়বে না!
                  </p>
                ) : (
                  <p className="text-emerald-700 dark:text-emerald-400">
                    ✅ প্রযুক্ত বল ঘর্ষণকে অতিক্রম করেছে! নিট কার্যকর বল F_net = {appliedForce} - {maxFriction.toFixed(1)} = {netForce.toFixed(1)} N। ত্বরণ a = F_net / m = {netForce.toFixed(1)} / {mass} = {acceleration.toFixed(2)} m/s²।
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Third law skater push demo */
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              আইস স্কেটিং ক্রিয়া-প্রতিক্রিয়া পরীক্ষা
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              দুজনে বরফের ওপর দাঁড়িয়ে পরস্পরকে ধাক্কা দিলে সমান ও বিপরীত বল উৎপন্ন হয় ($F_A = -F_B$)। কিন্তু কার ত্বরণ বেশি হয় লক্ষ করো!
            </p>

            <div className="relative h-44 bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-800">
              {/* Skater A */}
              <div
                className="absolute transition-all duration-75 flex flex-col items-center"
                style={{ left: `${skaterPosA}px` }}
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  A
                </div>
                <div className="w-8 h-12 bg-blue-600 rounded-md mt-1"></div>
                <div className="w-12 h-2 bg-slate-700 rounded-full mt-1"></div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-1">
                  ছাত্র ({massA} kg)
                </span>
                <span className="text-[10px] text-blue-600 font-mono">
                  a = {(pushForce / massA).toFixed(2)} m/s²
                </span>
              </div>

              {/* Skater B */}
              <div
                className="absolute transition-all duration-75 flex flex-col items-center"
                style={{ left: `${skaterPosB + 100}px` }}
              >
                <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  B
                </div>
                <div className="w-10 h-14 bg-orange-600 rounded-md mt-1"></div>
                <div className="w-14 h-2 bg-slate-700 rounded-full mt-1"></div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-1">
                  প্রাপ্তবয়স্ক ({massB} kg)
                </span>
                <span className="text-[10px] text-orange-600 font-mono">
                  a = {(pushForce / massB).toFixed(2)} m/s²
                </span>
              </div>
            </div>

            {/* Skater controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="text-xs text-slate-500 block mb-1">ধাক্কা বল (F)</label>
                <input
                  type="range"
                  min={50}
                  max={250}
                  step={10}
                  value={pushForce}
                  onChange={(e) => setPushForce(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <span className="text-xs font-mono font-bold text-blue-600">{pushForce} N</span>
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">স্কেটার A এর ভর (হালকা)</label>
                <input
                  type="range"
                  min={25}
                  max={60}
                  value={massA}
                  onChange={(e) => setMassA(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <span className="text-xs font-mono font-bold text-blue-600">{massA} kg</span>
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">স্কেটার B এর ভর (ভারী)</label>
                <input
                  type="range"
                  min={60}
                  max={100}
                  value={massB}
                  onChange={(e) => setMassB(Number(e.target.value))}
                  className="w-full accent-orange-600"
                />
                <span className="text-xs font-mono font-bold text-orange-600">{massB} kg</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={triggerSkaterPush}
                disabled={isSkating}
                className="py-2 px-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                ধাক্কা দিন (ক্রিয়া ও প্রতিক্রিয়া দেখুন)
              </button>
              <div className="text-xs text-slate-600 dark:text-slate-300">
                💡 <span className="font-semibold">সারসংক্ষেপ:</span> বল দুজনের ওপর সমান ({pushForce} N), কিন্তু হালকা ব্যক্তির ত্বরণ বেশি হওয়ায় সে দ্রুত দূরে ছিটকে যায়!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
