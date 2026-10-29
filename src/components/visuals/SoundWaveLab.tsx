import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Pause, RotateCcw, Waves, Zap } from 'lucide-react';

export const SoundWaveLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wave-generator' | 'echo-sim'>('wave-generator');

  // Wave Generator state
  const [waveType, setWaveType] = useState<'longitudinal' | 'transverse'>('longitudinal');
  const [frequency, setFrequency] = useState<number>(2); // Hz
  const [amplitude, setAmplitude] = useState<number>(25); // px
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Echo state
  const [obstacleDistance, setObstacleDistance] = useState<number>(25); // meters
  const [soundSpeed, setSoundSpeed] = useState<number>(344); // m/s in air
  const [echoAnimProgress, setEchoAnimProgress] = useState<number>(0);
  const [isClapping, setIsClapping] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Calculate wave parameters
  const calculatedWavelength = soundSpeed / frequency;
  const timePeriod = 1 / frequency;

  // Echo calculations
  const echoTime = (2 * obstacleDistance) / soundSpeed;
  const isEchoAudible = echoTime >= 0.1; // >= 0.1s persistence of hearing in human ear

  // Animation loop for Wave Generator
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (isPlaying) {
        timeRef.current += 0.02 * frequency;
      }

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const t = timeRef.current;

      if (waveType === 'longitudinal') {
        // Longitudinal wave: particle lines oscillating horizontally
        const numLines = 50;
        const spacing = width / numLines;

        for (let i = 0; i < numLines; i++) {
          const restX = i * spacing + 10;
          // Phase shift kx - omega*t
          const phase = (i / numLines) * Math.PI * 4 - t * Math.PI * 2;
          const displacement = amplitude * Math.sin(phase);
          const currentX = restX + displacement;

          // Draw vertical band of air molecules
          ctx.strokeStyle = '#0284c7';
          // Lines that are compressed get thicker/darker
          const compression = Math.cos(phase);
          ctx.lineWidth = compression > 0.3 ? 3 : 1.2;
          ctx.globalAlpha = compression > 0.3 ? 0.9 : 0.4;

          ctx.beginPath();
          ctx.moveTo(currentX, 25);
          ctx.lineTo(currentX, height - 35);
          ctx.stroke();
        }

        ctx.globalAlpha = 1.0;
        // Compression & Rarefaction labels
        ctx.fillStyle = '#0369a1';
        ctx.font = 'bold 11px "Hind Siliguri", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ঘনীভবন (Compression)', width * 0.35, height - 12);
        ctx.fillText('তনুভবন (Rarefaction)', width * 0.7, height - 12);
      } else {
        // Transverse wave: Sine curve with animated dots
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(20, height / 2);
        ctx.lineTo(width - 20, height / 2);
        ctx.stroke();

        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 3;
        ctx.beginPath();

        for (let x = 20; x < width - 20; x += 2) {
          const phase = ((x - 20) / (width - 40)) * Math.PI * 4 - t * Math.PI * 2;
          const y = height / 2 + amplitude * Math.sin(phase);
          if (x === 20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Wave crest and trough labels
        ctx.fillStyle = '#4f46e5';
        ctx.font = '11px "Hind Siliguri", sans-serif';
        ctx.fillText('তরঙ্গশীর্ষ (Crest)', width * 0.3, 20);
        ctx.fillText('তরঙ্গপাদ (Trough)', width * 0.55, height - 10);
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, waveType, frequency, amplitude]);

  // Echo Animation trigger
  const triggerClap = () => {
    setIsClapping(true);
    setEchoAnimProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.03;
      setEchoAnimProgress(progress);
      if (progress >= 1) {
        clearInterval(interval);
        setIsClapping(false);
      }
    }, 30);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-2">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            শব্দ, তরঙ্গ ও প্রতিধ্বনি ল্যাব
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            অনুদৈর্ঘ্য ও তির্যক তরঙ্গের প্রকৃতি এবং প্রতিধ্বনি শোনার শর্তাবলি প্রত্যক্ষ করো।
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('wave-generator')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'wave-generator'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            তরঙ্গ সিমুলেটর (v = f·λ)
          </button>
          <button
            onClick={() => setActiveTab('echo-sim')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'echo-sim'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            প্রতিধ্বনি ও প্রতিফলন (Echo)
          </button>
        </div>
      </div>

      {activeTab === 'wave-generator' ? (
        <div className="space-y-6">
          {/* Wave Canvas */}
          <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
            <canvas ref={canvasRef} width={760} height={180} className="w-full h-auto block" />
            <div className="absolute top-3 left-4 flex gap-2">
              <button
                onClick={() => setWaveType('longitudinal')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  waveType === 'longitudinal'
                    ? 'bg-sky-600 text-white'
                    : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                অনুদৈর্ঘ্য তরঙ্গ (শব্দ তরঙ্গ)
              </button>
              <button
                onClick={() => setWaveType('transverse')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  waveType === 'transverse'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                তির্যক তরঙ্গ (আলোক তরঙ্গ)
              </button>
            </div>
          </div>

          {/* Controls & Math */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                তরঙ্গ নিয়ন্ত্রণ
              </h4>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600 dark:text-slate-300">কম্পাঙ্ক (Frequency - f)</span>
                  <span className="font-mono text-sky-600 font-bold">{frequency} Hz</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={0.5}
                  value={frequency}
                  onChange={(e) => setFrequency(Number(e.target.value))}
                  className="w-full accent-sky-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600 dark:text-slate-300">বিস্তার (Amplitude - A)</span>
                  <span className="font-mono text-sky-600 font-bold">{amplitude} px</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={45}
                  step={5}
                  value={amplitude}
                  onChange={(e) => setAmplitude(Number(e.target.value))}
                  className="w-full accent-sky-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex-1 py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs rounded-lg flex items-center justify-center gap-1.5"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isPlaying ? 'বিরতি' : 'চালান'}
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-4">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                তরঙ্গের মূল সূত্র: $v = f \cdot \lambda$
              </h4>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block">পর্যায়কাল (T = 1/f)</span>
                  <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                    {timePeriod.toFixed(2)} s
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block">বায়ুতে শব্দের বেগ (v)</span>
                  <span className="font-mono text-base font-bold text-sky-600">
                    {soundSpeed} m/s
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block">তরঙ্গদৈর্ঘ্য (λ = v/f)</span>
                  <span className="font-mono text-base font-bold text-indigo-600">
                    {calculatedWavelength.toFixed(1)} m
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                <p className="font-bold text-slate-900 dark:text-white mb-1">
                  🔍 বাস্তব পদার্থবিজ্ঞানের পর্যবেক্ষণ:
                </p>
                <p>
                  • <strong>কম্পাঙ্ক (Frequency)</strong> শব্দের তীক্ষ্ণতা (Pitch) নির্ধারণ করে। যেমন: মশার ডানার ভনভন শব্দের কম্পাঙ্ক বেশি হওয়ায় তীক্ষ্ণ শোনায়।
                  <br />
                  • <strong>বিস্তার (Amplitude)</strong> শব্দের তীব্রতা বা লাউডনেস (Loudness) নির্ধারণ করে। বেশি জোরে ঢাক বা ড্রাম পেটালে বিস্তার বেড়ে শব্দ জোরালো হয়।
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Echo Simulator */
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 relative">
            <div className="flex justify-between items-center text-xs text-slate-500 mb-6">
              <span>শব্দের উৎস (মানুষ)</span>
              <span>প্রতিফলক দেয়াল</span>
            </div>

            {/* Echo Visualization Stage */}
            <div className="relative h-32 flex items-center justify-between px-6 border-b border-dashed border-slate-300 dark:border-slate-700">
              {/* Person clapping */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow">
                  🗣️
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                  উৎস
                </span>
              </div>

              {/* Animated Sound Wave Traveling */}
              {isClapping && (
                <div
                  className="absolute transition-all duration-75 flex items-center justify-center"
                  style={{
                    left:
                      echoAnimProgress <= 0.5
                        ? `${echoAnimProgress * 2 * 75 + 10}%` // going right
                        : `${(1 - (echoAnimProgress - 0.5) * 2) * 75 + 10}%`, // returning left
                  }}
                >
                  <div
                    className={`w-6 h-12 rounded-full border-r-4 ${
                      echoAnimProgress <= 0.5 ? 'border-sky-500' : 'border-amber-500'
                    } animate-pulse`}
                  ></div>
                </div>
              )}

              {/* Wall */}
              <div className="w-6 h-28 bg-slate-700 dark:bg-slate-600 rounded-md shadow flex items-center justify-center text-white text-[10px] font-bold">
                দেয়াল
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 text-xs">
              <span className="font-mono text-slate-700 dark:text-slate-300">
                দূরত্ব d = {obstacleDistance} মিটার
              </span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                মোট পথ 2d = {obstacleDistance * 2} মিটার
              </span>
            </div>
          </div>

          {/* Controls & Evaluation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <label className="text-xs text-slate-600 dark:text-slate-300 block mb-1">
                দেয়ালের দূরত্ব (d)
              </label>
              <input
                type="range"
                min={8}
                max={40}
                step={1}
                value={obstacleDistance}
                onChange={(e) => setObstacleDistance(Number(e.target.value))}
                className="w-full accent-sky-600"
              />
              <div className="flex justify-between text-xs font-mono font-bold text-sky-600">
                <span>৮ মি</span>
                <span>বর্তমান: {obstacleDistance} মি</span>
                <span>৪০ মি</span>
              </div>

              <button
                onClick={triggerClap}
                disabled={isClapping}
                className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                হাততালি দিন (শব্দ তরঙ্গ পাঠান)
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                শব্দ নির্বন্ধ ও প্রতিধ্বনি যাচাই ($2d = vt$)
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block">প্রতিধ্বনি ফিরে আসার সময়</span>
                  <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                    {echoTime.toFixed(3)} s
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block">শব্দ নির্বন্ধের শর্ত</span>
                  <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                    t ≥ 0.1 s
                  </span>
                </div>
              </div>

              {isEchoAudible ? (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-800 dark:text-emerald-300">
                  ✅ <strong>স্পষ্ট প্রতিধ্বনি শোনা যাবে!</strong> কারণ সময় {echoTime.toFixed(3)}s হলো ০.১ সেকেন্ডের বেশি। বায়ুতে শব্দের বেগ ৩৪৪ m/s হলে ন্যূনতম দূরত্ব ১৭.২ মিটার হতে হয়, যা এখানে পূরণ হয়েছে ({obstacleDistance}m &gt; 17.2m)।
                </div>
              ) : (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-800 dark:text-rose-300">
                  ❌ <strong>স্পষ্ট প্রতিধ্বনি শোনা যাবে না!</strong> কারণ শব্দটি ০.১ সেকেন্ডের আগেই ফিরে আসছে ({echoTime.toFixed(3)}s &lt; 0.1s)। মানুষের মস্তিষ্কে পূর্বের শব্দের রেশ থেকে যাওয়ায় দুটি শব্দ মিশে যাবে (অনুরণন)। দূরত্ব অন্তত ১৭.২ মিটার বাড়ান!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
