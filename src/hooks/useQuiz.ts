import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import {
  QuizState,
  QuizAnswer,
  QuizResult,
  ProcessedQuestion,
  SavedQuizProgress
} from '@/types/quiz.types';

const STORAGE_KEY = 'quiz_progress';

interface UseQuizProps {
  questions: ProcessedQuestion[];
  timeLimit: number;
  onQuizComplete?: (result: QuizResult) => void;
}

export function useQuiz({ questions, timeLimit, onQuizComplete }: UseQuizProps) {
  const { user } = useAuthContext();
  const [quizState, setQuizState] = useState<QuizState>({
    questions,
    currentQuestionIndex: 0,
    answers: [],
    startTime: Date.now(),
    timeLimit,
    isFinished: false,
  });

  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /* Load saved progress from localStorage */
  useEffect(() => {
    if (user) {
      const savedProgress = localStorage.getItem(STORAGE_KEY);
      if (savedProgress) {
        try {
          const parsed: SavedQuizProgress = JSON.parse(savedProgress);
          
          if (parsed.userId === user.id) {
            const timePassed = Math.floor((Date.now() - parsed.startTime) / 1000);
            const newTimeRemaining = Math.max(0, parsed.timeLimit - timePassed);
            
            if (newTimeRemaining > 0 && !parsed.isFinished) {
              setQuizState(parsed);
              setTimeRemaining(newTimeRemaining);
              
              console.log('Quiz resumed from saved progress');
            } else {
              localStorage.removeItem(STORAGE_KEY);
            }
          }
        } catch (error) {
          console.error('Error loading saved quiz:', error);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }
  }, [user]);

  const saveProgress = useCallback(() => {
    if (user && !quizState.isFinished) {
      const progressToSave: SavedQuizProgress = {
        ...quizState,
        userId: user.id,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressToSave));
    }
  }, [quizState, user]);

  useEffect(() => {
    if (quizState.isFinished) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizState.isFinished]);

  useEffect(() => {
    saveProgress();
  }, [quizState, saveProgress]);

  const answerQuestion = useCallback((selectedAnswer: string) => {
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timeSpent: timeLimit - timeRemaining,
    };

    const newAnswers = [...quizState.answers, answer];
    const nextIndex = quizState.currentQuestionIndex + 1;
    const isLastQuestion = nextIndex >= quizState.questions.length;

    setQuizState((prev) => ({
      ...prev,
      answers: newAnswers,
      currentQuestionIndex: isLastQuestion ? prev.currentQuestionIndex : nextIndex,
      isFinished: isLastQuestion,
    }));

    if (isLastQuestion) {
      finishQuiz(newAnswers);
    }
  }, [quizState, timeRemaining, timeLimit]);

  const calculateResult = useCallback((answers: QuizAnswer[]): QuizResult => {
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const incorrectAnswers = answers.filter(a => !a.isCorrect).length;
    const totalQuestions = quizState.questions.length;
    const unansweredQuestions = totalQuestions - answers.length;
    const totalTimeSpent = timeLimit - timeRemaining;
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    return {
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      unansweredQuestions,
      totalTimeSpent,
      score,
    };
  }, [quizState.questions, timeLimit, timeRemaining]);

  const finishQuiz = useCallback((finalAnswers?: QuizAnswer[]) => {
    const answersToUse = finalAnswers || quizState.answers;
    
    setQuizState((prev) => ({
      ...prev,
      isFinished: true,
    }));

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    localStorage.removeItem(STORAGE_KEY);

    const result = calculateResult(answersToUse);
    
    if (onQuizComplete) {
      onQuizComplete(result);
    }

    return result;
  }, [quizState.answers, calculateResult, onQuizComplete]);

  const resetQuiz = useCallback(() => {
    setQuizState({
      questions,
      currentQuestionIndex: 0,
      answers: [],
      startTime: Date.now(),
      timeLimit,
      isFinished: false,
    });
    setTimeRemaining(timeLimit);
    localStorage.removeItem(STORAGE_KEY);
  }, [questions, timeLimit]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    currentQuestion: quizState.questions[quizState.currentQuestionIndex],
    currentQuestionIndex: quizState.currentQuestionIndex,
    totalQuestions: quizState.questions.length,
    answers: quizState.answers,
    isFinished: quizState.isFinished,
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    
    answerQuestion,
    finishQuiz,
    resetQuiz,
    
    progress: quizState.questions.length > 0 
      ? Math.round(((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100)
      : 0,
    isTimeRunningOut: timeRemaining <= 30,
  };
}