import { useState, useEffect } from 'react';
import { QuizConfigComponent } from './QuizConfig';
import { QuizPage } from './QuizPage';
import { ResultPage } from './ResultPage';
import { fetchQuizQuestions } from '@/services/triviaApi';
import { ProcessedQuestion, QuizConfig, QuizResult, SavedQuizProgress } from '@/types/quiz.types';
import { useAuthContext } from '@/contexts/AuthContext';

type QuizStage = 'config' | 'quiz' | 'result';

interface QuizContainerProps {
  onBackToHome?: () => void;
}

const STORAGE_KEY = 'quiz_progress';

export function QuizContainer({ onBackToHome }: QuizContainerProps) {
  const { user } = useAuthContext();
  const [stage, setStage] = useState<QuizStage>('config');
  const [questions, setQuestions] = useState<ProcessedQuestion[]>([]);
  const [timeLimit, setTimeLimit] = useState(300);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [savedProgress, setSavedProgress] = useState<SavedQuizProgress | null>(null);

  useEffect(() => {
    if (!user) return;

    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) return;

    try {
      const parsed: SavedQuizProgress = JSON.parse(savedData);
      
      // Verify it's for the current user
      if (parsed.userId !== user.id) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      const timePassed = Math.floor((Date.now() - parsed.startTime) / 1000);
      const timeRemaining = parsed.timeLimit - timePassed;

      if (timeRemaining > 0 && !parsed.isFinished && parsed.questions.length > 0) {
        console.log('Found saved quiz progress!');
        setSavedProgress(parsed);
        setShowResumePrompt(true);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error checking saved progress:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const handleResumeQuiz = () => {
    if (!savedProgress) return;

    setQuestions(savedProgress.questions);
    setTimeLimit(savedProgress.timeLimit);
    setStage('quiz');
    setShowResumePrompt(false);
    
    console.log('Resuming quiz...');
  };

  const handleStartNewQuiz = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSavedProgress(null);
    setShowResumePrompt(false);
    setStage('config');
  };
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
    localStorage.removeItem(STORAGE_KEY);
  };

  // Handle quit quiz
  const handleQuitQuiz = () => {
    if (window.confirm('Are you sure you want to quit? Your progress will be saved.')) {
      // Don't clear localStorage - let it save for resume
      setStage('config');
      setQuestions([]);
      setResult(null);
      setError(null);
    }
  };

  // Handle back to home
  const handleBackToHome = () => {
    // Clear saved progress when going home
    localStorage.removeItem(STORAGE_KEY);
    if (onBackToHome) {
      onBackToHome();
    } else {
      setStage('config');
      setQuestions([]);
      setResult(null);
      setError(null);
    }
  };

  // Resume prompt modal
  if (showResumePrompt && savedProgress) {
    const timePassed = Math.floor((Date.now() - savedProgress.startTime) / 1000);
    const timeRemaining = savedProgress.timeLimit - timePassed;
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#141121] to-[#7D7ABC] flex items-center justify-center p-4">
        <div className="bg-[#F2F2F9]/10 backdrop-blur-lg rounded-[50px] p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-3xl font-chillax-bold text-[#F2F2F9] mb-2">
              Resume Quiz?
            </h2>
            <p className="text-[#F2F2F9]/80 font-chillax">
              You have an unfinished quiz
            </p>
          </div>

          <div className="bg-[#F2F2F9]/5 rounded-2xl p-4 mb-6 space-y-2">
            <div className="flex justify-between text-[#F2F2F9] font-chillax">
              <span className="text-[#F2F2F9]/60">Progress:</span>
              <span className="font-chillax-semibold">
                {savedProgress.answers.length} / {savedProgress.questions.length} answered
              </span>
            </div>
            <div className="flex justify-between text-[#F2F2F9] font-chillax">
              <span className="text-[#F2F2F9]/60">Time left:</span>
              <span className="font-chillax-semibold">{formatTime(timeRemaining)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleResumeQuiz}
              className="w-full px-6 py-4 bg-gradient-to-r from-[#23F0C7] to-[#FFE347] text-[#141121] font-chillax-bold text-lg rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Continue Quiz
            </button>
            <button
              onClick={handleStartNewQuiz}
              className="w-full px-6 py-4 bg-[#F2F2F9]/10 text-[#F2F2F9] font-chillax-bold text-lg rounded-full hover:bg-[#F2F2F9]/20 transition-all duration-200 border-2 border-[#F2F2F9]/20"
            >
              Start New Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render based on stage
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
              ⚠️ {error}
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