import React, { useState } from 'react';
import { Calculator, Sparkles, CheckCircle2, ArrowRight, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { ClassLevel } from '../../types/physics';

interface NumericalSolverProps {
  currentClass: ClassLevel;
}

export const NumericalSolver: React.FC<NumericalSolverProps> = ({ currentClass }) => {
  const [activeTab, setActiveTab] = useState<'guided' | 'custom'>('guided');

  // Guided solver category
  const [selectedTopic, setSelectedTopic] = useState<string>('motion-v-u-at');

  // Motion inputs
  const [motionU, setMotionU] = useState<number>(0);
  const [motionA, setMotionA] = useState<number>(2.5);
  const [motionT, setMotionT] = useState<number>(6);

  // Force inputs
  const [forceM, setForceM] = useState<number>(12);
  const [forceA, setForceA] = useState<number>(3);

  // Energy inputs
  const [energyM, setEnergyM] = useState<number>(4);
  const [energyH, setEnergyH] = useState<number>(15);

  // Ohm inputs
  const [ohmR, setOhmR] = useState<number>(8);
  const [ohmI, setOhmI] = useState<number>(1.5);

  // Custom AI input
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [aiSolution, setAiSolution] = useState<string | null>(null);
  const [solveError, setSolveError] = useState<string | null>(null);

  const sampleQuestions = [
    'একটি গাড়ি ৭২ km/h বেগে চলছিল। ব্রেক কষে গাড়িটিকে ৫ সেকেন্ডে থামিয়ে দেওয়া হলো। গাড়িটির মন্দন কত?',
    '১০ Ω এবং ১৫ Ω মানের দুটি রোধ সমান্তরাল সমবায়ে ১২ ভোল্ট ব্যাটারির সাথে যুক্ত থাকলে বর্তনীর মোট কারেন্ট কত?',
    '২ কেজি ভরের একটি পাথরকে ২০ মিটার উঁচু ছাদ থেকে ফেলে দিলে ভূমিতে স্পর্শ করার মুহূর্তে তার গতিশক্তি কত হবে?',
    'বায়ুতে একটি শব্দ তরঙ্গের কম্পাঙ্ক ৩৪০ Hz এবং বেগ ৩৪০ m/s হলে তরঙ্গটির তরঙ্গদৈর্ঘ্য কত?',
  ];

  const handleCustomSolve = async () => {
    if (!customQuestion.trim()) return;
    setIsSolving(true);
    setSolveError(null);
    setAiSolution(null);

    try {
      const res = await fetch('/api/solve-numerical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemText: customQuestion,
          className: currentClass,
        }),
      });

      const data = await res.json();
      if (data.solutionText) {
        setAiSolution(data.solutionText);
      } else if (data.steps) {
        setAiSolution(`**ধাপ ১: প্রদত্ত (Given)**\n${data.steps.given}\n\n**ধাপ ২: নির্ণেয় (To Find)**\n${data.steps.toFind}\n\n**ধাপ ৩: সূত্র (Formula)**\n${data.steps.formula}\n\n**ধাপ ৪: সূত্রে মান বসানো (Substitution)**\n${data.steps.substitution}\n\n**ধাপ ৫: গণনা (Calculation)**\n${data.steps.calculation}\n\n**ধাপ ৬: চূড়ান্ত উত্তর (Final Answer)**\n${data.steps.finalAnswer}\n\n**ধাপ ৭: এসআই একক (SI Unit)**\n${data.steps.siUnit}\n\n**ধাপ ৮: সহজ বাংলায় ব্যাখ্যা (Explanation)**\n${data.steps.explanationBengali}`);
      } else {
        setSolveError('সমাধান তৈরি করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    } catch (err: any) {
      setSolveError('সার্ভারে যোগাযোগ করতে সমস্যা হয়েছে।');
    } finally {
      setIsSolving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              পদার্থবিজ্ঞানের গাণিতিক অঙ্ক সমাধান (8-Step Numerical Solver)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              শুধু চূড়ান্ত উত্তর নয়; প্রদত্ত রাশি, সূত্র, একক রূপান্তর, ধাপে ধাপে হিসাব ও সহজ বাংলায় ব্যাখ্যাসহ পূর্ণ সমাধান।
            </p>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('guided')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'guided'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              গাইডেড সমাধান টেমপ্লেট
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'custom'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              যেকোনো প্রশ্নের এআই সমাধান
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'guided' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Topic Selector and Inputs (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                ১. অঙ্কের ধরন নির্বাচন করুন:
              </h3>

              <div className="space-y-1.5">
                {[
                  { id: 'motion-v-u-at', label: 'গতি: অন্তিম বেগ নির্ণয় (v = u + at)' },
                  { id: 'motion-s-ut-half-at2', label: 'গতি: অতিক্রান্ত দূরত্ব (s = ut + ½at²)' },
                  { id: 'force-f-ma', label: 'বল ও ত্বরণ: প্রযুক্ত বল (F = ma)' },
                  { id: 'energy-pe-mgh', label: 'কাজ ও শক্তি: স্থিতিশক্তি ও গতিশক্তি (mgh)' },
                  { id: 'electricity-v-ir', label: "তড়িৎ: ওহমের সূত্র ও বিভবপ্রভেদ (V = IR)" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedTopic(item.id)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-colors border ${
                      selectedTopic === item.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 font-semibold'
                        : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                ২. প্রদত্ত মানসমূহ বসান:
              </h3>

              {selectedTopic === 'motion-v-u-at' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                      প্রাথমিক বেগ u (m/s):
                    </label>
                    <input
                      type="number"
                      value={motionU}
                      onChange={(e) => setMotionU(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                      ত্বরণ a (m/s²):
                    </label>
                    <input
                      type="number"
                      value={motionA}
                      onChange={(e) => setMotionA(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                      সময় t (সেকেন্ড):
                    </label>
                    <input
                      type="number"
                      value={motionT}
                      onChange={(e) => setMotionT(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    />
                  </div>
                </div>
              )}

              {selectedTopic === 'motion-s-ut-half-at2' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                      প্রাথমিক বেগ u (m/s):
                    </label>
                    <input
                      type="number"
                      value={motionU}
                      onChange={(e) => setMotionU(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                      ত্বরণ a (m/s²):
                    </label>
                    <input
                      type="number"
                      value={motionA}
                      onChange={(e) => setMotionA(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                      সময় t (সেকেন্ড):
                    </label>
                    <input
                      type="number"
                      value={motionT}
                      onChange={(e) => setMotionT(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    />
                  </div>
                </div>
              )}

              {selectedTopic === 'force-f-ma' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                      বস্তুর ভর m (কিলোগ্রাম - kg):
                    </label>
                    <input
                      type="number"
                      value={forceM}
                      onChange={(e) => setForceM(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                      সৃষ্ট ত্বরণ a (m/s²):
                    </label>
                    <input
                      type="number"
                      value={forceA}
                      onChange={(e) => setForceA(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    />
                  </div>
                </div>
              )}

              {selectedTopic === 'energy-pe-mgh' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                      বস্তুর ভর m (kg):
                    </label>
                    <input
                      type="number"
                      value={energyM}
                      onChange={(e) => setEnergyM(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                      উচ্চতা h (মিটার - m):
                    </label>
                    <input
                      type="number"
                      value={energyH}
                      onChange={(e) => setEnergyH(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    />
                  </div>
                </div>
              )}

              {selectedTopic === 'electricity-v-ir' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                      পরিবাহীর রোধ R (ওহম - Ω):
                    </label>
                    <input
                      type="number"
                      value={ohmR}
                      onChange={(e) => setOhmR(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                      তড়িৎপ্রবাহ I (অ্যাম্পিয়ার - A):
                    </label>
                    <input
                      type="number"
                      value={ohmI}
                      onChange={(e) => setOhmI(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Step-by-Step 8-Step Solution Output (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  অফিসিয়াল ৮-ধাপ গাণিতিক সমাধান
                </span>
                <span className="text-xs text-slate-400">Class {currentClass === 'class-9' ? '9' : '10'} Exam Format</span>
              </div>

              {selectedTopic === 'motion-v-u-at' && (
                <div className="space-y-3 text-xs">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block">Step 1: Given (প্রদত্ত রাশিমালা)</span>
                    <p className="font-mono text-slate-600 dark:text-slate-400">
                      প্রাথমিক বেগ (u) = {motionU} m/s, সমত্বরণ (a) = {motionA} m/s², সময় (t) = {motionT} s
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block">Step 2: To Find (কী নির্ণয় করতে হবে)</span>
                    <p className="font-mono text-slate-600 dark:text-slate-400">অন্তিম বেগ (v) = ?</p>
                  </div>

                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block">Step 3: Formula (প্রয়োজনীয় সূত্র)</span>
                    <p className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">v = u + at</p>
                  </div>

                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block">Step 4: Substitute Values (সূত্রে মান বসানো)</span>
                    <p className="font-mono text-slate-600 dark:text-slate-400">v = {motionU} + ({motionA} × {motionT})</p>
                  </div>

                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block">Step 5: Step-by-Step Calculation (গণনা)</span>
                    <p className="font-mono text-slate-600 dark:text-slate-400">
                      v = {motionU} + {motionA * motionT} = {(motionU + motionA * motionT).toFixed(2)}
                    </p>
                  </div>

                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 block">Step 6: Final Answer (চূড়ান্ত উত্তর)</span>
                    <p className="font-mono text-base font-bold text-emerald-700 dark:text-emerald-200">
                      গাড়িটির অন্তিম বেগ = {(motionU + motionA * motionT).toFixed(2)} m/s
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block">Step 7: SI Unit (এসআই একক)</span>
                    <p className="font-mono text-slate-600 dark:text-slate-400">মিটার/সেকেন্ড (m/s)</p>
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-blue-900 dark:text-blue-200 block mb-1">Step 8: Explanation in simple Bengali (সহজ বাংলায় ব্যাখ্যা)</span>
                    <p>
                      যেহেতু ত্বরণ ছিল {motionA} m/s², তার অর্থ প্রতি সেকেন্ডে বস্তুর বেগ {motionA} m/s করে বৃদ্ধি পেয়েছে। তাই {motionT} সেকেন্ড পর মোট বেগ বৃদ্ধি পেয়েছে {motionA * motionT} m/s। প্রাথমিক বেগের সাথে এই বৃদ্ধি যোগ করায় চূড়ান্ত বেগ পাওয়া গেছে।
                    </p>
                  </div>
                </div>
              )}

              {selectedTopic === 'force-f-ma' && (
                <div className="space-y-3 text-xs">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block">Step 1: Given (প্রদত্ত)</span>
                    <p className="font-mono">ভর (m) = {forceM} kg, ত্বরণ (a) = {forceA} m/s²</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block">Step 2: To Find</span>
                    <p className="font-mono">প্রযুক্ত বল (F) = ?</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block">Step 3: Formula</span>
                    <p className="font-mono text-indigo-600 font-bold">F = m × a</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block">Step 4 & 5: Substitution & Calculation</span>
                    <p className="font-mono">F = {forceM} kg × {forceA} m/s² = {forceM * forceA} N</p>
                  </div>
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 block">Step 6 & 7: Final Answer with SI Unit</span>
                    <p className="font-mono text-base font-bold text-emerald-700 dark:text-emerald-200">
                      প্রযুক্ত বলের মান = {forceM * forceA} নিউটন (N)
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg">
                    <span className="font-bold text-blue-900 dark:text-blue-200 block mb-1">Step 8: Explanation</span>
                    <p>
                      নিউটনের দ্বিতীয় গতিসূত্র অনুসারে বল হলো ভর এবং ত্বরণের গুণফল। ১ কেজি ভরের বস্তুতে ১ m/s² ত্বরণ সৃষ্টি করতে ১ নিউটন বল লাগে।
                    </p>
                  </div>
                </div>
              )}

              {selectedTopic === 'electricity-v-ir' && (
                <div className="space-y-3 text-xs">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block">Step 1: Given</span>
                    <p className="font-mono">রোধ (R) = {ohmR} Ω, তড়িৎপ্রবাহ (I) = {ohmI} A</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block">Step 2: To Find</span>
                    <p className="font-mono">বিভবপ্রভেদ (V) = ?</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block">Step 3: Formula</span>
                    <p className="font-mono text-indigo-600 font-bold">V = I × R (ওহমের সূত্র)</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block">Step 4 & 5: Calculation</span>
                    <p className="font-mono">V = {ohmI} × {ohmR} = {(ohmI * ohmR).toFixed(2)} V</p>
                  </div>
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 block">Step 6 & 7: Final Answer</span>
                    <p className="font-mono text-base font-bold text-emerald-700 dark:text-emerald-200">
                      বিভবপ্রভেদ = {(ohmI * ohmR).toFixed(2)} ভোল্ট (V)
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg">
                    <span className="font-bold text-blue-900 dark:text-blue-200 block mb-1">Step 8: Explanation</span>
                    <p>
                      ওহমের সূত্র অনুযায়ী নির্দিষ্ট উষ্ণতায় কোনো রোধের মধ্য দিয়ে কারেন্ট পাঠাতে তার দুই প্রান্তে প্রয়োজনীয় ভোল্টেজ হলো প্রবাহ ও রোধের গুণফলের সমান।
                    </p>
                  </div>
                </div>
              )}

              {selectedTopic === 'energy-pe-mgh' && (
                <div className="space-y-3 text-xs">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block">Step 1: Given</span>
                    <p className="font-mono">ভর (m) = {energyM} kg, উচ্চতা (h) = {energyH} m, g = 9.8 m/s²</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block">Step 2: To Find</span>
                    <p className="font-mono">স্থিতিশক্তি (PE) = ?</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block">Step 3: Formula</span>
                    <p className="font-mono text-indigo-600 font-bold">PE = m × g × h</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block">Step 4 & 5: Calculation</span>
                    <p className="font-mono">PE = {energyM} × 9.8 × {energyH} = {(energyM * 9.8 * energyH).toFixed(1)} J</p>
                  </div>
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 block">Step 6 & 7: Final Answer</span>
                    <p className="font-mono text-base font-bold text-emerald-700 dark:text-emerald-200">
                      স্থিতিশক্তি = {(energyM * 9.8 * energyH).toFixed(1)} জুল (J)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Custom AI Numerical Solver */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-900 dark:text-white block">
              যেকোনো পদার্থবিজ্ঞানের অঙ্ক এখানে লিখুন বা পেস্ট করুন:
            </label>
            <textarea
              rows={4}
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="উদাহরণ: একটি বাস স্থির অবস্থা থেকে শুরু করে ৩ m/s² সমত্বরণে ৬ সেকেন্ডে কতটা দূরত্ব যাবে?"
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />

            {/* Quick sample buttons */}
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 font-medium block">
                বা নিচের নমুনা প্রশ্নগুলোতে ক্লিক করুন:
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCustomQuestion(q)}
                    className="text-[11px] px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {q.slice(0, 36)}...
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCustomSolve}
              disabled={isSolving || !customQuestion.trim()}
              className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {isSolving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  এআই সমাধান তৈরি হচ্ছে...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  ধাপে ধাপে সম্পূর্ণ সমাধান দেখুন
                </>
              )}
            </button>
          </div>

          {solveError && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {solveError}
            </div>
          )}

          {aiSolution && (
            <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 border-b border-slate-200 dark:border-slate-700 pb-2">
                <CheckCircle2 className="w-4 h-4" />
                সঠিক এসআই একক ও ৮-ধাপ গাণিতিক সমাধান:
              </div>
              <div className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                {aiSolution}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
