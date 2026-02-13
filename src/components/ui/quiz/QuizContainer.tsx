import { useState } from 'react';
import { QuizConfigComponent } from './QuizConfig';
import { QuizPage } from './QuizPage';
import { ResultPage } from './ResultPage';
import { fetchQuizQuestions } from '@/services/triviaApi';
import { ProcessedQuestion, QuizConfig, QuizResult } from '@/types/quiz.types';

type QuizStage = 'config' | 'quiz' | 'result';

interface QuizContainerProps {
  onBackToHome?: () => void;
}

export function QuizContainer({ onBackToHome }: QuizContainerProps) {
  const [stage, setStage] = useState<QuizStage>('config');
  const [questions, setQuestions] = useState<ProcessedQuestion[]>([]);
  const [timeLimit, setTimeLimit] = useState(300);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle quiz configuration and start
  const handleStartQuiz = async (config: QuizConfig, timeLimitInSeconds: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedQuestions = await fetchQuizQuestions(config);
      
      if (fetchedQuestions.length === 0) {
        throw new Error('No questions available for your selection');
      }

      setQuestions(fetchedQuestions);
      setTimeLimit(timeLimitInSeconds);
      setStage('quiz');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load questions';
      setError(errorMessage);
      console.error('Error starting quiz:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quiz completion
  const handleQuizComplete = (quizResult: QuizResult) => {
    setResult(quizResult);
    setStage('result');
  };

  // Handle retake quiz
  const handleRetakeQuiz = () => {
    setStage('config');
    setQuestions([]);
    setResult(null);
    setError(null);
  };

  // Handle quit quiz
  const handleQuitQuiz = () => {
    if (window.confirm('Are you sure you want to quit? Your progress will be lost.')) {
      // Clear saved progress
      localStorage.removeItem('quiz_progress');
      setStage('config');
      setQuestions([]);
      setResult(null);
      setError(null);
    }
  };

  // Handle back to home
  const handleBackToHome = () => {
    // Clear saved progress
    localStorage.removeItem('quiz_progress');
    if (onBackToHome) {
      onBackToHome();
    } else {
      setStage('config');
      setQuestions([]);
      setResult(null);
      setError(null);
    }
  };

  switch (stage) {
    case 'config':
      return (
        <>
          <QuizConfigComponent
            onStartQuiz={handleStartQuiz}
            isLoading={isLoading}
          />
          
          {/* Error Message */}
          {error && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#EF767A] text-[#F2F2F9] px-6 py-4 rounded-full font-chillax shadow-lg animate-bounce">
              {error}
            </div>
          )}
        </>
      );

    case 'quiz':
      return (
        <QuizPage
          questions={questions}
          timeLimit={timeLimit}
          onQuizComplete={handleQuizComplete}
          onQuit={handleQuitQuiz}
        />
      );

    case 'result':
      return result ? (
        <ResultPage
          result={result}
          onRetakeQuiz={handleRetakeQuiz}
          onBackToHome={handleBackToHome}
        />
      ) : null;

    default:
      return null;
  }
}