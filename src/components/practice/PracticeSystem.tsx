import React, { useState, useEffect } from 'react';
import { chapters } from '../../data/chaptersData';
import { Chapter, PracticeQuestion, ClassLevel } from '../../types/physics';
import { CheckCircle2, XCircle, HelpCircle, Trophy, Timer, RotateCcw, ArrowRight, BookOpen } from 'lucide-react';

interface PracticeSystemProps {
  currentClass: ClassLevel;
  onUpdateScore: (chapterId: string, scorePct: number) => void;
}

export const PracticeSystem: React.FC<PracticeSystemProps> = ({ currentClass, onUpdateScore }) => {
  const [activeTab, setActiveTab] = useState<'chapter-quiz' | 'mock-test' | 'written-qa'>('chapter-quiz');

  // Filter chapters for current class
  const classChapters = chapters.filter((c) => c.classLevel === currentClass);
  const [selectedChapterId, setSelectedChapterId] = useState<string>(classChapters[0]?.id || 'ch9-motion');

  const currentChapter = classChapters.find((c) => c.id === selectedChapterId) || classChapters[0];
  const questions: PracticeQuestion[] = currentChapter?.practiceQuestions || [];

  // Quiz state
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Timed mock test state
  const [mockTimer, setMockTimer] = useState<number>(600); // 10 minutes = 600 seconds
  const [isMockRunning, setIsMockRunning] = useState<boolean>(false);

  // Pool of all questions for mock test
  const allMockQuestions: PracticeQuestion[] = chapters
    .filter((c) => c.classLevel === currentClass)
    .flatMap((c) => c.practiceQuestions);

  const [mockQIndex, setMockQIndex] = useState<number>(0);
  const [mockAnswers, setMockAnswers] = useState<Record<number, number>>({});
  const [mockFinished, setMockFinished] = useState<boolean>(false);

  // Timer countdown
  useEffect(() => {
    if (!isMockRunning || mockFinished) return;
    const interval = setInterval(() => {
      setMockTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setMockFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isMockRunning, mockFinished]);

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    const q = questions[currentQIndex];
    if (selectedOption === q.correctOptionIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      const finalScorePct = Math.round(((score + (selectedOption === questions[currentQIndex]?.correctOptionIndex ? 1 : 0)) / questions.length) * 100);
      onUpdateScore(selectedChapterId, finalScorePct);
    }
  };

  const resetChapterQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  const currentQ = questions[currentQIndex];

  return (
    <div className="space-y-6">
      {/* Tab Switcher Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              অনুশীলন ও মক টেস্ট (Practice & Examination)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              অধ্যায়ভিত্তিক MCQ কুইজ, পূর্ণাঙ্গ ব্যাখ্যা, ভুল উত্তরের কারণ বিশ্লেষণ এবং পরীক্ষার প্রস্তুতি।
            </p>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('chapter-quiz')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'chapter-quiz'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              অধ্যায়ভিত্তিক MCQ
            </button>
            <button
              onClick={() => setActiveTab('mock-test')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'mock-test'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              টাইমড মক টেস্ট
            </button>
            <button
              onClick={() => setActiveTab('written-qa')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'written-qa'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              সংক্ষিপ্ত ও বর্ণনামূলক প্রশ্নোত্তর
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'chapter-quiz' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chapter Selector (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              অধ্যায় বেছে নিন:
            </h3>
            {classChapters.map((ch) => (
              <button
                key={ch.id}
                onClick={() => {
                  setSelectedChapterId(ch.id);
                  resetChapterQuiz();
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  selectedChapterId === ch.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div>
                  <span className="text-[10px] block opacity-80">অধ্যায় {ch.number}</span>
                  <div className="text-xs font-bold">{ch.titleBengali}</div>
                </div>
                <span className="text-xs opacity-80">
                  {ch.practiceQuestions.length} প্রশ্ন
                </span>
              </button>
            ))}
          </div>

          {/* Quiz Card (8 cols) */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
              {!quizFinished && currentQ ? (
                <>
                  {/* Progress & Tracker */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      প্রশ্ন {currentQIndex + 1} / {questions.length}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      স্কোর: {score}
                    </span>
                  </div>

                  {/* Question */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                    {currentQ.questionBengali}
                  </h3>

                  {/* Options */}
                  <div className="space-y-3">
                    {currentQ.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === currentQ.correctOptionIndex;

                      let btnStyle = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';

                      if (isAnswerSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                        } else if (isSelected) {
                          btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                        } else {
                          btnStyle = 'opacity-60 border-slate-200 dark:border-slate-800';
                        }
                      } else if (isSelected) {
                        btnStyle = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold';
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(idx)}
                          disabled={isAnswerSubmitted}
                          className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center font-bold text-xs shrink-0">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{opt}</span>
                          </div>

                          {isAnswerSubmitted && (
                            <div>
                              {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                              {!isCorrect && isSelected && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Submit / Next Button */}
                  <div className="pt-2">
                    {!isAnswerSubmitted ? (
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={selectedOption === null}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors"
                      >
                        উত্তর জমা দিন
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        {currentQIndex < questions.length - 1 ? 'পরবর্তী প্রশ্ন' : 'ফলাফল দেখুন'}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Deep Explanation Box */}
                  {isAnswerSubmitted && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2 text-xs">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        💡 পদার্থবিজ্ঞান শিক্ষকের ব্যাখ্যা:
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {currentQ.explanationBengali}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                /* Quiz Finished Report */
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center mx-auto">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    অধ্যায় কুইজ সমাপ্ত!
                  </h3>
                  <p className="text-sm text-slate-500">
                    তোমার মোট প্রাপ্ত স্কোর: <span className="font-bold text-indigo-600 font-mono text-base">{score} / {questions.length}</span>
                  </p>
                  <button
                    onClick={resetChapterQuiz}
                    className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    পুনরায় অনুশীলন করুন
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mock-test' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                ১০ মিনিটের পূর্ণাঙ্গ পদার্থবিজ্ঞান মক পরীক্ষা
              </h3>
              <p className="text-xs text-slate-500">
                Class {currentClass === 'class-9' ? '9' : '10'} বোর্ডের সিলেবাসভিত্তিক মিশ্র প্রশ্নপত্র
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-amber-800 dark:text-amber-300 font-mono text-sm font-bold">
              <Timer className="w-4 h-4" />
              <span>
                {Math.floor(mockTimer / 60)}:{String(mockTimer % 60).padStart(2, '0')}
              </span>
            </div>
          </div>

          {!isMockRunning && !mockFinished ? (
            <div className="text-center py-10 space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                এই মক পরীক্ষায় সিলেবাসের সমস্ত অধ্যায় থেকে বাছাই করা গুরুত্বপূর্ণ প্রশ্ন থাকবে। সময়সীমা ১০ মিনিট। প্রতিটি প্রশ্নের সঠিক উত্তরে ১ নম্বর।
              </p>
              <button
                onClick={() => {
                  setIsMockRunning(true);
                  setMockTimer(600);
                  setMockQIndex(0);
                  setMockAnswers({});
                }}
                className="py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                পরীক্ষা শুরু করুন
              </button>
            </div>
          ) : !mockFinished ? (
            <div className="space-y-6">
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>প্রশ্ন {mockQIndex + 1} / {allMockQuestions.length}</span>
                <span>উত্তর দেওয়া হয়েছে: {Object.keys(mockAnswers).length} টি</span>
              </div>

              {allMockQuestions[mockQIndex] && (
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {allMockQuestions[mockQIndex].questionBengali}
                  </h4>

                  <div className="space-y-2.5">
                    {allMockQuestions[mockQIndex].options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() =>
                          setMockAnswers((prev) => ({ ...prev, [mockQIndex]: oIdx }))
                        }
                        className={`w-full text-left p-3.5 rounded-xl border text-xs transition-colors flex items-center gap-3 ${
                          mockAnswers[mockQIndex] === oIdx
                            ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-bold text-[11px]">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setMockQIndex((i) => Math.max(0, i - 1))}
                      disabled={mockQIndex === 0}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold disabled:opacity-40"
                    >
                      পূর্ববর্তী
                    </button>
                    {mockQIndex < allMockQuestions.length - 1 ? (
                      <button
                        onClick={() => setMockQIndex((i) => i + 1)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
                      >
                        পরবর্তী
                      </button>
                    ) : (
                      <button
                        onClick={() => setMockFinished(true)}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                      >
                        পরীক্ষা সমাপ্ত করুন
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <Trophy className="w-12 h-12 text-amber-500 mx-auto" />
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">মক পরীক্ষার রেজাল্ট</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                সঠিক উত্তর সংখ্যা:{' '}
                <span className="font-bold text-emerald-600 font-mono text-base">
                  {
                    Object.entries(mockAnswers).filter(
                      ([qIdx, ans]) => allMockQuestions[Number(qIdx)]?.correctOptionIndex === ans
                    ).length
                  }{' '}
                  / {allMockQuestions.length}
                </span>
              </p>
              <button
                onClick={() => {
                  setMockFinished(false);
                  setIsMockRunning(false);
                }}
                className="py-2.5 px-6 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
              >
                পুনরায় পরীক্ষা দিন
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'written-qa' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              বোর্ড পরীক্ষার মডেল প্রশ্ন ও আদর্শ উত্তর (Model Q&A)
            </h3>
            <p className="text-xs text-slate-500">
              মাধ্যমিক (WBBSE) ও CBSE পরীক্ষায় পুরো নম্বর পাওয়ার জন্য যেভাবে উত্তর লেখা উচিত:
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-600">
                <BookOpen className="w-4 h-4" />
                <span>সংক্ষিপ্ত প্রশ্ন (মান: ২) · Class 9/10</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                প্রশ্ন: দূরত্ব ও সরণের মধ্যে দুটি মূল পার্থক্য লেখো।
              </h4>
              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-1 pt-1">
                <p><strong>আদর্শ উত্তর:</strong></p>
                <p>১. <strong>রাশির প্রকৃতি:</strong> অতিক্রান্ত দূরত্ব একটি স্কেলার রাশি (শুধু মান আছে, দিক নেই)। পক্ষান্তরে সরণ একটি ভেক্টর রাশি (মান ও নির্দিষ্ট দিক উভয়ই আছে)।</p>
                <p>২. <strong>শূন্য হওয়ার সম্ভাবনা:</strong> কোনো গতিশীল বস্তুর দূরত্ব কখনোই শূন্য হতে পারে না। কিন্তু গতিশীল বস্তু যদি ঘুরে প্রাথমিক অবস্থানে ফিরে আসে তবে তার সরণ শূন্য হয়।</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-600">
                <BookOpen className="w-4 h-4" />
                <span>ব্যাখ্যামূলক প্রশ্ন (মান: ৩) · Class 10</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                প্রশ্ন: গৃহস্থালির বৈদ্যুতিক বর্তনীতে সমস্ত যন্ত্রপাতি সমান্তরাল সমবায়ে যুক্ত করা হয় কেন?
              </h4>
              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-1 pt-1">
                <p><strong>আদর্শ উত্তর:</strong></p>
                <p>১. <strong>সমান ভোল্টেজ প্রাপ্তি:</strong> সমান্তরাল সমবায়ে প্রতিটি যন্ত্র প্রধান লাইনের পূর্ণ ২২০ V ভোল্টেজ পায়, ফলে প্রতিটি বাল্ব বা ফ্যান তার নির্দিষ্ট দক্ষতায় সর্বোচ্চ কাজ করতে পারে।</p>
                <p>২. <strong>স্বাধীন নিয়ন্ত্রণ:</strong> প্রতিটি যন্ত্রের সাথে আলাদা সুইচ থাকে, তাই একটি যন্ত্র বন্ধ রাখলেও বাকি যন্ত্রগুলো চালু থাকে। একটি বাল্ব কেটে গেলে পুরো বাড়ির বিদ্যুৎ বন্ধ হয় না।</p>
                <p>৩. <strong>তুল্য রোধ হ্রাস:</strong> সমান্তরালে রোধ যুক্ত করলে বর্তনীর সামগ্রিক রোধ হ্রাস পায়।</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
