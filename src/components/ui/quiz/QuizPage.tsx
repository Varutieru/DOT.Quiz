import { ProcessedQuestion, QuizResult } from '@/types/quiz.types';
import { useQuiz } from '@/hooks/useQuiz';
import { QuizQuestion } from './QuizQuestion';
import { useState } from 'react';

interface QuizPageProps {
  questions: ProcessedQuestion[];
  timeLimit: number;
  onQuizComplete: (result: QuizResult) => void;
  onQuit?: () => void;
}

export function QuizPage({ questions, timeLimit, onQuizComplete, onQuit }: QuizPageProps) {
  const [isAnswering, setIsAnswering] = useState(false);

  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    answers,
    isFinished,
    timeRemaining,
    formattedTime,
    answerQuestion,
    progress,
    isTimeRunningOut,
  } = useQuiz({
    questions,
    timeLimit,
    onQuizComplete,
  });

  const handleAnswer = async (answer: string) => {
    setIsAnswering(true);

    await new Promise(resolve => setTimeout(resolve, 300));
    
    answerQuestion(answer);
    setIsAnswering(false);
  };

  if (isFinished) {
    return null;
  }

  if (!currentQuestion) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#141121] to-[#7D7ABC]">
        <div className="text-[#F2F2F9] font-chillax text-xl">Loading question...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#141121] to-[#7D7ABC] p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          {/* Logo/Title */}
          <div className="text-2xl font-chillax-bold text-[#F2F2F9]">
            🎯 Quiz Time
          </div>

          {/* Quit Button */}
          {onQuit && (
            <button
              onClick={onQuit}
              className="px-4 py-2 bg-[#EF767A]/20 text-[#EF767A] font-chillax rounded-full hover:bg-[#EF767A] hover:text-[#F2F2F9] transition-colors"
            >
              Quit Quiz
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#F2F2F9] font-chillax text-sm">
              Progress: {answers.length} / {totalQuestions} answered
            </span>
            <span className="text-[#F2F2F9] font-chillax-semibold text-sm">
              {progress}%
            </span>
          </div>
          <div className="w-full h-3 bg-[#F2F2F9]/10 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-[#23F0C7] to-[#FFE347] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className="bg-[#F2F2F9]/10 backdrop-blur-lg rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">
              {isTimeRunningOut ? '⏰' : '⏱️'}
            </span>
            <div>
              <div className="text-[#F2F2F9]/80 font-chillax text-sm">Time Remaining</div>
              <div className={`font-chillax-bold text-2xl ${
                isTimeRunningOut ? 'text-[#EF767A] animate-pulse' : 'text-[#F2F2F9]'
              }`}>
                {formattedTime}
              </div>
            </div>
          </div>

          {isTimeRunningOut && (
            <div className="bg-[#EF767A]/20 text-[#EF767A] px-4 py-2 rounded-full font-chillax text-sm animate-pulse">
              Hurry up! ⚡
            </div>
          )}
        </div>
      </div>

      {/* Question */}
      <QuizQuestion
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        onAnswer={handleAnswer}
        isAnswered={isAnswering}
      />

      {/* Bottom Info */}
      <div className="max-w-4xl mx-auto mt-8 text-center">
        <p className="text-[#F2F2F9]/60 font-chillax text-sm">
          💡 Select your answer to automatically move to the next question
        </p>
      </div>

      {/* Loading Overlay */}
      {isAnswering && (
        <div className="fixed inset-0 bg-[#141121]/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#F2F2F9]/10 backdrop-blur-lg rounded-3xl p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#F2F2F9]/20 border-t-[#23F0C7] rounded-full animate-spin"></div>
              <p className="text-[#F2F2F9] font-chillax">Processing answer...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}