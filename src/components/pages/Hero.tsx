"use client";

import { useState } from "react";
import Header from "../ui/Header";
import { QuizContainer } from "../ui/quiz/QuizContainer";

export default function Hero() {
    const [showQuiz, setShowQuiz] = useState(false);

    
    if (showQuiz) {
        return <QuizContainer onBackToHome={() => setShowQuiz(false)} />;
    }

    return (
        <section className="w-full min-h-screen px-[5vw] py-[5vh] bg-[radial-linear(circle_at_center,#191629,#141121)] overflow-x-hidden">
            <Header />
            
            {/* Hero Content */}
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
                {/* Main Title */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-chillax-bold text-[#F2F2F9] mb-6 leading-tight">
                    Test Your Knowledge
                    <br />
                    <span className="bg-linear-to-r from-[#23F0C7] via-[#FFE347] to-[#EF767A] bg-clip-text text-transparent">
                        Challenge Yourself
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl text-[#F2F2F9]/80 font-chillax mb-12 max-w-3xl px-4">
                    Thousands of questions across multiple categories. 
                    Race against time and track your progress!
                </p>

                {/* CTA Button */}
                <button
                    onClick={() => setShowQuiz(true)}
                    className="group relative px-12 py-5 bg-linear-to-r from-[#23F0C7] to-[#FFE347] text-[#141121] font-chillax-bold text-xl rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-110"
                >
                    <span className="relative z-10">Start Quiz</span>
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-linear-to-r from-[#FFE347] to-[#EF767A] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl w-full px-4">
                    {/* Feature 1 */}
                    <div className="bg-[#F2F2F9]/5 backdrop-blur-lg border border-[#F2F2F9]/10 rounded-3xl p-8 hover:bg-[#F2F2F9]/10 transition-all duration-300 hover:scale-105">
                        <div className="text-5xl mb-4">⏱️</div>
                        <h3 className="text-xl font-chillax-bold text-[#F2F2F9] mb-3">
                            Timed Challenges
                        </h3>
                        <p className="text-[#F2F2F9]/60 font-chillax text-sm">
                            Race against the clock with customizable time limits for each quiz
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-[#F2F2F9]/5 backdrop-blur-lg border border-[#F2F2F9]/10 rounded-3xl p-8 hover:bg-[#F2F2F9]/10 transition-all duration-300 hover:scale-105">
                        <div className="text-5xl mb-4">💾</div>
                        <h3 className="text-xl font-chillax-bold text-[#F2F2F9] mb-3">
                            Auto-Save Progress
                        </h3>
                        <p className="text-[#F2F2F9]/60 font-chillax text-sm">
                            Resume your quiz anytime, even after closing the browser
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-[#F2F2F9]/5 backdrop-blur-lg border border-[#F2F2F9]/10 rounded-3xl p-8 hover:bg-[#F2F2F9]/10 transition-all duration-300 hover:scale-105">
                        <div className="text-5xl mb-4">📚</div>
                        <h3 className="text-xl font-chillax-bold text-[#F2F2F9] mb-3">
                            Multiple Categories
                        </h3>
                        <p className="text-[#F2F2F9]/60 font-chillax text-sm">
                            Choose from science, history, sports, entertainment, and more
                        </p>
                    </div>
                </div>

                {/* Stats/Info Bar */}
                <div className="flex flex-wrap items-center justify-center gap-8 mt-16 text-[#F2F2F9]/60 font-chillax text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🎯</span>
                        <span>5-50 Questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">📊</span>
                        <span>20+ Categories</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">⚡</span>
                        <span>Instant Results</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🏆</span>
                        <span>Track Performance</span>
                    </div>
                </div>
            </div>
        </section>
    );
}