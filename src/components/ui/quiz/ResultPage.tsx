import { QuizResult } from '@/types/quiz.types';
import { useAuthContext } from '@/contexts/AuthContext';

interface ResultPageProps {
  result: QuizResult;
  onRetakeQuiz: () => void;
  onBackToHome: () => void;
}

export function ResultPage({ result, onRetakeQuiz, onBackToHome }: ResultPageProps) {
  const { user } = useAuthContext();

  const getPerformanceMessage = (score: number) => {
    if (score >= 90) return { emoji: '🏆', message: 'Outstanding!', color: 'text-[#23F0C7]' };
    if (score >= 75) return { emoji: '🌟', message: 'Great Job!', color: 'text-[#FFE347]' };
    if (score >= 60) return { emoji: '👍', message: 'Good Effort!', color: 'text-[#23F0C7]' };
    if (score >= 40) return { emoji: '💪', message: 'Keep Practicing!', color: 'text-[#FFE347]' };
    return { emoji: '📚', message: 'Keep Learning!', color: 'text-[#EF767A]' };
  };

  const performance = getPerformanceMessage(result.score);

  // Format time spent
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Calculate accuracy
  const answeredQuestions = result.correctAnswers + result.incorrectAnswers;
  const accuracy = answeredQuestions > 0 
    ? Math.round((result.correctAnswers / answeredQuestions) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141121] to-[#7D7ABC] p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        {/* Main Result Card */}
        <div className="bg-[#F2F2F9]/10 backdrop-blur-lg rounded-[50px] p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce">
              {performance.emoji}
            </div>
            <h1 className={`text-4xl md:text-5xl font-chillax-bold ${performance.color} mb-2`}>
              {performance.message}
            </h1>
            <p className="text-[#F2F2F9]/80 font-chillax text-lg">
              {user?.name}, here are your results
            </p>
          </div>

          {/* Score Circle */}
          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-48">
              {/* Background Circle */}
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="rgba(242, 242, 249, 0.1)"
                  strokeWidth="16"
                  fill="none"
                />
                {/* Progress Circle */}
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="url(#gradient)"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - result.score / 100)}`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#23F0C7" />
                    <stop offset="100%" stopColor="#FFE347" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Score Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-chillax-bold text-[#F2F2F9]">
                  {result.score}%
                </div>
                <div className="text-[#F2F2F9]/60 font-chillax text-sm">
                  Score
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Correct Answers */}
            <div className="bg-[#23F0C7]/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="text-3xl font-chillax-bold text-[#23F0C7]">
                {result.correctAnswers}
              </div>
              <div className="text-[#F2F2F9]/80 font-chillax-semibold text-sm mt-1">
                Correct
              </div>
            </div>

            {/* Incorrect Answers */}
            <div className="bg-[#EF767A]/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="text-3xl font-chillax-bold text-[#EF767A]">
                {result.incorrectAnswers}
              </div>
              <div className="text-[#F2F2F9]/80 font-chillax-semibold text-sm mt-1">
                Incorrect
              </div>
            </div>

            {/* Unanswered */}
            <div className="bg-[#FFE347]/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="text-3xl font-chillax-bold text-[#FFE347]">
                {result.unansweredQuestions}
              </div>
              <div className="text-[#F2F2F9]/80 font-chillax-semibold text-sm mt-1">
                Skipped
              </div>
            </div>

            {/* Total Questions */}
            <div className="bg-[#F2F2F9]/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="text-3xl font-chillax-bold text-[#F2F2F9]">
                {result.totalQuestions}
              </div>
              <div className="text-[#F2F2F9]/80 font-chillax-semibold text-sm mt-1">
                Total
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#F2F2F9]/5 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-[#F2F2F9]/60 font-chillax text-sm mb-1">
                Time Spent
              </div>
              <div className="text-2xl font-chillax-bold text-[#F2F2F9]">
                ⏱{formatTime(result.totalTimeSpent)}
              </div>
            </div>

            <div className="bg-[#F2F2F9]/5 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-[#F2F2F9]/60 font-chillax text-sm mb-1">
                Accuracy
              </div>
              <div className="text-2xl font-chillax-bold text-[#F2F2F9]">
                {accuracy}%
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={onRetakeQuiz}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-[#23F0C7] to-[#FFE347] text-[#141121] font-chillax-bold text-lg rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Retake Quiz
            </button>
            <button
              onClick={onBackToHome}
              className="flex-1 px-6 py-4 bg-[#F2F2F9]/10 backdrop-blur-sm text-[#F2F2F9] font-chillax-bold text-lg rounded-full hover:bg-[#F2F2F9]/20 transition-all duration-200 border-2 border-[#F2F2F9]/20"
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="mt-6 text-center">
          <p className="text-[#F2F2F9]/60 font-chillax text-sm">
            {result.score >= 75 
              ? "Excellent work! You're mastering this topic!"
              : "Practice makes perfect! Keep it up!"
            }
          </p>
        </div>
      </div>
    </div>
  );
}