export interface QuizConfig {
  amount: number;
  category?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  type?: 'multiple' | 'boolean';
}

export interface TriviaQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface ProcessedQuestion {
  id: string;
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correctAnswer: string;
  allAnswers: string[];
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

export interface QuizState {
  questions: ProcessedQuestion[];
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  startTime: number;
  timeLimit: number;
  isFinished: boolean;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  totalTimeSpent: number;
  score: number;
}

export interface SavedQuizProgress extends QuizState {
  userId: string;
  savedAt: string;
}

export interface QuizCategory {
  id: number;
  name: string;
}