export type ClassLevel = 'class-9' | 'class-10';
export type BoardType = 'wbbse' | 'cbse';

export type LabType = 
  | 'motion' 
  | 'newton-laws' 
  | 'gravitation-energy' 
  | 'sound-waves' 
  | 'light-optics' 
  | 'circuits';

export interface Definition {
  id: string;
  conceptBengali: string;
  conceptEnglish: string;
  defBengali: string;
  defEnglish: string;
  easyExplanation: string;
  realLifeExample: string;
  formula?: string;
  siUnit?: string;
  dimension?: string;
  examAnswer: string;
  oneLineRevision: string;
  chapterId: string;
  classLevel: ClassLevel;
  board: BoardType[];
  isVector?: boolean;
}

export interface FormulaVariable {
  symbol: string;
  nameBengali: string;
  nameEnglish: string;
  unit: string;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
}

export interface FormulaItem {
  id: string;
  formula: string;
  nameBengali: string;
  nameEnglish: string;
  latex?: string;
  chapterId: string;
  classLevel: ClassLevel;
  symbolMeanings: { symbol: string; meaningBengali: string; unit: string }[];
  siUnit: string;
  exampleProblem: {
    questionBengali: string;
    given: string;
    solution: string;
  };
  calculate: (inputs: Record<string, number>) => { result: number; unit: string; steps: string[] };
  variables: FormulaVariable[];
  resultUnit: string;
  resultSymbol: string;
}

export interface SolvedNumerical {
  id: string;
  titleBengali: string;
  questionBengali: string;
  questionEnglish?: string;
  difficulty: 'সহজ' | 'মধ্যম' | 'উচ্চমান';
  given: { symbol: string; value: string; name: string }[];
  toFind: string;
  formula: string;
  substitutions: string[];
  steps: string[];
  finalAnswer: string;
  siUnit: string;
  bengaliExplanation: string;
  commonPitfall?: string;
}

export interface PracticeQuestion {
  id: string;
  chapterId: string;
  classLevel: ClassLevel;
  questionBengali: string;
  options: string[];
  correctOptionIndex: number;
  explanationBengali: string;
  whyWrongBengali?: string[];
  hintBengali?: string;
}

export interface Chapter {
  id: string;
  classLevel: ClassLevel;
  number: number;
  titleBengali: string;
  titleEnglish: string;
  shortDescBengali: string;
  boards: BoardType[]; // whether it's in wbbse, cbse or both
  icon: string;
  labType?: LabType;
  learningObjectivesBengali: string[];
  keyConcepts: {
    titleBengali: string;
    titleEnglish: string;
    summaryBengali: string;
    contentBengali: string[];
    diagramNote?: string;
  }[];
  definitions: Definition[];
  formulas: FormulaItem[];
  solvedNumericals: SolvedNumerical[];
  commonMistakes: {
    mistakeBengali: string;
    correctFactBengali: string;
    whyItMatters: string;
  }[];
  summaryPointsBengali: string[];
  practiceQuestions: PracticeQuestion[];
}

export interface UserProgress {
  selectedClass: ClassLevel;
  selectedBoard: BoardType;
  completedChapters: string[];
  bookmarkedDefinitions: string[];
  bookmarkedFormulas: string[];
  quizScores: Record<string, number>; // chapterId -> percentage
  dailyStreak: number;
  lastActiveDate: string;
  totalQuestionsAnswered: number;
  correctAnswersCount: number;
}
