import React from 'react';
import { NavLink } from 'react-router';

// Ikon centang hijau
const CheckIcon = () => (
    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
);

function ExamResultsModal({ questions, userAnswers, onClose, onReview }) {
    // --- Logika untuk menghitung skor ---
    let correctAnswersCount = 0;
    questions.forEach((question, index) => {
        if (userAnswers[index] === question.correctAnswer) {
            correctAnswersCount++;
        }
    });
    const score = Math.round((correctAnswersCount / questions.length) * 100);

    return (
        // Overlay (latar belakang gelap transparan)
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

            {/* Konten Modal */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg text-center transform transition-all scale-95 animate-in fade-in-0 zoom-in-95">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">HASIL</h2>
                
                <p className="text-5xl font-bold text-gray-700">{correctAnswersCount} / {questions.length}</p>
                <p className="text-2xl font-semibold text-gray-600 mb-6">BENAR</p>

                <div className="flex items-center justify-center space-x-2 mb-8">
                    <CheckIcon />
                    <span className="text-xl font-bold text-gray-700">Skor {score}</span>
                </div>

                {/* Grid Jawaban */}
                <div className="grid grid-cols-5 gap-3 mb-8">
                    {questions.map((q, index) => {
                        const isCorrect = userAnswers[index] === q.correctAnswer;
                        return (
                            <div
                                key={q.id}
                                className={`p-3 rounded-md font-bold text-white ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}
                            >
                                {q.id}
                            </div>
                        );
                    })}
                </div>

                {/* Tombol Pembahasan */}
                <button 
                    onClick={onReview}
                    className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-600 transition-colors"
                >
                    Pembahasan
                </button>
            </div>
        </div>
    );
}

export default ExamResultsModal;