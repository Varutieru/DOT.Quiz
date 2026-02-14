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
  timeLimit: number; // in seconds
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
  const [isResumed, setIsResumed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved progress from localStorage - ONLY ON MOUNT
  useEffect(() => {
    if (!user) return;

    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (!savedProgress) return;

    try {
      const parsed: SavedQuizProgress = JSON.parse(savedProgress);
      
      // Check if saved quiz is for current user
      if (parsed.userId !== user.id) {
        console.log('Saved quiz is for different user, ignoring');
        return;
      }

      // Calculate how much time has passed
      const timePassed = Math.floor((Date.now() - parsed.startTime) / 1000);
      const newTimeRemaining = Math.max(0, parsed.timeLimit - timePassed);
      
      // Only resume if there's time left and quiz not finished
      if (newTimeRemaining > 0 && !parsed.isFinished && parsed.questions.length > 0) {
        console.log('Resuming quiz from saved progress');
        console.log('Time remaining:', newTimeRemaining);
        console.log('Current question:', parsed.currentQuestionIndex + 1);
        
        setQuizState(parsed);
        setTimeRemaining(newTimeRemaining);
        setIsResumed(true);
      } else {
        console.log('Saved quiz expired or finished, clearing');
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error loading saved quiz:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  // Save progress to localStorage
  useEffect(() => {
    if (!user || quizState.isFinished || quizState.questions.length === 0) {
      return;
    }

    const progressToSave: SavedQuizProgress = {
      ...quizState,
      userId: user.id,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressToSave));
    console.log('Quiz progress saved');
  }, [quizState, user]);

  // Timer logic
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

  // Calculate result
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

  // Finish quiz
  const finishQuiz = useCallback((finalAnswers?: QuizAnswer[]) => {
    const answersToUse = finalAnswers || quizState.answers;
    
    setQuizState((prev) => ({
      ...prev,
      isFinished: true,
    }));

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Clear saved progress
    localStorage.removeItem(STORAGE_KEY);
    console.log('Quiz finished, progress cleared');

    const result = calculateResult(answersToUse);
    
    if (onQuizComplete) {
      onQuizComplete(result);
    }

    return result;
  }, [quizState.answers, calculateResult, onQuizComplete]);

  // Reset quiz
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
    setIsResumed(false);
    localStorage.removeItem(STORAGE_KEY);
    console.log('Quiz reset');
  }, [questions, timeLimit]);

  // Time Display (MM:SS)
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    // State
    currentQuestion: quizState.questions[quizState.currentQuestionIndex],
    currentQuestionIndex: quizState.currentQuestionIndex,
    totalQuestions: quizState.questions.length,
    answers: quizState.answers,
    isFinished: quizState.isFinished,
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    isResumed, // New: indicates if quiz was resumed
    
    // Actions
    answerQuestion,
    finishQuiz,
    resetQuiz,
    
    // Helpers
    progress: quizState.questions.length > 0 
      ? Math.round(((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100)
      : 0,
    isTimeRunningOut: timeRemaining <= 30,
  };
}