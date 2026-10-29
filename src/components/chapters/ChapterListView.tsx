import React, { useState } from 'react';
import { chapters } from '../../data/chaptersData';
import { Chapter, ClassLevel, BoardType } from '../../types/physics';
import { BookOpen, Zap, ArrowRight, CheckCircle2, Trophy, Search } from 'lucide-react';

interface ChapterListViewProps {
  currentClass: ClassLevel;
  currentBoard: BoardType;
  completedChapters: string[];
  quizScores: Record<string, number>;
  onSelectChapter: (id: string) => void;
  onOpenLab: (labType: string) => void;
}

export const ChapterListView: React.FC<ChapterListViewProps> = ({
  currentClass,
  currentBoard,
  completedChapters,
  quizScores,
  onSelectChapter,
  onOpenLab,
}) => {
  const [filterClass, setFilterClass] = useState<ClassLevel>(currentClass);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredChapters = chapters.filter((c) => {
    if (c.classLevel !== filterClass) return false;
    // Check if included in current board
    if (!c.boards.includes(currentBoard)) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.titleBengali.toLowerCase().includes(q) ||
      c.titleEnglish.toLowerCase().includes(q) ||
      c.shortDescBengali.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              {filterClass === 'class-9' ? 'Class 9' : 'Class 10'} পদার্থবিজ্ঞান সিলেবাস (
              {currentBoard.toUpperCase()})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              পশ্চিমবঙ্গ মধ্যশিক্ষা পর্ষদ ও CBSE-র অনুমোদিত সিলেবাস অনুযায়ী প্রতিটি অধ্যায়ের সম্পূর্ণ প্রস্তুতি।
            </p>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setFilterClass('class-9')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                filterClass === 'class-9'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Class 9
            </button>
            <button
              onClick={() => setFilterClass('class-10')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                filterClass === 'class-10'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Class 10
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="অধ্যায় খুঁজুন (যেমন: গতি, বল, নিউটন, আলো, তড়িৎ, শব্দ)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChapters.map((ch) => {
          const isCompleted = completedChapters.includes(ch.id);
          const score = quizScores[ch.id];

          return (
            <div
              key={ch.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                    অধ্যায় {ch.number}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        সম্পন্ন
                      </span>
                    )}
                    {score !== undefined && (
                      <span className="text-[11px] font-mono font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">
                        স্কোর: {score}%
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {ch.titleBengali}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{ch.titleEnglish}</p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                  {ch.shortDescBengali}
                </p>

                {/* Highlights tags */}
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300">
                    📖 {ch.keyConcepts.length}টি মৌলিক ধারণা
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300">
                    📐 {ch.formulas.length}টি প্রধান সূত্র
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300">
                    ✍️ {ch.solvedNumericals.length}টি সমাধানকৃত অঙ্ক
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <button
                  onClick={() => onSelectChapter(ch.id)}
                  className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>অধ্যায় বিস্তারিত পড়ুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                {ch.labType && (
                  <button
                    onClick={() => onOpenLab(ch.labType!)}
                    className="p-2.5 border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 rounded-xl transition-colors"
                    title="ভিজুয়াল ল্যাব চালু করুন"
                  >
                    <Zap className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
