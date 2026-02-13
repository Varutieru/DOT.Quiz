// src/components/QuizConfig.tsx

import { useState, FormEvent } from 'react';
import { QuizConfig } from '@/types/quiz.types';
import { POPULAR_CATEGORIES } from '@/services/triviaApi';

interface QuizConfigProps {
  onStartQuiz: (config: QuizConfig, timeLimit: number) => void;
  isLoading?: boolean;
}

export function QuizConfigComponent({ onStartQuiz, isLoading = false }: QuizConfigProps) {
  const [config, setConfig] = useState<QuizConfig>({
    amount: 10,
    category: undefined,
    difficulty: undefined,
    type: undefined,
  });
  const [timeLimit, setTimeLimit] = useState(300);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onStartQuiz(config, timeLimit);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#141121] to-[#7D7ABC] p-4">
      <div className="w-full max-w-2xl bg-[#F2F2F9]/10 backdrop-blur-lg rounded-[50px] p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-chillax-bold text-[#F2F2F9] mb-2">
            🎯 Configure Your Quiz
          </h1>
          <p className="text-[#F2F2F9]/80 font-chillax">
            Customize your quiz settings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Number of Questions */}
          <div>
            <label className="block text-[#F2F2F9] font-chillax-semibold mb-2">
              Number of Questions
            </label>
            <input
              type="number"
              min="5"
              max="50"
              value={config.amount}
              onChange={(e) => setConfig({ ...config, amount: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-[#F2F2F9] text-[#141121] font-chillax rounded-full focus:outline-none focus:ring-2 focus:ring-[#23F0C7]"
              disabled={isLoading}
            />
            <p className="text-[#F2F2F9]/60 text-sm font-chillax mt-1 ml-4">
              Min: 5, Max: 50
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[#F2F2F9] font-chillax-semibold mb-2">
              Category (Optional)
            </label>
            <select
              value={config.category || ''}
              onChange={(e) => setConfig({ 
                ...config, 
                category: e.target.value ? parseInt(e.target.value) : undefined 
              })}
              className="w-full px-4 py-3 bg-[#F2F2F9] text-[#141121] font-chillax rounded-full focus:outline-none focus:ring-2 focus:ring-[#23F0C7]"
              disabled={isLoading}
            >
              <option value="">Any Category</option>
              {POPULAR_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-[#F2F2F9] font-chillax-semibold mb-2">
              Difficulty (Optional)
            </label>
            <div className="grid grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => setConfig({ ...config, difficulty: undefined })}
                className={`px-4 py-3 font-chillax rounded-full transition-all ${
                  config.difficulty === undefined
                    ? 'bg-[#23F0C7] text-[#141121]'
                    : 'bg-[#F2F2F9]/20 text-[#F2F2F9] hover:bg-[#F2F2F9]/30'
                }`}
                disabled={isLoading}
              >
                Any
              </button>
              <button
                type="button"
                onClick={() => setConfig({ ...config, difficulty: 'easy' })}
                className={`px-4 py-3 font-chillax rounded-full transition-all ${
                  config.difficulty === 'easy'
                    ? 'bg-[#23F0C7] text-[#141121]'
                    : 'bg-[#F2F2F9]/20 text-[#F2F2F9] hover:bg-[#F2F2F9]/30'
                }`}
                disabled={isLoading}
              >
                Easy
              </button>
              <button
                type="button"
                onClick={() => setConfig({ ...config, difficulty: 'medium' })}
                className={`px-4 py-3 font-chillax rounded-full transition-all ${
                  config.difficulty === 'medium'
                    ? 'bg-[#FFE347] text-[#141121]'
                    : 'bg-[#F2F2F9]/20 text-[#F2F2F9] hover:bg-[#F2F2F9]/30'
                }`}
                disabled={isLoading}
              >
                Medium
              </button>
              <button
                type="button"
                onClick={() => setConfig({ ...config, difficulty: 'hard' })}
                className={`px-4 py-3 font-chillax rounded-full transition-all ${
                  config.difficulty === 'hard'
                    ? 'bg-[#EF767A] text-[#F2F2F9]'
                    : 'bg-[#F2F2F9]/20 text-[#F2F2F9] hover:bg-[#F2F2F9]/30'
                }`}
                disabled={isLoading}
              >
                Hard
              </button>
            </div>
          </div>

          {/* Question Type */}
          <div>
            <label className="block text-[#F2F2F9] font-chillax-semibold mb-2">
              Question Type (Optional)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setConfig({ ...config, type: undefined })}
                className={`px-4 py-3 font-chillax rounded-full transition-all ${
                  config.type === undefined
                    ? 'bg-[#23F0C7] text-[#141121]'
                    : 'bg-[#F2F2F9]/20 text-[#F2F2F9] hover:bg-[#F2F2F9]/30'
                }`}
                disabled={isLoading}
              >
                Any Type
              </button>
              <button
                type="button"
                onClick={() => setConfig({ ...config, type: 'multiple' })}
                className={`px-4 py-3 font-chillax rounded-full transition-all ${
                  config.type === 'multiple'
                    ? 'bg-[#23F0C7] text-[#141121]'
                    : 'bg-[#F2F2F9]/20 text-[#F2F2F9] hover:bg-[#F2F2F9]/30'
                }`}
                disabled={isLoading}
              >
                Multiple Choice
              </button>
              <button
                type="button"
                onClick={() => setConfig({ ...config, type: 'boolean' })}
                className={`px-4 py-3 font-chillax rounded-full transition-all ${
                  config.type === 'boolean'
                    ? 'bg-[#23F0C7] text-[#141121]'
                    : 'bg-[#F2F2F9]/20 text-[#F2F2F9] hover:bg-[#F2F2F9]/30'
                }`}
                disabled={isLoading}
              >
                True/False
              </button>
            </div>
          </div>

          {/* Time Limit */}
          <div>
            <label className="block text-[#F2F2F9] font-chillax-semibold mb-2">
              Time Limit (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={timeLimit / 60}
              onChange={(e) => setTimeLimit(parseInt(e.target.value) * 60)}
              className="w-full px-4 py-3 bg-[#F2F2F9] text-[#141121] font-chillax rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFE347]"
              disabled={isLoading}
            />
            <p className="text-[#F2F2F9]/60 text-sm font-chillax mt-1 ml-4">
              Total time to complete the quiz
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-4 bg-linear-to-r from-[#23F0C7] to-[#FFE347] text-[#141121] font-chillax-bold text-lg rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading Questions...' : 'Start Quiz'}
          </button>
        </form>
      </div>
    </div>
  );
}