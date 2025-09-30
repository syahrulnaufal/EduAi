import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Topbar from '../components/Topbar'; 
import BurgerMenu from '../components/BurgerMenu';
import Sidebar from '../components/Sidebar';

// --- Ikon yang Diperlukan ---
const CorrectIcon = () => <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>;
const IncorrectIcon = () => <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>;


function PembahasanExam() {
    const location = useLocation();
    const navigate = useNavigate();

    // ... State Sidebar tidak berubah ...
    const [left, setLeft] = useState('-left-70') 
    const [bg, setBg] = useState('bg-transparent -z-10')
    const [isSidebarHidden, setIsSidebarHidden] = useState(true)
    const iconSize = '20px'
    const menuButton = <svg xmlns="http://www.w3.org/2000/svg" id='menu' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
    const closeButton = <svg xmlns="http://www.w3.org/2000/svg" id='close' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>;
    const [menuIcon, setMenuIcon] = useState(isSidebarHidden? menuButton : closeButton)
    
    // Ambil data yang dikirim dari halaman ujian
    const { questions, userAnswers } = location.state || {};

    if (!questions || !userAnswers) {
        // React.useEffect(() => { navigate('/'); }, [navigate]);
        return <div>Data tidak ditemukan. Mengarahkan...</div>;
    }

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const currentQuestion = questions[currentQuestionIndex];

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
    };

    const handleSelectQuestion = (index) => {
        setCurrentQuestionIndex(index);
    }

    function hideSidebar (){
        if(isSidebarHidden){
            setLeft('left-0')
            setBg('bg-my-bg-dark/70 z-20')
            setIsSidebarHidden(false)
            setMenuIcon(closeButton)
          }else{
            setLeft('-left-70')
            setIsSidebarHidden(true)
            setBg('bg-transparent -z-10')
            setMenuIcon(menuButton)
        }
    }
    
    return (
        <div className="bg-gray-100 min-h-screen font-sans flex flex-col">
            <Sidebar className='absolute' hideSidebar={hideSidebar} left={left} bg={bg}>
                <BurgerMenu icon={menuIcon} handleClick={hideSidebar}/>
            </Sidebar>
            
            <Topbar>
                <BurgerMenu icon={menuIcon} handleClick={hideSidebar}/>
            </Topbar>
            
            <div className="flex-1 flex flex-col">
                <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 px-8 shadow-md">
                    <h1 className="text-lg font-semibold">Hi, Beler!</h1>
                    <p className="text-sm">Pembahasan Ujian</p>
                </header>

                <main className="p-4 md:p-8 flex flex-col md:flex-row gap-6 items-start justify-center flex-1">
                    {/* Navigasi Nomor Soal */}
                    <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-5 gap-2 md:gap-4 w-full md:max-w-md">
                        {questions.map((question, index) => {
                            // ✅ Logika pewarnaan tombol diperbarui di sini
                            let buttonClass;
                            if (index === currentQuestionIndex) {
                                // Warna khusus untuk soal yang sedang dibahas
                                buttonClass = 'bg-gray-200 text-black ring-4 ring-offset-2 ring-indigo-400';
                            } else {
                                // Warna untuk soal lain (benar atau salah)
                                const isCorrect = userAnswers[index] === question.correctAnswer;
                                buttonClass = isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
                            }

                            return (
                                <button key={question.id} onClick={() => handleSelectQuestion(index)}
                                    className={`p-3 text-sm md:text-base rounded-md font-bold transition-colors duration-200 ${buttonClass}`}>
                                    {question.id}
                                </button>
                            );
                        })}
                    </div>

                    {/* Kotak Pembahasan */}
                    <div className="w-full max-w-4xl bg-white p-6 md:p-8 rounded-lg shadow-md flex flex-col h-full">
                        <div className="flex-1">
                            <h2 className="text-center text-lg font-bold text-gray-700 mb-6">SOAL NO. {currentQuestion.id}</h2>
                            <div className="space-y-6">
                                <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 ${userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                    {userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer ? <CorrectIcon /> : <IncorrectIcon />}
                                    <p><strong>Jawaban kamu:</strong> {userAnswers[currentQuestionIndex] || '(Tidak dijawab)'}</p>
                                </div>
                                <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-green-200 bg-green-50">
                                    <CorrectIcon />
                                    <p><strong>Jawaban Benar:</strong> {currentQuestion.correctAnswer}</p>
                                </div>
                                <div className="mt-6">
                                    <h3 className="font-bold text-lg mb-2">Pembahasan:</h3>
                                    <p className="text-gray-700 leading-relaxed">{currentQuestion.explanation}</p>
                                </div>
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-start space-x-3">
                                        <span className="text-2xl">🤖</span>
                                        <div className="flex-1">
                                            <p className="font-semibold">Jawaban AI</p>
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{currentQuestion.aiExplanation}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between mt-10 pt-6">
                            <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}
                                className="bg-red-500 text-white px-8 py-2 rounded-lg font-semibold disabled:bg-gray-300 hover:bg-red-600 transition-colors">
                                Previous
                            </button>
                            {currentQuestionIndex === questions.length - 1 ? (
                                <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-blue-700">Selesai</button>
                            ) : (
                                <button onClick={handleNext}
                                    className="bg-green-500 text-white px-8 py-2 rounded-lg font-semibold disabled:bg-gray-300 hover:bg-green-600 transition-colors">
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