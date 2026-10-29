import React, { useState } from 'react';
import { allDefinitions } from '../../data/definitionsData';
import { Definition, ClassLevel } from '../../types/physics';
import { Search, Bookmark, BookmarkCheck, Check, Sparkles, BookOpen, HelpCircle, Layers } from 'lucide-react';

interface DefinitionSystemProps {
  currentClass: ClassLevel;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
}

export const DefinitionSystem: React.FC<DefinitionSystemProps> = ({
  currentClass,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<ClassLevel | 'all'>(currentClass);
  const [onlyBookmarks, setOnlyBookmarks] = useState<boolean>(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const filteredDefs = allDefinitions.filter((item) => {
    if (onlyBookmarks && !bookmarkedIds.includes(item.id)) return false;
    if (selectedClassFilter !== 'all' && item.classLevel !== selectedClassFilter) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.conceptBengali.toLowerCase().includes(q) ||
      item.conceptEnglish.toLowerCase().includes(q) ||
      item.defBengali.toLowerCase().includes(q) ||
      item.easyExplanation.toLowerCase().includes(q) ||
      (item.formula && item.formula.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              পদার্থবিজ্ঞানের সহজ সংজ্ঞা সংগ্রহ (Definition Cards)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              প্রতিটি সংজ্ঞায় ৯টি গুরুত্বপূর্ণ বিষয়: সহজ বাংলা, ইংরেজি, সহজ ব্যাখ্যা, বাস্তব উদাহরণ, সূত্র, এসআই একক, পরীক্ষার উত্তর ও একঝলকে রিভিশন।
            </p>
          </div>

          {/* Class Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedClassFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedClassFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-sky-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              সব চ্যাপ্টার
            </button>
            <button
              onClick={() => setSelectedClassFilter('class-9')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedClassFilter === 'class-9'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Class 9
            </button>
            <button
              onClick={() => setSelectedClassFilter('class-10')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedClassFilter === 'class-10'
                  ? 'bg-sky-600 text-white'
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
              title="শুধু সংরক্ষিত সংজ্ঞা দেখুন"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="বাংলা বা ইংরেজিতে সার্চ করুন (যেমন: বেগ, সরণ, ওহম, আলো, ত্বরণ)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Definition Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDefs.map((def) => {
          const isBookmarked = bookmarkedIds.includes(def.id);
          const isExpanded = expandedCardId === def.id;

          return (
            <div
              key={def.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
                      <span>{def.classLevel === 'class-9' ? 'Class 9' : 'Class 10'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{def.isVector !== undefined ? (def.isVector ? 'ভেক্টর রাশি' : 'স্কেলার রাশি') : 'ভৌত রাশি'}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                      {def.conceptBengali}
                    </h3>
                    <p className="text-xs font-medium text-slate-400 font-mono">
                      {def.conceptEnglish}
                    </p>
                  </div>

                  <button
                    onClick={() => onToggleBookmark(def.id)}
                    className="p-2 text-slate-400 hover:text-amber-500 transition-colors"
                    title={isBookmarked ? 'বুকমার্ক সরান' : 'বুকমার্ক করুন'}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-5 h-5 text-amber-500 fill-amber-500" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* 1. Bengali Definition */}
                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  <span className="font-bold text-sky-700 dark:text-sky-300 block text-xs mb-1">
                    📖 সহজ বাংলা সংজ্ঞা:
                  </span>
                  {def.defBengali}
                </div>

                {/* 2. English Definition */}
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-mono italic">
                  <strong>English:</strong> "{def.defEnglish}"
                </div>

                {/* 3. Easy Explanation */}
                <div className="mt-3 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <span className="font-semibold text-slate-900 dark:text-white block">
                    💡 সহজ কথায়:
                  </span>
                  <p>{def.easyExplanation}</p>
                </div>

                {/* 4. Real-life example */}
                <div className="mt-3 p-2.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 rounded-lg text-xs text-emerald-900 dark:text-emerald-300">
                  <span className="font-bold block mb-0.5">🌱 বাস্তব জীবনের উদাহরণ:</span>
                  {def.realLifeExample}
                </div>

                {/* Formula & SI Unit Badges */}
                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[11px]">প্রয়োজনীয় সূত্র:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {def.formula || 'প্রযোজ্য নয়'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[11px]">এসআই (SI) একক:</span>
                    <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                      {def.siUnit || 'এককহীন'}
                    </span>
                  </div>
                </div>

                {/* 8. Exam-Ready Answer & 9. One-Line Revision toggle */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-lg text-xs text-amber-900 dark:text-amber-200">
                      <span className="font-bold block mb-1">✍️ পরীক্ষার খাতায় যেভাবে লিখবে:</span>
                      <p className="leading-relaxed">{def.examAnswer}</p>
                    </div>

                    <div className="p-2.5 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/60 rounded-lg text-xs text-sky-900 dark:text-sky-200 font-medium">
                      ⚡ <span className="font-bold">এক ঝলকে রিভিশন:</span> {def.oneLineRevision}
                    </div>
                  </div>
                )}
              </div>

              {/* Expand button */}
              <button
                onClick={() => setExpandedCardId(isExpanded ? null : def.id)}
                className="w-full py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors text-center"
              >
                {isExpanded ? 'সংক্ষিপ্ত করুন ▲' : 'পরীক্ষার সম্পূর্ণ উত্তর ও একঝলকে রিভিশন দেখুন ▼'}
              </button>
            </div>
          );
        })}
      </div>

      {filteredDefs.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            কোনো সংজ্ঞা পাওয়া যায়নি
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            অনুগ্রহ করে অন্য শব্দ বা চ্যাপ্টার দিয়ে অনুসন্ধান করুন।
          </p>
        </div>
      )}
    </div>
  );
};
