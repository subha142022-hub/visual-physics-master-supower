import React, { useState } from 'react';
import { allFormulas } from '../../data/formulasData';
import { FormulaItem, ClassLevel } from '../../types/physics';
import { Search, Calculator, Bookmark, BookmarkCheck, Check, Sparkles, BookOpen } from 'lucide-react';

interface FormulaLibraryProps {
  currentClass: ClassLevel;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
}

export const FormulaLibrary: React.FC<FormulaLibraryProps> = ({
  currentClass,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<ClassLevel | 'all'>(currentClass);
  const [onlyBookmarks, setOnlyBookmarks] = useState<boolean>(false);

  // Keep state for calculator inputs of each formula
  const [calculatorInputs, setCalculatorInputs] = useState<Record<string, Record<string, number>>>(() => {
    const initial: Record<string, Record<string, number>> = {};
    allFormulas.forEach((f) => {
      initial[f.id] = {};
      f.variables.forEach((v) => {
        initial[f.id][v.symbol] = v.defaultValue;
      });
    });
    return initial;
  });

  const handleInputChange = (formulaId: string, symbol: string, value: number) => {
    setCalculatorInputs((prev) => ({
      ...prev,
      [formulaId]: {
        ...(prev[formulaId] || {}),
        [symbol]: value,
      },
    }));
  };

  const filteredFormulas = allFormulas.filter((f) => {
    if (onlyBookmarks && !bookmarkedIds.includes(f.id)) return false;
    if (selectedClassFilter !== 'all' && f.classLevel !== selectedClassFilter) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return (
      f.formula.toLowerCase().includes(q) ||
      f.nameBengali.toLowerCase().includes(q) ||
      f.nameEnglish.toLowerCase().includes(q) ||
      f.symbolMeanings.some((s) => s.meaningBengali.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              পদার্থবিজ্ঞানের সূত্রের ভাণ্ডার ও লাইভ ক্যালকুলেটর
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              প্রতিটি সূত্রের প্রতীকসমূহের অর্থ, একক, পরীক্ষার উদাহরণ এবং স্লাইডার দিয়ে লাইভ মান পরিবর্তনের অভিজ্ঞতা।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedClassFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedClassFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-indigo-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              সব সূত্র
            </button>
            <button
              onClick={() => setSelectedClassFilter('class-9')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedClassFilter === 'class-9'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Class 9
            </button>
            <button
              onClick={() => setSelectedClassFilter('class-10')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedClassFilter === 'class-10'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Class 10
            </button>
            <button
              onClick={() => setOnlyBookmarks(!onlyBookmarks)}
              className={`p-2 rounded-lg border transition-colors ${
                onlyBookmarks
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
              title="সংরক্ষিত সূত্র"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="সূত্র বা রাশির নাম দিয়ে খুঁজুন (যেমন: F = ma, v = u + at, ওহম, রোধ, বেগ)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Formula Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredFormulas.map((f) => {
          const isBookmarked = bookmarkedIds.includes(f.id);
          const currentInputs = calculatorInputs[f.id] || {};
          const calcResult = f.calculate(currentInputs);

          return (
            <div
              key={f.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all space-y-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <span>{f.classLevel === 'class-9' ? 'Class 9' : 'Class 10'}</span>
                    <span aria-hidden="true">·</span>
                    <span>এসআই একক: {f.siUnit}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    {f.nameBengali}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{f.nameEnglish}</p>
                </div>

                <button
                  onClick={() => onToggleBookmark(f.id)}
                  className="p-2 text-slate-400 hover:text-amber-500 transition-colors"
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-5 h-5 text-amber-500 fill-amber-500" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Big Formula Banner */}
              <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 block mb-0.5">
                    মূল সমীকরণ:
                  </span>
                  <div className="font-mono text-2xl font-black text-indigo-950 dark:text-indigo-200 tracking-wider">
                    {f.formula}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">ফলাফলের রাশি</span>
                  <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {f.resultSymbol} ({f.resultUnit})
                  </span>
                </div>
              </div>

              {/* Symbol Meanings Table */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200/60 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  প্রতীকসমূহের অর্থ ও একক:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {f.symbolMeanings.map((sym, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded bg-white dark:bg-slate-900 font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-2xs">
                        {sym.symbol}
                      </span>
                      <span className="text-slate-600 dark:text-slate-300">
                        = {sym.meaningBengali} ({sym.unit})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Calculator Section */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-emerald-500" />
                    লাইভ ইন্টারেক্টিভ ক্যালকুলেটর (মান পরিবর্তন করে ফলাফল দেখুন):
                  </span>
                </div>

                {/* Variable Sliders */}
                <div className="space-y-3">
                  {f.variables.map((v) => {
                    const currentVal = currentInputs[v.symbol] ?? v.defaultValue;
                    return (
                      <div key={v.symbol}>
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span className="text-slate-600 dark:text-slate-300">
                            {v.nameBengali}
                          </span>
                          <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                            {currentVal} {v.unit}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={v.min}
                          max={v.max}
                          step={v.step}
                          value={currentVal}
                          onChange={(e) =>
                            handleInputChange(f.id, v.symbol, Number(e.target.value))
                          }
                          className="w-full accent-indigo-600"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Output Display */}
                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    গণনাকৃত ফলাফল ({f.resultSymbol}):
                  </span>
                  <div className="text-right">
                    <span className="font-mono text-xl font-black text-emerald-600 dark:text-emerald-400">
                      {calcResult.result} {calcResult.unit}
                    </span>
                  </div>
                </div>

                {/* Calculation Steps */}
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 space-y-0.5">
                  {calcResult.steps.map((step, sIdx) => (
                    <div key={sIdx}>{step}</div>
                  ))}
                </div>
              </div>

              {/* Solved Example Problem */}
              <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 rounded-xl text-xs space-y-1">
                <span className="font-bold text-amber-900 dark:text-amber-200 block">
                  📝 পরীক্ষায় আসার মতো উদাহরণ:
                </span>
                <p className="text-slate-800 dark:text-slate-200">{f.exampleProblem.questionBengali}</p>
                <div className="text-[11px] font-mono text-amber-800 dark:text-amber-300 pt-1">
                  <strong>সমাধান:</strong> {f.exampleProblem.solution}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
