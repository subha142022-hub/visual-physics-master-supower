import React, { useState } from 'react';
import { Chapter } from '../../types/physics';
import { MotionLab } from '../visuals/MotionLab';
import { NewtonLab } from '../visuals/NewtonLab';
import { GravitationEnergyLab } from '../visuals/GravitationEnergyLab';
import { SoundWaveLab } from '../visuals/SoundWaveLab';
import { OpticsLab } from '../visuals/OpticsLab';
import { CircuitLab } from '../visuals/CircuitLab';
import {
  ArrowLeft,
  BookOpen,
  Target,
  FileText,
  Lightbulb,
  Zap,
  Calculator,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Bookmark,
  Share2
} from 'lucide-react';

interface ChapterDetailViewProps {
  chapter: Chapter;
  onBack: () => void;
  onOpenLab: (labType: string) => void;
  onStartQuiz: (chapterId: string) => void;
}

export const ChapterDetailView: React.FC<ChapterDetailViewProps> = ({
  chapter,
  onBack,
  onOpenLab,
  onStartQuiz,
}) => {
  const [activeSection, setActiveSection] = useState<string>('intro');

  const sections = [
    { id: 'intro', label: '১. ভূমিকা ও উদ্দেশ্য', icon: BookOpen },
    { id: 'concepts', label: '২. মৌলিক ধারণা', icon: Target },
    { id: 'visual', label: '৩. ভিজুয়াল অ্যানিমেশন', icon: Zap },
    { id: 'definitions', label: '৪. সংজ্ঞাসমূহ', icon: FileText },
    { id: 'formulas', label: '৫. সূত্রের প্রয়োগ', icon: Calculator },
    { id: 'numericals', label: '৬. সমাধানকৃত অঙ্ক', icon: HelpCircle },
    { id: 'mistakes', label: '৭. সাধারণ ভুল ও সতর্কতা', icon: AlertTriangle },
    { id: 'summary', label: '৮. সারাংশ ও কুইজ', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Chapter Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            সব অধ্যায়ে ফিরে যান
          </button>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400 font-mono">
              Class {chapter.classLevel === 'class-9' ? '9' : '10'}
            </span>
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold rounded">
              {chapter.boards.map((b) => b.toUpperCase()).join(' & ')}
            </span>
          </div>
        </div>

        <div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
            অধ্যায় {chapter.number}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {chapter.titleBengali}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">
            {chapter.titleEnglish}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            {chapter.shortDescBengali}
          </p>
        </div>

        {/* Section Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 scrollbar-none border-t border-slate-100 dark:border-slate-800">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-indigo-600 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Areas based on Active Section */}
      <div className="space-y-6">
        {/* SECTION 1: Intro & Learning Objectives */}
        {activeSection === 'intro' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                শিখন উদ্দেশ্য (Learning Objectives)
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                এই অধ্যায়টি সম্পূর্ণ করার পর তুমি যা যা আয়ত্ত করতে পারবে:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {chapter.learningObjectivesBengali.map((obj, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
                  সরাসরি ভিজুয়াল ল্যাবে পরীক্ষা করতে চাও?
                </h4>
                <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-0.5">
                  এই অধ্যায়ের জন্য তৈরি ইন্টারঅ্যাক্টিভ সিমুলেশনে গাড়ি, রশ্মি বা বর্তনী চালিয়ে দেখো!
                </p>
              </div>
              <button
                onClick={() => setActiveSection('visual')}
                className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
              >
                ভিজুয়াল ল্যাব চালু করো →
              </button>
            </div>
          </div>
        )}

        {/* SECTION 2: Basic Concepts */}
        {activeSection === 'concepts' && (
          <div className="space-y-4">
            {chapter.keyConcepts.map((concept, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    ধারণা {idx + 1}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {concept.titleBengali}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{concept.titleEnglish}</p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                  {concept.summaryBengali}
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {concept.contentBengali.map((para, pIdx) => (
                    <p key={pIdx}>• {para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SECTION 3: Visual Animation Lab */}
        {activeSection === 'visual' && (
          <div>
            {chapter.labType === 'motion' && <MotionLab />}
            {chapter.labType === 'newton-laws' && <NewtonLab />}
            {chapter.labType === 'gravitation-energy' && <GravitationEnergyLab />}
            {chapter.labType === 'sound-waves' && <SoundWaveLab />}
            {chapter.labType === 'light-optics' && <OpticsLab />}
            {chapter.labType === 'circuits' && <CircuitLab />}
            {!chapter.labType && <MotionLab />}
          </div>
        )}

        {/* SECTION 4: Important Definitions */}
        {activeSection === 'definitions' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              এই অধ্যায়ের গুরুত্বপূর্ণ সংজ্ঞাসমূহ:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chapter.definitions.map((def) => (
                <div
                  key={def.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-2"
                >
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {def.conceptBengali}
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg">
                    {def.defBengali}
                  </p>
                  <div className="text-xs text-slate-500">
                    <strong>এসআই একক:</strong> {def.siUnit || 'প্রযোজ্য নয়'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: Formulas */}
        {activeSection === 'formulas' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              এই অধ্যায়ের গাণিতিক সূত্রসমূহ:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chapter.formulas.map((f) => (
                <div
                  key={f.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3"
                >
                  <div className="font-mono text-xl font-black text-indigo-600 dark:text-indigo-400">
                    {f.formula}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {f.nameBengali}
                  </h4>
                  <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    {f.symbolMeanings.map((sym, sIdx) => (
                      <div key={sIdx}>
                        {sym.symbol} = {sym.meaningBengali} ({sym.unit})
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 6: Solved Numericals */}
        {activeSection === 'numericals' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              পরীক্ষায় আসার মতো ধাপে ধাপে সমাধানকৃত অঙ্ক:
            </h3>
            {chapter.solvedNumericals.map((num) => (
              <div
                key={num.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 font-mono">
                    অঙ্ক #{num.id}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                    মান: {num.difficulty}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {num.questionBengali}
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      প্রদত্ত (Given):
                    </span>
                    {num.given.map((g, gIdx) => (
                      <div key={gIdx} className="font-mono text-slate-600 dark:text-slate-400">
                        • {g.name}: {g.symbol} = {g.value}
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      সমাধানের ধাপসমূহ:
                    </span>
                    {num.steps.map((st, stIdx) => (
                      <div key={stIdx} className="text-slate-700 dark:text-slate-300">
                        {st}
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                      চূড়ান্ত উত্তর:
                    </span>
                    <p className="font-bold text-emerald-700 dark:text-emerald-200 font-mono text-sm mt-0.5">
                      {num.finalAnswer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SECTION 7: Common Mistakes */}
        {activeSection === 'mistakes' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              ছাত্রছাত্রীরা সাধারণত যে ভুলগুলো করে ও সতর্কবার্তা:
            </h3>

            <div className="space-y-3">
              {chapter.commonMistakes.map((mis, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-rose-100 dark:border-rose-950/60 bg-rose-50/50 dark:bg-rose-950/20 space-y-2 text-xs"
                >
                  <div className="flex items-start gap-2 text-rose-800 dark:text-rose-300 font-semibold">
                    <span className="shrink-0">❌ সাধারণ ভুল:</span>
                    <span>{mis.mistakeBengali}</span>
                  </div>
                  <div className="flex items-start gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
                    <span className="shrink-0">✅ সঠিক সত্য:</span>
                    <span>{mis.correctFactBengali}</span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 pl-6">
                    <strong>কেন গুরুত্বপূর্ণ:</strong> {mis.whyItMatters}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 8: Summary and Chapter Test CTA */}
        {activeSection === 'summary' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                একনজরে অধ্যায় সারাংশ (Chapter Summary):
              </h3>
              <div className="space-y-2">
                {chapter.summaryPointsBengali.map((pt, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-indigo-500 to-sky-600 rounded-2xl text-white space-y-3 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
              <div>
                <h4 className="text-lg font-bold">তুমি কি এই অধ্যায়ের কুইজ দিতে প্রস্তুত?</h4>
                <p className="text-xs text-indigo-100 mt-1">
                  ১০টি বাছাই করা প্রশ্ন দিয়ে নিজের প্রস্তুতি যাচাই করো।
                </p>
              </div>
              <button
                onClick={() => onStartQuiz(chapter.id)}
                className="py-3 px-6 bg-white text-indigo-700 font-bold text-xs rounded-xl hover:bg-indigo-50 transition-colors shadow-sm"
              >
                অধ্যায় কুইজ শুরু করুন →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
