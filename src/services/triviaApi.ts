import { QuizConfig, TriviaQuestion, ProcessedQuestion, QuizCategory } from '@/types/quiz.types';

const BASE_URL = 'https://opentdb.com';


function decodeHTML(html: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

/* Fisher-Yates Algorithm */
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function processQuestion(question: TriviaQuestion, index: number): ProcessedQuestion {
  const allAnswers = shuffleArray([
    question.correct_answer,
    ...question.incorrect_answers
  ]);

  return {
    id: `q_${index}_${Date.now()}`,
    category: decodeHTML(question.category),
    type: question.type,
    difficulty: question.difficulty,
    question: decodeHTML(question.question),
    correctAnswer: decodeHTML(question.correct_answer),
    allAnswers: allAnswers.map(ans => decodeHTML(ans))
  };
}

export async function fetchQuizQuestions(config: QuizConfig): Promise<ProcessedQuestion[]> {
  try {

    let url = `${BASE_URL}/api.php?amount=${config.amount}`;
    
    if (config.category) {
      url += `&category=${config.category}`;
    }
    
    if (config.difficulty) {
      url += `&difficulty=${config.difficulty}`;
    }
    
    if (config.type) {
      url += `&type=${config.type}`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }

    const data = await response.json();

    if (data.response_code !== 0) {
      switch (data.response_code) {
        case 1:
          throw new Error('Not enough questions available for your selection');
        case 2:
          throw new Error('Invalid parameter in request');
        case 3:
          throw new Error('Session token not found');
        case 4:
          throw new Error('Session token has returned all possible questions');
        default:
          throw new Error('Failed to fetch questions');
      }
    }

    const processedQuestions = data.results.map((q: TriviaQuestion, index: number) =>
      processQuestion(q, index)
    );

    return processedQuestions;
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    throw error;
  }
}

export async function fetchCategories(): Promise<QuizCategory[]> {
  try {
    const response = await fetch(`${BASE_URL}/api_category.php`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data = await response.json();
    return data.trivia_categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export const POPULAR_CATEGORIES = [
  { id: 9, name: 'General Knowledge' },
  { id: 17, name: 'Science & Nature' },
  { id: 18, name: 'Science: Computers' },
  { id: 21, name: 'Sports' },
  { id: 22, name: 'Geography' },
  { id: 23, name: 'History' },
  { id: 11, name: 'Entertainment: Film' },
  { id: 12, name: 'Entertainment: Music' },
];