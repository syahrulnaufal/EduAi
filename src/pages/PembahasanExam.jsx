import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Topbar from '../components/Topbar'; 
import BurgerMenu from '../components/BurgerMenu';
import Sidebar from '../components/Sidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// --- Ikon ---
const CorrectIcon = () => (
  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
  </svg>
);

const IncorrectIcon = () => (
  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
  </svg>
);

function PembahasanExam() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id_quiz = searchParams.get("id_quiz");
  const id_hasil = searchParams.get("id_hasil");

  // Ambil user dari localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const username = user.username || "User";

  // Sidebar state
  const [left, setLeft] = useState('-left-70');
  const [bg, setBg] = useState('bg-transparent -z-10');
  const [isSidebarHidden, setIsSidebarHidden] = useState(true);
  const iconSize = '18px';
  const menuButton = <svg xmlns="http://www.w3.org/2000/svg" height={iconSize} viewBox="0 -960 960 960" width={iconSize}><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>;
  const closeButton = <svg xmlns="http://www.w3.org/2000/svg" height={iconSize} viewBox="0 -960 960 960" width={iconSize}><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>;
  const [menuIcon, setMenuIcon] = useState(isSidebarHidden ? menuButton : closeButton);

  // Data state
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch pembahasan dari DB
  useEffect(() => {
    if (!id_quiz || !id_hasil) {
      navigate('/');
      return;
    }

    const loadPembahasan = async () => {
      try {
        const res = await fetch(`${API_URL}/api/soal/pembahasan/${id_quiz}/${id_hasil}`);
        const data = await res.json();

        setQuestions(data.soal || []);
        setUserAnswers(data.jawaban_user || {}); // format {id_soal: 'A'}
      } catch (err) {
        console.error("ERROR load pembahasan:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPembahasan();
  }, [id_quiz, id_hasil, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Memuat pembahasan...</div>;
  }

  if (!questions.length) {
    return <div className="flex justify-center items-center min-h-screen">Tidak ada data pembahasan.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Ambil teks jawaban
  const getAnswerText = (q, letter) => {
    if (!letter) return null;
    switch (letter.toUpperCase()) {
      case "A": return `A. ${q.opsi_a}`;
      case "B": return `B. ${q.opsi_b}`;
      case "C": return `C. ${q.opsi_c}`;
      case "D": return `D. ${q.opsi_d}`;
      default: return letter;
    }
  };

  const userAnsLetter = userAnswers[currentQuestion.id_soal] || null;
  const correctAnsLetter = currentQuestion.jawaban;
  const userAnsText = getAnswerText(currentQuestion, userAnsLetter);
  const correctAnsText = getAnswerText(currentQuestion, correctAnsLetter);

  // Navigasi soal
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
  };
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
  };
  const handleSelectQuestion = (index) => setCurrentQuestionIndex(index);

  function hideSidebar() {
    if (isSidebarHidden) {
      setLeft('left-0');
      setBg('bg-my-bg-dark/70 z-20');
      setIsSidebarHidden(false);
      setMenuIcon(closeButton);
    } else {
      setLeft('-left-70');
      setIsSidebarHidden(true);
      setBg('bg-transparent -z-10');
      setMenuIcon(menuButton);
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen font-sans flex flex-col text-sm">
      <Sidebar className='absolute' hideSidebar={hideSidebar} left={left} bg={bg}>
        <BurgerMenu icon={menuIcon} handleClick={hideSidebar}/>
      </Sidebar>
      
      <Topbar>
        <BurgerMenu icon={menuIcon} handleClick={hideSidebar}/>
      </Topbar>
      
      <div className="flex-1 flex flex-col">
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2 px-4 shadow-md">
          <h1 className="text-base font-semibold">Hi, {username}!</h1>
          <p className="text-xs">Pembahasan Ujian</p>
        </header>

        <main className="p-3 md:p-6 flex flex-col md:flex-row gap-4 items-start justify-center flex-1">
          {/* Navigasi Nomor Soal */}
          <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-5 gap-2 w-full md:max-w-xs">
            {questions.map((q, index) => {
              let buttonClass;
              const isCorrect = (userAnswers[q.id_soal] || "") === q.jawaban;
              if (index === currentQuestionIndex) {
                buttonClass = 'bg-gray-200 text-black ring-2 ring-offset-1 ring-indigo-400';
              } else {
                buttonClass = isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
              }

              return (
                <button key={q.id_soal} onClick={() => handleSelectQuestion(index)}
                  className={`p-2 text-xs md:text-sm rounded font-bold transition-colors duration-200 ${buttonClass}`}>
                  {index + 1}
                </button>
              );
            })}
          </div>

          {/* Kotak Pembahasan */}
          <div className="w-full max-w-3xl bg-white p-4 md:p-6 rounded-lg shadow-md flex flex-col h-full text-sm">
            <div className="flex-1">
              <h2 className="text-center text-base font-bold text-gray-700 mb-4">SOAL NO. {currentQuestionIndex + 1}</h2>
              <div className="space-y-4">
                <p className="text-gray-800">{currentQuestion.pertanyaan}</p>

                {/* Jawaban User */}
                <div className={`flex items-center space-x-2 p-3 rounded-lg border ${userAnsLetter === correctAnsLetter ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  {userAnsLetter === correctAnsLetter ? <CorrectIcon /> : <IncorrectIcon />}
                  <p><strong>Jawaban kamu:</strong> {userAnsText || '(Tidak dijawab)'}</p>
                </div>

                {/* Jawaban Benar */}
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-green-200 bg-green-50">
                  <CorrectIcon />
                  <p><strong>Jawaban Benar:</strong> {correctAnsText}</p>
                </div>

                {/* Pembahasan */}
                <div>
                  <h3 className="font-bold text-sm mb-1">Pembahasan:</h3>
                  <p className="text-gray-700">{currentQuestion.explanation || "Belum ada pembahasan."}</p>
                </div>

                {/* AI Explanation */}
                {currentQuestion.aiExplanation && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">🤖</span>
                      <div className="flex-1">
                        <p className="font-semibold">Jawaban AI</p>
                        <p className="text-gray-700 whitespace-pre-wrap">{currentQuestion.aiExplanation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigasi Soal */}
            <div className="flex justify-between mt-6 pt-4">
              <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}
                className="bg-red-500 text-white px-5 py-1.5 rounded font-semibold text-sm disabled:bg-gray-300 hover:bg-red-600">
                Previous
              </button>
              {currentQuestionIndex === questions.length - 1 ? (
                <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-5 py-1.5 rounded font-semibold text-sm hover:bg-blue-700">Selesai</button>
              ) : (
                <button onClick={handleNext}
                  className="bg-green-500 text-white px-5 py-1.5 rounded font-semibold text-sm hover:bg-green-600">
                  Next
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PembahasanExam;
