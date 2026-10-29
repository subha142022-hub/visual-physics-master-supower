import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, Info, Compass } from 'lucide-react';

export const MotionLab: React.FC = () => {
  // Physical parameters
  const [initialVelocity, setInitialVelocity] = useState<number>(0); // u (m/s)
  const [acceleration, setAcceleration] = useState<number>(2); // a (m/s²)
  const [trackLength] = useState<number>(100); // 100 meters track

  // Simulation state
  const [time, setTime] = useState<number>(0); // seconds
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [history, setHistory] = useState<{ t: number; s: number; v: number }[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const lastTimestamp = useRef<number | null>(null);

  // Calculate current state: s = ut + 0.5*a*t^2, v = u + a*t
  const currentDisplacement = initialVelocity * time + 0.5 * acceleration * time * time;
  const currentVelocity = initialVelocity + acceleration * time;

  // Handle animation loop
  useEffect(() => {
    if (!isPlaying) {
      lastTimestamp.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (lastTimestamp.current === null) {
        lastTimestamp.current = timestamp;
      }
      const delta = (timestamp - lastTimestamp.current) / 1000;
      lastTimestamp.current = timestamp;

      setTime((prevTime) => {
        const nextTime = prevTime + delta * speedMultiplier;
        // Stop if car reaches end of track or time limit
        const disp = initialVelocity * nextTime + 0.5 * acceleration * nextTime * nextTime;
        if (disp >= trackLength || disp <= -10 || nextTime >= 15) {
          setIsPlaying(false);
          return nextTime;
        }
        return nextTime;
      });

      animationFrameId.current = requestAnimationFrame(step);
    };

    animationFrameId.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isPlaying, speedMultiplier, initialVelocity, acceleration, trackLength]);

  // Record history for graph
  useEffect(() => {
    setHistory((prev) => {
      if (time === 0) return [{ t: 0, s: 0, v: initialVelocity }];
      const last = prev[prev.length - 1];
      if (!last || time - last.t > 0.05) {
        return [...prev, { t: time, s: currentDisplacement, v: currentVelocity }];
      }
      return prev;
    });
  }, [time, currentDisplacement, currentVelocity, initialVelocity]);

  // Draw motion track & car
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Track parameters
    const trackY = height * 0.65;
    const paddingX = 40;
    const trackWidth = width - 2 * paddingX;

    // Draw background ground
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, trackY, width, height - trackY);

    // Draw calibrated track line
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(paddingX, trackY);
    ctx.lineTo(width - paddingX, trackY);
    ctx.stroke();

    // Draw calibration marks every 10 meters
    for (let m = 0; m <= trackLength; m += 10) {
      const x = paddingX + (m / trackLength) * trackWidth;
      ctx.beginPath();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = m % 20 === 0 ? 3 : 1.5;
      ctx.moveTo(x, trackY - (m % 20 === 0 ? 12 : 6));
      ctx.lineTo(x, trackY + (m % 20 === 0 ? 12 : 6));
      ctx.stroke();

      ctx.fillStyle = '#475569';
      ctx.font = '12px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${m}m`, x, trackY + 24);
    }

    // Calculate car position clamped on track
    const clampedDisp = Math.max(0, Math.min(trackLength, currentDisplacement));
    const carX = paddingX + (clampedDisp / trackLength) * trackWidth;

    // Draw displacement vector arrow
    if (carX > paddingX + 5) {
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(paddingX, trackY - 45);
      ctx.lineTo(carX, trackY - 45);
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.moveTo(carX, trackY - 45);
      ctx.lineTo(carX - 8, trackY - 50);
      ctx.lineTo(carX - 8, trackY - 40);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#1d4ed8';
      ctx.font = 'bold 12px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`সরণ s = ${Math.round(currentDisplacement * 10) / 10} m`, (paddingX + carX) / 2, trackY - 54);
    }

    // Draw Car
    const carW = 60;
    const carH = 26;
    const carY = trackY - carH - 4;

    // Car body
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.roundRect(carX - carW / 2, carY + 8, carW, carH - 8, [4, 4, 2, 2]);
    ctx.fill();

    // Car top roof
    ctx.fillStyle = '#0369a1';
    ctx.beginPath();
    ctx.roundRect(carX - carW / 4, carY, carW / 2, 10, [6, 6, 0, 0]);
    ctx.fill();

    // Windows
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(carX - carW / 4 + 3, carY + 2, carW / 4 - 4, 6);
    ctx.fillRect(carX + 1, carY + 2, carW / 4 - 4, 6);

    // Wheels
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(carX - carW / 3, trackY - 4, 6, 0, Math.PI * 2);
    ctx.arc(carX + carW / 3, trackY - 4, 6, 0, Math.PI * 2);
    ctx.fill();

    // Wheel rims
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(carX - carW / 3, trackY - 4, 2.5, 0, Math.PI * 2);
    ctx.arc(carX + carW / 3, trackY - 4, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Headlight beam if moving forward
    if (currentVelocity > 0.1) {
      const gradient = ctx.createLinearGradient(carX + carW / 2, carY + 12, carX + carW / 2 + 50, carY + 12);
      gradient.addColorStop(0, 'rgba(250, 204, 21, 0.6)');
      gradient.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(carX + carW / 2, carY + 10);
      ctx.lineTo(carX + carW / 2 + 45, carY + 4);
      ctx.lineTo(carX + carW / 2 + 45, carY + 18);
      ctx.closePath();
      ctx.fill();
    }
  }, [currentDisplacement, currentVelocity, trackLength]);

  // Draw Real-time Graph (Distance-Time & Velocity-Time)
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Grid lines & axes
    const originX = 40;
    const originY = height - 30;
    const graphW = width - originX - 20;
    const graphH = originY - 20;

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;

    // Grid
    for (let x = originX; x <= originX + graphW; x += graphW / 6) {
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, originY);
      ctx.stroke();
    }
    for (let y = originY; y >= 20; y -= graphH / 4) {
      ctx.beginPath();
      ctx.moveTo(originX, y);
      ctx.lineTo(originX + graphW, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(originX, 15);
    ctx.lineTo(originX, originY);
    ctx.lineTo(originX + graphW + 10, originY);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#475569';
    ctx.font = '11px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('মান', originX - 6, 25);
    ctx.textAlign = 'center';
    ctx.fillText('সময় t (s) →', originX + graphW / 2, originY + 22);

    if (history.length < 2) return;

    const maxT = 12; // 12 seconds max on x-axis
    const maxVal = 100; // 100m or 100 m/s scale

    // Plot Displacement-Time Curve (Blue)
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    history.forEach((pt, idx) => {
      const px = originX + (Math.min(pt.t, maxT) / maxT) * graphW;
      const py = originY - (Math.min(pt.s, maxVal) / maxVal) * graphH;
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();

    // Plot Velocity-Time Curve (Orange)
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    history.forEach((pt, idx) => {
      const px = originX + (Math.min(pt.t, maxT) / maxT) * graphW;
      const py = originY - (Math.min(pt.v, maxVal) / maxVal) * graphH;
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
  }, [history]);

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
    setHistory([{ t: 0, s: 0, v: initialVelocity }]);
    lastTimestamp.current = null;
  };

  const applyPreset = (type: string) => {
    handleReset();
    if (type === 'uniform') {
      setInitialVelocity(8);
      setAcceleration(0);
    } else if (type === 'accelerated') {
      setInitialVelocity(0);
      setAcceleration(3);
    } else if (type === 'braking') {
      setInitialVelocity(20);
      setAcceleration(-4);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
            <Compass className="w-4 h-4" />
            <span>গতিবিদ্যা ল্যাব · Class 9 & 10</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            গতি, সরণ, বেগ ও ত্বরণ সিমুলেটর
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            গাড়ির প্রাথমিক বেগ ও ত্বরণ পরিবর্তন করে লাইভ দূরত্বের পরিবর্তন ও গ্রাফ লক্ষ্য করো।
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">মোড:</span>
          <button
            onClick={() => applyPreset('uniform')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              acceleration === 0 && initialVelocity > 0
                ? 'bg-sky-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            সমবেগ (a = 0)
          </button>
          <button
            onClick={() => applyPreset('accelerated')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              acceleration > 0
                ? 'bg-sky-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            সমত্বরণ (a &gt; 0)
          </button>
          <button
            onClick={() => applyPreset('braking')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              acceleration < 0
                ? 'bg-sky-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            মন্দন (গাড়ি থামা)
          </button>
        </div>
      </div>

      {/* Track Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
        <canvas ref={canvasRef} width={800} height={180} className="w-full h-auto block" />
      </div>

      {/* Control Panel & Real-time Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders */}
        <div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            ইনপুট মান নিয়ন্ত্রণ
          </h4>

          {/* Initial Velocity u */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-600 dark:text-slate-300">প্রাথমিক বেগ (u)</span>
              <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{initialVelocity} m/s</span>
            </div>
            <input
              type="range"
              min={0}
              max={25}
              step={1}
              value={initialVelocity}
              onChange={(e) => {
                setInitialVelocity(Number(e.target.value));
                handleReset();
              }}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
          </div>

          {/* Acceleration a */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-600 dark:text-slate-300">ত্বরণ / মন্দন (a)</span>
              <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{acceleration} m/s²</span>
            </div>
            <input
              type="range"
              min={-6}
              max={6}
              step={0.5}
              value={acceleration}
              onChange={(e) => {
                setAcceleration(Number(e.target.value));
                handleReset();
              }}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
          </div>

          {/* Buttons: Play, Pause, Reset */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'বিরতি (Pause)' : 'শুরু করো (Play)'}
            </button>
            <button
              onClick={handleReset}
              className="p-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
              title="রিসেট"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSpeedMultiplier(speedMultiplier === 1 ? 0.5 : 1)}
              className={`p-2 border rounded-lg text-xs font-medium transition-colors ${
                speedMultiplier === 0.5
                  ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 text-amber-700 dark:text-amber-300'
                  : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
              title="ধীর গতি"
            >
              <FastForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time Math Readings */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
            লাইভ পরিমাপ ও গাণিতিক মান
          </h4>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60">
              <span className="text-slate-500 block">অতিবাহিত সময় (t)</span>
              <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
                {time.toFixed(2)} s
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60">
              <span className="text-slate-500 block">বর্তমান বেগ (v)</span>
              <span className="font-mono text-lg font-bold text-amber-600 dark:text-amber-400">
                {Math.max(0, currentVelocity).toFixed(1)} m/s
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60">
              <span className="text-slate-500 block">অতিক্রান্ত দূরত্ব (s)</span>
              <span className="font-mono text-lg font-bold text-blue-600 dark:text-blue-400">
                {Math.max(0, currentDisplacement).toFixed(1)} m
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60">
              <span className="text-slate-500 block">ব্যবহৃত সূত্র</span>
              <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                s = ut + ½at²
              </span>
            </div>
          </div>

          <div className="mt-3 p-2 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 rounded-lg text-xs text-sky-800 dark:text-sky-300 flex items-start gap-1.5">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              {acceleration === 0
                ? 'ত্বরণ শূন্য হওয়ায় গাড়িটি সমবেগে চলছে (দূরত্ব = বেগ × সময়)।'
                : acceleration > 0
                ? `প্রতি সেকেন্ডে বেগ ${acceleration} m/s হারে বৃদ্ধি পাচ্ছে (ত্বরণ)।`
                : `প্রতি সেকেন্ডে বেগ ${Math.abs(acceleration)} m/s হারে হ্রাস পাচ্ছে (মন্দন)।`}
            </span>
          </div>
        </div>

        {/* Live Graph Canvas */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              লাইভ লেখচিত্র (Live Graph)
            </h4>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                <span className="w-2.5 h-1 bg-blue-600 inline-block rounded"></span> s-t গ্রাফ
              </span>
              <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-medium">
                <span className="w-2.5 h-1 bg-orange-600 inline-block rounded"></span> v-t গ্রাফ
              </span>
            </div>
          </div>

          <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <canvas ref={graphCanvasRef} width={340} height={140} className="w-full h-auto block" />
          </div>

          <p className="text-[11px] text-slate-400 mt-2">
            নীল রেখা নির্দেশ করে দূরত্ব-সময় বক্ররেখা, কমলা রেখা নির্দেশ করে বেগ-সময় সরলরেখা।
          </p>
        </div>
      </div>
    </div>
  );
};
