import React, { useState, useEffect, useRef } from 'react';
import { Eye, MoveHorizontal, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

type OpticalDevice = 'concave-mirror' | 'convex-mirror' | 'convex-lens' | 'concave-lens';

export const OpticsLab: React.FC = () => {
  const [device, setDevice] = useState<OpticalDevice>('concave-mirror');
  const [focalLengthMag, setFocalLengthMag] = useState<number>(20); // in cm / scale
  const [objectDist, setObjectDist] = useState<number>(-35); // in cm (u is negative)
  const [objectHeight, setObjectHeight] = useState<number>(30); // in px

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Determine actual sign of f based on Cartesian sign convention:
  // Concave mirror: f < 0
  // Convex mirror: f > 0
  // Convex lens: f > 0
  // Concave lens: f < 0
  let f = 0;
  if (device === 'concave-mirror') f = -focalLengthMag;
  else if (device === 'convex-mirror') f = focalLengthMag;
  else if (device === 'convex-lens') f = focalLengthMag;
  else if (device === 'concave-lens') f = -focalLengthMag;

  const u = objectDist;

  // Calculate v and m
  let v = 0;
  let isInfinity = false;
  let isReal = true;
  let magnification = 1;

  if (device === 'concave-mirror' || device === 'convex-mirror') {
    // 1/f = 1/v + 1/u => 1/v = 1/f - 1/u
    const invV = 1 / f - 1 / u;
    if (Math.abs(invV) < 0.001) {
      isInfinity = true;
      v = -9999;
    } else {
      v = 1 / invV;
      magnification = -v / u;
      isReal = v < 0; // In front of mirror is real for reflection
    }
  } else {
    // Lens formula: 1/f = 1/v - 1/u => 1/v = 1/f + 1/u
    const invV = 1 / f + 1 / u;
    if (Math.abs(invV) < 0.001) {
      isInfinity = true;
      v = 9999;
    } else {
      v = 1 / invV;
      magnification = v / u;
      isReal = v > 0; // Behind lens is real
    }
  }

  const imageHeight = isInfinity ? 999 : objectHeight * magnification;

  // Nature summary
  const natureText = isInfinity
    ? 'অসীম দূরত্বে গঠিত'
    : isReal
    ? 'সদ ও অবশীর্ষ (Real & Inverted)'
    : 'অসদ ও সমশীর্ষ (Virtual & Erect)';

  const sizeText = isInfinity
    ? 'অত্যন্ত বিবর্ধিত (অসীম)'
    : Math.abs(Math.abs(magnification) - 1) < 0.05
    ? 'বস্তুর সমান আকারের (Same Size)'
    : Math.abs(magnification) > 1
    ? 'বিবর্ধিত (Magnified)'
    : 'খর্বিত (Diminished)';

  // Draw Ray Diagram
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 7; // pixels per cm

    // 1. Draw Principal Axis (প্রধান অক্ষ)
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(20, centerY);
    ctx.lineTo(width - 20, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Optical Center / Pole marker
    ctx.fillStyle = '#64748b';
    ctx.font = '11px "JetBrains Mono", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('P (মেরু)', centerX, centerY + 18);

    // 3. Focal points & Center of Curvature
    const fPx = Math.abs(f) * scale;
    const cPx = 2 * fPx;

    const drawPoint = (x: number, label: string) => {
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(x, centerY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#b91c1c';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(label, x, centerY + 16);
    };

    drawPoint(centerX - fPx, 'F₁');
    drawPoint(centerX - cPx, '2F₁ (C₁)');
    drawPoint(centerX + fPx, 'F₂');
    drawPoint(centerX + cPx, '2F₂ (C₂)');

    // 4. Draw Optical Device (Mirror or Lens)
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 4;
    ctx.beginPath();

    if (device === 'concave-mirror') {
      // Curved arc open to left
      ctx.arc(centerX + 60, centerY, 120, Math.PI * 0.85, Math.PI * 1.15);
      ctx.stroke();
      // Silvering hatches on back (right side)
      for (let y = centerY - 50; y <= centerY + 50; y += 8) {
        ctx.beginPath();
        ctx.moveTo(centerX + 1, y);
        ctx.lineTo(centerX + 8, y - 4);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    } else if (device === 'convex-mirror') {
      ctx.arc(centerX - 60, centerY, 120, -Math.PI * 0.15, Math.PI * 0.15);
      ctx.stroke();
    } else if (device === 'convex-lens') {
      // Double convex lens shape
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 10, 80, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.fill();
      ctx.stroke();
    } else {
      // Concave lens
      ctx.beginPath();
      ctx.moveTo(centerX - 10, centerY - 80);
      ctx.lineTo(centerX + 10, centerY - 80);
      ctx.quadraticCurveTo(centerX + 3, centerY, centerX + 10, centerY + 80);
      ctx.lineTo(centerX - 10, centerY + 80);
      ctx.quadraticCurveTo(centerX - 3, centerY, centerX - 10, centerY - 80);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.fill();
      ctx.stroke();
    }

    // 5. Draw Object Arrow (বস্তু)
    const objX = centerX + u * scale;
    const objY = centerY - objectHeight;

    ctx.strokeStyle = '#2563eb';
    ctx.fillStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(objX, centerY);
    ctx.lineTo(objX, objY);
    ctx.stroke();

    // Arrowhead for object
    ctx.beginPath();
    ctx.moveTo(objX, objY);
    ctx.lineTo(objX - 5, objY + 8);
    ctx.lineTo(objX + 5, objY + 8);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#1d4ed8';
    ctx.font = 'bold 12px "Hind Siliguri", sans-serif';
    ctx.fillText('বস্তু (AB)', objX, objY - 8);

    // 6. Draw Image Arrow (প্রতিবিম্ব) if not at infinity
    if (!isInfinity && Math.abs(v) < 100) {
      const imgX = centerX + v * scale;
      const imgY = centerY - imageHeight;

      ctx.strokeStyle = isReal ? '#16a34a' : '#d97706';
      ctx.fillStyle = isReal ? '#16a34a' : '#d97706';
      ctx.lineWidth = 3;
      if (!isReal) ctx.setLineDash([3, 3]);

      ctx.beginPath();
      ctx.moveTo(imgX, centerY);
      ctx.lineTo(imgX, imgY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Arrowhead for image
      const arrowDir = imageHeight < 0 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(imgX, imgY);
      ctx.lineTo(imgX - 5, imgY - 8 * arrowDir);
      ctx.lineTo(imgX + 5, imgY - 8 * arrowDir);
      ctx.closePath();
      ctx.fill();

      ctx.font = 'bold 12px "Hind Siliguri", sans-serif';
      ctx.fillText("প্রতিবিম্ব (A'B')", imgX, imgY + (imageHeight < 0 ? 18 : -8));

      // 7. Ray Tracing Lines
      // Ray 1: Parallel to axis, then through focus
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(objX, objY);
      ctx.lineTo(centerX, objY); // ray hits mirror/lens at (centerX, objY)

      if (device === 'concave-mirror') {
        // Reflects through F1
        ctx.lineTo(imgX, imgY);
        // Extend line further
        const slope = (imgY - objY) / (imgX - centerX);
        ctx.lineTo(imgX + 80, imgY + 80 * slope);
        ctx.stroke();
      } else if (device === 'convex-lens') {
        // Refracts through F2
        ctx.lineTo(imgX, imgY);
        ctx.stroke();
      }

      // Ray 2: Central ray through center/pole
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(objX, objY);
      ctx.lineTo(centerX, centerY);
      if (device === 'concave-mirror') {
        // Reflection ∠i = ∠r
        ctx.lineTo(imgX, imgY);
      } else {
        // Straight through optical center
        ctx.lineTo(imgX, imgY);
      }
      ctx.stroke();
    }
  }, [device, f, u, v, objectHeight, imageHeight, isInfinity, isReal]);

  const setPresetPosition = (preset: string) => {
    if (preset === 'beyond-2f') setObjectDist(-45);
    else if (preset === 'at-2f') setObjectDist(-2 * focalLengthMag);
    else if (preset === 'between-f-2f') setObjectDist(-1.5 * focalLengthMag);
    else if (preset === 'at-f') setObjectDist(-focalLengthMag);
    else if (preset === 'dentist') setObjectDist(-10); // inside focus
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Eye className="w-4 h-4" />
            <span>আলোকবিজ্ঞান ল্যাব · Class 10</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            গোলীয় দর্পণ ও লেন্সের রশ্মি চিত্র (Ray Diagram Simulator)
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            বস্তুর অবস্থান (u) পরিবর্তন করে প্রতিবিম্বের অবস্থান (v), আকার ও প্রকৃতি সরাসরি পর্যবেক্ষণ করো।
          </p>
        </div>

        {/* Optical Element Selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex-wrap">
          <button
            onClick={() => setDevice('concave-mirror')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              device === 'concave-mirror' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            অবতল দর্পণ
          </button>
          <button
            onClick={() => setDevice('convex-mirror')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              device === 'convex-mirror' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            উত্তল দর্পণ
          </button>
          <button
            onClick={() => setDevice('convex-lens')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              device === 'convex-lens' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            উত্তল লেন্স
          </button>
          <button
            onClick={() => setDevice('concave-lens')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              device === 'concave-lens' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            অবতল লেন্স
          </button>
        </div>
      </div>

      {/* Preset Positions */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-slate-400 font-medium">পরীক্ষার অবস্থানসমূহ:</span>
        <button
          onClick={() => setPresetPosition('beyond-2f')}
          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md text-slate-700 dark:text-slate-300"
        >
          2F এর বাইরে (খর্বিত সদ)
        </button>
        <button
          onClick={() => setPresetPosition('at-2f')}
          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md text-slate-700 dark:text-slate-300"
        >
          2F (বক্রতা কেন্দ্রে - সমান আকার)
        </button>
        <button
          onClick={() => setPresetPosition('between-f-2f')}
          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md text-slate-700 dark:text-slate-300"
        >
          F ও 2F এর মাঝে (বিবর্ধিত সদ)
        </button>
        <button
          onClick={() => setPresetPosition('at-f')}
          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md text-slate-700 dark:text-slate-300"
        >
          ফোকাসে F (অসীমে)
        </button>
        <button
          onClick={() => setPresetPosition('dentist')}
          className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-medium rounded-md hover:bg-amber-200"
        >
          ফোকাসের ভেতরে (সোজা ও বিবর্ধিত অসদ)
        </button>
      </div>

      {/* Ray Tracing Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
        <canvas ref={canvasRef} width={800} height={260} className="w-full h-auto block" />
        <div className="absolute bottom-2 left-4 flex gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-blue-400">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full inline-block"></span> বস্তু (Blue)
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block"></span> সদ প্রতিবিম্ব (Green)
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span> অসদ প্রতিবিম্ব (Yellow)
          </span>
        </div>
      </div>

      {/* Real-time Math & Properties */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sliders */}
        <div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            অবস্থান ও উচ্চতা নিয়ন্ত্রণ
          </h4>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-600 dark:text-slate-300">বস্তু দূরত্ব (u)</span>
              <span className="font-mono text-blue-600 font-bold">{objectDist} cm</span>
            </div>
            <input
              type="range"
              min={-55}
              max={-5}
              step={1}
              value={objectDist}
              onChange={(e) => setObjectDist(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-600 dark:text-slate-300">ফোকাস দূরত্ব (|f|)</span>
              <span className="font-mono text-red-600 font-bold">{focalLengthMag} cm</span>
            </div>
            <input
              type="range"
              min={10}
              max={30}
              step={2}
              value={focalLengthMag}
              onChange={(e) => setFocalLengthMag(Number(e.target.value))}
              className="w-full accent-red-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-600 dark:text-slate-300">বস্তুর উচ্চতা (h_o)</span>
              <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{objectHeight} px</span>
            </div>
            <input
              type="range"
              min={15}
              max={50}
              value={objectHeight}
              onChange={(e) => setObjectHeight(Number(e.target.value))}
              className="w-full accent-slate-600"
            />
          </div>
        </div>

        {/* Dynamic Calculation Cards */}
        <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            দর্পণ ও লেন্সের সমীকরণ থেকে প্রাপ্ত ফলাফল
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block">প্রতিবিম্ব দূরত্ব (v)</span>
              <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                {isInfinity ? '∞ (অসীম)' : `${v.toFixed(1)} cm`}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block">রৈখিক বিবর্ধন (m)</span>
              <span className="font-mono text-base font-bold text-amber-600">
                {isInfinity ? '∞' : magnification.toFixed(2)}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 col-span-2">
              <span className="text-slate-500 block">প্রতিবিম্বের প্রকৃতি ও আকার</span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block mt-0.5">
                {natureText} · {sizeText}
              </span>
            </div>
          </div>

          {/* Exam Formula Breakdown */}
          <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
            <p className="font-bold text-slate-900 dark:text-white">
              📐 পরীক্ষায় যেভাবে লিখবে:
            </p>
            <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
              {device.includes('mirror')
                ? `সূত্র: 1/f = 1/v + 1/u ⇒ 1/v = 1/(${f}) - 1/(${u})`
                : `সূত্র: 1/f = 1/v - 1/u ⇒ 1/v = 1/(${f}) + 1/(${u})`}
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              {v < 0
                ? 'দর্পণের সামনে গঠিত হওয়ায় প্রতিবিম্বটি সদ (Real) এবং পর্দায় ফেলা সম্ভব।'
                : 'প্রতিবিম্বটি দর্পণ/লেন্সের পেছনে গঠিত হওয়ায় এটি অসদ (Virtual) এবং পর্দায় ফেলা যায় না।'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
