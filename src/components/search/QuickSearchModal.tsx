import React, { useState } from 'react';
import { Search, X, BookOpen, Calculator, Atom, Zap, ArrowRight } from 'lucide-react';
import { allDefinitions } from '../../data/definitionsData';
import { allFormulas } from '../../data/formulasData';
import { chapters } from '../../data/chaptersData';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDefinition: (id: string) => void;
  onSelectFormula: (id: string) => void;
  onSelectChapter: (id: string) => void;
  onSelectLab: (labType: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectDefinition,
  onSelectFormula,
  onSelectChapter,
  onSelectLab,
}) => {
  const [query, setQuery] = useState<string>('');

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingDefinitions = q
    ? allDefinitions.filter(
        (d) =>
          d.conceptBengali.toLowerCase().includes(q) ||
          d.conceptEnglish.toLowerCase().includes(q) ||
          d.defBengali.toLowerCase().includes(q)
      )
    : [];

  const matchingFormulas = q
    ? allFormulas.filter(
        (f) =>
          f.formula.toLowerCase().includes(q) ||
          f.nameBengali.toLowerCase().includes(q) ||
          f.nameEnglish.toLowerCase().includes(q)
      )
    : [];

  const matchingChapters = q
    ? chapters.filter(
        (c) =>
          c.titleBengali.toLowerCase().includes(q) ||
          c.titleEnglish.toLowerCase().includes(q)
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            placeholder="পদার্থবিজ্ঞানের সংজ্ঞা, সূত্র বা অধ্যায় অনুসন্ধান করুন..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm focus:outline-none text-slate-900 dark:text-white"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!q && (
            <div className="text-center py-8 text-xs text-slate-400">
              অনুসন্ধান করতে টাইপ করুন (যেমন: "বেগ", "F = ma", "ওহমের সূত্র", "আলো", "লেন্স")...
            </div>
          )}

          {/* Chapters */}
          {matchingChapters.length > 0 && (
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-2">
                অধ্যায়সমূহ:
              </span>
              {matchingChapters.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => {
                    onSelectChapter(ch.id);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {ch.titleBengali}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{ch.titleEnglish}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ))}
            </div>
          )}

          {/* Formulas */}
          {matchingFormulas.length > 0 && (
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-2">
                সূত্রসমূহ:
              </span>
              {matchingFormulas.map((f) => (
                <div
                  key={f.id}
                  onClick={() => {
                    onSelectFormula(f.id);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Calculator className="w-4 h-4 text-sky-600" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                        {f.formula} — {f.nameBengali}
                      </div>
                      <span className="text-[10px] text-slate-400">একক: {f.siUnit}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ))}
            </div>
          )}

          {/* Definitions */}
          {matchingDefinitions.length > 0 && (
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-2">
                সংজ্ঞাসমূহ:
              </span>
              {matchingDefinitions.map((d) => (
                <div
                  key={d.id}
                  onClick={() => {
                    onSelectDefinition(d.id);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Atom className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {d.conceptBengali}
                      </div>
                      <span className="text-[10px] text-slate-400 line-clamp-1">{d.defBengali}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ))}
            </div>
          )}

          {q &&
            matchingChapters.length === 0 &&
            matchingFormulas.length === 0 &&
            matchingDefinitions.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-400">
                "{query}" সংক্রান্ত কিছু পাওয়া যায়নি।
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
