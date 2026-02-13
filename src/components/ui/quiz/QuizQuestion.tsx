import { ProcessedQuestion } from '@/types/quiz.types';

interface QuizQuestionProps {
  question: ProcessedQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  isAnswered?: boolean;
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  isAnswered = false,
}: QuizQuestionProps) {
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-[#23F0C7] text-[#141121]';
      case 'medium':
        return 'bg-[#FFE347] text-[#141121]';
      case 'hard':
        return 'bg-[#EF767A] text-[#F2F2F9]';
      default:
        return 'bg-[#F2F2F9] text-[#141121]';
    }
  };

  const getAnswerColor = (index: number) => {
    const colors = [
      'hover:bg-[#23F0C7] hover:text-[#141121] focus:ring-[#23F0C7]',
      'hover:bg-[#FFE347] hover:text-[#141121] focus:ring-[#FFE347]',
      'hover:bg-[#EF767A] hover:text-[#F2F2F9] focus:ring-[#EF767A]',
      'hover:bg-[#7D7ABC] hover:text-[#F2F2F9] focus:ring-[#7D7ABC]',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Question Header */}
      <div className="mb-8">
        {/* Progress & Difficulty */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-[#F2F2F9]/80 font-chillax text-sm">
            Question {questionNumber} of {totalQuestions}
          </div>
          <span className={`px-4 py-1 rounded-full text-sm font-chillax-semibold ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </span>
        </div>

        {/* Category */}
        <div className="mb-4">
          <span className="inline-block px-4 py-2 bg-[#F2F2F9]/10 backdrop-blur-sm text-[#F2F2F9] font-chillax text-sm rounded-full">
            📚 {question.category}
          </span>
        </div>

        {/* Question Text */}
        <div className="bg-[#F2F2F9]/10 backdrop-blur-lg rounded-3xl p-8">
          <h2 className="text-2xl md:text-3xl font-chillax-bold text-[#F2F2F9] leading-relaxed">
            {question.question}
          </h2>
        </div>
      </div>

      {/* Answer Options */}
      <div className="space-y-4">
        {question.allAnswers.map((answer, index) => (
          <button
            key={index}
            onClick={() => onAnswer(answer)}
            disabled={isAnswered}
            className={`
              w-full px-6 py-5 
              bg-[#F2F2F9]/10 backdrop-blur-sm 
              text-[#F2F2F9] font-chillax text-lg text-left
              rounded-2xl 
              transition-all duration-200
              ${getAnswerColor(index)}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:scale-[1.02] active:scale-[0.98]
              border-2 border-transparent hover:border-current
            `}
          >
            <div className="flex items-center gap-4">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#F2F2F9]/20 font-chillax-semibold">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1">{answer}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Question Type Indicator */}
      <div className="mt-6 text-center text-[#F2F2F9]/60 font-chillax text-sm">
        {question.type === 'boolean' ? 'True/False' : 'Multiple Choice'}
      </div>
    </div>
  );
}