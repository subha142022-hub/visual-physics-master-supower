import React from 'react';
import { Atom, Heart, BookOpen, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 transition-colors mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Atom className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                Visual Physics Master
              </span>
              <p className="text-xs text-slate-500">Physics বুঝো ছবিতে, শেখো সহজে।</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <span>West Bengal Board (WBBSE)</span>
            <span>·</span>
            <span>CBSE Curriculum</span>
            <span>·</span>
            <span>Class 9 & 10 Physical Science</span>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Visual Physics Master. সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1">
            শিক্ষার্থীদের জন্য সহজ বাংলায় তৈরি <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
