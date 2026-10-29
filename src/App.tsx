import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { ChapterListView } from './components/chapters/ChapterListView';
import { ChapterDetailView } from './components/chapters/ChapterDetailView';
import { VisualLabHub } from './components/visuals/VisualLabHub';
import { NumericalSolver } from './components/solver/NumericalSolver';
import { FormulaLibrary } from './components/formulas/FormulaLibrary';
import { DefinitionSystem } from './components/definitions/DefinitionSystem';
import { PracticeSystem } from './components/practice/PracticeSystem';
import { AITutor } from './components/tutor/AITutor';
import { QuickSearchModal } from './components/search/QuickSearchModal';
import { chapters } from './data/chaptersData';
import { ClassLevel, BoardType, UserProgress, LabType } from './types/physics';

const LOCAL_STORAGE_KEY = 'vpm_user_progress_v1';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('vpm_theme') === 'dark';
  });

  // Current view
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [initialLabType, setInitialLabType] = useState<LabType>('motion');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // User progress persisted in localStorage
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user progress', e);
      }
    }
    return {
      selectedClass: 'class-9',
      selectedBoard: 'wbbse',
      completedChapters: ['ch9-motion'],
      bookmarkedDefinitions: ['def-velocity', 'def-electric-current'],
      bookmarkedFormulas: ['f-v-u-at', 'f-v-ir'],
      quizScores: { 'ch9-motion': 85 },
      dailyStreak: 3,
      lastActiveDate: new Date().toISOString().split('T')[0],
      totalQuestionsAnswered: 15,
      correctAnswersCount: 13,
    };
  });

  // Sync dark mode class with HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('vpm_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('vpm_theme', 'light');
    }
  }, [isDarkMode]);

  // Persist progress changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // Toggle dark mode
  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Switch class
  const handleSelectClass = (cls: ClassLevel) => {
    setProgress((prev) => ({ ...prev, selectedClass: cls }));
    // If currently looking at a chapter from a different class, reset to list
    if (selectedChapterId) {
      const ch = chapters.find((c) => c.id === selectedChapterId);
      if (ch && ch.classLevel !== cls) {
        setSelectedChapterId(null);
      }
    }
  };

  // Switch board
  const handleSelectBoard = (b: BoardType) => {
    setProgress((prev) => ({ ...prev, selectedBoard: b }));
  };

  // Toggle Definition Bookmark
  const handleToggleDefinitionBookmark = (id: string) => {
    setProgress((prev) => {
      const exists = prev.bookmarkedDefinitions.includes(id);
      return {
        ...prev,
        bookmarkedDefinitions: exists
          ? prev.bookmarkedDefinitions.filter((item) => item !== id)
          : [...prev.bookmarkedDefinitions, id],
      };
    });
  };

  // Toggle Formula Bookmark
  const handleToggleFormulaBookmark = (id: string) => {
    setProgress((prev) => {
      const exists = prev.bookmarkedFormulas.includes(id);
      return {
        ...prev,
        bookmarkedFormulas: exists
          ? prev.bookmarkedFormulas.filter((item) => item !== id)
          : [...prev.bookmarkedFormulas, id],
      };
    });
  };

  // Update Quiz Score
  const handleUpdateQuizScore = (chapterId: string, scorePct: number) => {
    setProgress((prev) => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [chapterId]: Math.max(scorePct, prev.quizScores[chapterId] || 0),
      },
      completedChapters: prev.completedChapters.includes(chapterId)
        ? prev.completedChapters
        : [...prev.completedChapters, chapterId],
    }));
  };

  // Open specific chapter
  const handleOpenChapter = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setActiveTab('chapters');
  };

  // Open specific lab
  const handleOpenLab = (labType: string) => {
    setInitialLabType(labType as LabType);
    setActiveTab('visual-lab');
    setSelectedChapterId(null);
  };

  // Selected chapter object if in detail view
  const activeChapterObj = selectedChapterId
    ? chapters.find((c) => c.id === selectedChapterId)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'chapters') setSelectedChapterId(null);
        }}
        selectedClass={progress.selectedClass}
        onSelectClass={handleSelectClass}
        selectedBoard={progress.selectedBoard}
        onSelectBoard={handleSelectBoard}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main App Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: Home Dashboard */}
        {activeTab === 'home' && (
          <StudentDashboard
            progress={progress}
            onSelectClass={handleSelectClass}
            onSelectBoard={handleSelectBoard}
            onOpenChapter={handleOpenChapter}
            onOpenLab={handleOpenLab}
          />
        )}

        {/* TAB 2: Chapters & Detail View */}
        {activeTab === 'chapters' && (
          <>
            {activeChapterObj ? (
              <ChapterDetailView
                chapter={activeChapterObj}
                onBack={() => setSelectedChapterId(null)}
                onOpenLab={handleOpenLab}
                onStartQuiz={(chId) => {
                  setSelectedChapterId(null);
                  setActiveTab('practice');
                }}
              />
            ) : (
              <ChapterListView
                currentClass={progress.selectedClass}
                currentBoard={progress.selectedBoard}
                completedChapters={progress.completedChapters}
                quizScores={progress.quizScores}
                onSelectChapter={handleOpenChapter}
                onOpenLab={handleOpenLab}
              />
            )}
          </>
        )}

        {/* TAB 3: Visual Lab */}
        {activeTab === 'visual-lab' && (
          <VisualLabHub initialLab={initialLabType} />
        )}

        {/* TAB 4: Numerical Solver */}
        {activeTab === 'solver' && (
          <NumericalSolver currentClass={progress.selectedClass} />
        )}

        {/* TAB 5: Formula Library */}
        {activeTab === 'formulas' && (
          <FormulaLibrary
            currentClass={progress.selectedClass}
            bookmarkedIds={progress.bookmarkedFormulas}
            onToggleBookmark={handleToggleFormulaBookmark}
          />
        )}

        {/* TAB 6: Definition Cards */}
        {activeTab === 'definitions' && (
          <DefinitionSystem
            currentClass={progress.selectedClass}
            bookmarkedIds={progress.bookmarkedDefinitions}
            onToggleBookmark={handleToggleDefinitionBookmark}
          />
        )}

        {/* TAB 7: Practice & Examination */}
        {activeTab === 'practice' && (
          <PracticeSystem
            currentClass={progress.selectedClass}
            onUpdateScore={handleUpdateQuizScore}
          />
        )}

        {/* TAB 8: AI Physics Tutor */}
        {activeTab === 'ai-tutor' && (
          <AITutor currentClass={progress.selectedClass} />
        )}
      </main>

      {/* Global Quick Search Modal */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectChapter={handleOpenChapter}
        onSelectFormula={(fId) => {
          setActiveTab('formulas');
          setSelectedChapterId(null);
        }}
        onSelectDefinition={(dId) => {
          setActiveTab('definitions');
          setSelectedChapterId(null);
        }}
        onSelectLab={handleOpenLab}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
