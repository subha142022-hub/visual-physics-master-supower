import React from 'react';
import { Chapter, ClassLevel, BoardType, UserProgress } from '../../types/physics';
import { chapters } from '../../data/chaptersData';
import {
  Trophy,
  Flame,
  CheckCircle,
  Clock,
  ArrowRight,
  BookOpen,
  AlertTriangle,
  Bookmark,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';

interface StudentDashboardProps {
  progress: UserProgress;
  onSelectClass: (c: ClassLevel) => void;
  onSelectBoard: (b: BoardType) => void;
  onOpenChapter: (chapterId: string) => void;
  onOpenLab: (labType: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  progress,
  onSelectClass,
  onSelectBoard,
  onOpenChapter,
  onOpenLab,
}) => {
  const currentClassChapters = chapters.filter((c) => c.classLevel === progress.selectedClass);

  // Overall syllabus progress %
  const completedCount = progress.completedChapters.length;
  const progressPct = Math.min(
    100,
    Math.round((completedCount / Math.max(1, currentClassChapters.length)) * 100)
  );

  // Average quiz score
  const scoreValues = Object.values(progress.quizScores);
  const avgScore =
    scoreValues.length > 0
      ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
      : 80;

  // Weak chapters identification
  const weakChapters = currentClassChapters.filter((c) => {
    const s = progress.quizScores[c.id];
    return s !== undefined && s < 60;
  });

  return (
    <div className="space-y-6">
      {/* Top Welcome & Board/Class Switcher Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
                Visual Physics Master
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-amber-400 text-xs font-medium flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                {progress.dailyStreak} দিনের লার্নিং স্ট্রিক!
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Physics বুঝো ছবিতে, শেখো সহজে।
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              পশ্চিমবঙ্গ মধ্যশিক্ষা পর্ষদ (WBBSE) ও CBSE সিলেবাসের পূর্ণাঙ্গ পদার্থবিজ্ঞান ভিজুয়াল ল্যাব, গাণিতিক সমাধান ও এআই টিউটর।
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => onOpenChapter(currentClassChapters[0]?.id || 'ch9-motion')}
                className="py-2.5 px-5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                <span>পড়া চালিয়ে যান (Continue Learning)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Class & Board Toggles */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-3 shrink-0">
            <div>
              <span className="text-[11px] text-slate-300 block mb-1">শ্রেণি নির্বাচন:</span>
              <div className="flex bg-black/30 p-1 rounded-xl">
                <button
                  onClick={() => onSelectClass('class-9')}
                  className={`flex-1 px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    progress.selectedClass === 'class-9'
                      ? 'bg-indigo-500 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Class 9
                </button>
                <button
                  onClick={() => onSelectClass('class-10')}
                  className={`flex-1 px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    progress.selectedClass === 'class-10'
                      ? 'bg-indigo-500 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Class 10
                </button>
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-300 block mb-1">বোর্ড নির্বাচন:</span>
              <div className="flex bg-black/30 p-1 rounded-xl">
                <button
                  onClick={() => onSelectBoard('wbbse')}
                  className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    progress.selectedBoard === 'wbbse'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  WBBSE (মাধ্যমিক)
                </button>
                <button
                  onClick={() => onSelectBoard('cbse')}
                  className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    progress.selectedBoard === 'cbse'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  CBSE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">সিলেবাস সম্পন্ন</span>
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
              {progressPct}%
            </span>
            <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">ডেইলি লার্নিং স্ট্রিক</span>
            <span className="text-xl font-bold font-mono text-amber-500 mt-1 block">
              {progress.dailyStreak} দিন
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">প্রতিদিন নতুন শিখুন</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
            <Flame className="w-5 h-5 fill-amber-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">গড় কুইজ স্কোর</span>
            <span className="text-xl font-bold font-mono text-emerald-600 mt-1 block">
              {avgScore}%
            </span>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">চমৎকার দক্ষতা!</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">সংরক্ষিত সূত্র ও সংজ্ঞা</span>
            <span className="text-xl font-bold font-mono text-sky-600 mt-1 block">
              {progress.bookmarkedDefinitions.length + progress.bookmarkedFormulas.length} টি
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">রিভিশন রেডি</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
            <Bookmark className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Weak Chapters Alert if any */}
      {weakChapters.length > 0 && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">
                রিভিশন অ্যালার্ট: এই অধ্যায়গুলোতে পুনরায় অনুশীলন প্রয়োজন!
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300">
                {weakChapters.map((w) => w.titleBengali).join(', ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenChapter(weakChapters[0].id)}
            className="py-1.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shrink-0 transition-colors"
          >
            এখনই রিভিশন দিন
          </button>
        </div>
      )}

      {/* Chapter Cards Grid for Selected Class */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{progress.selectedClass === 'class-9' ? 'Class 9' : 'Class 10'} পদার্থবিজ্ঞান সিলেবাস</span>
            <span className="text-xs font-normal text-slate-400">
              ({progress.selectedBoard.toUpperCase()})
            </span>
          </h2>
          <span className="text-xs text-slate-400">
            মোট {currentClassChapters.length}টি মূল অধ্যায়
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentClassChapters.map((ch) => {
            const isCompleted = progress.completedChapters.includes(ch.id);
            const score = progress.quizScores[ch.id];

            return (
              <div
                key={ch.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                      অধ্যায় {ch.number}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {ch.practiceQuestions.length} অনুশীলন প্রশ্ন
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                    {ch.titleBengali}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{ch.titleEnglish}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {ch.shortDescBengali}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">
                      {ch.formulas.length} সূত্র · {ch.definitions.length} সংজ্ঞা
                    </span>
                    {score !== undefined && (
                      <span className="font-mono font-bold text-emerald-600">
                        স্কোর: {score}%
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onOpenChapter(ch.id)}
                      className="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors text-center"
                    >
                      অধ্যায় পড়ুন
                    </button>
                    {ch.labType && (
                      <button
                        onClick={() => onOpenLab(ch.labType!)}
                        className="p-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-300 rounded-xl transition-colors"
                        title="সরাসরি ভিজুয়াল ল্যাব খুলুন"
                      >
                        <Zap className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
