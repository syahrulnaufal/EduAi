import React from "react";
import Topbar from "../components/Topbar";
import { useState } from "react";
import '../style.css'; 
import Sidebar from "../components/Sidebar";
import BurgerMenu from "../components/BurgerMenu";
import ExamResultsModal from "../components/ExamResultsModal";
import { useNavigate } from "react-router";

const examData = [
    {
        id: 1,
        questionText: 'Manakah di antara berikut ini yang merupakan ibu kota Indonesia?',
        options: ['Bandung', 'Jakarta', 'Surabaya', 'Medan'],
        correctAnswer: 'Jakarta',
    },
    {
        id: 2,
        questionText: 'Planet terdekat dengan Matahari adalah...',
        options: ['Venus', 'Mars', 'Merkurius', 'Bumi'],
        correctAnswer: 'Merkurius',
    },
    {
        id: 3,
        questionText: 'Air sangat penting bagi kehidupan makhluk hidup di bumi. Tanpa air, manusia, hewan, dan tumbuhan tidak dapat bertahan hidup. Selain untuk minum, air juga digunakan untuk mandi, mencuci, dan memasak. Sayangnya, banyak orang yang belum sadar pentingnya menjaga sumber air bersih. Pencemaran air bisa disebabkan oleh limbah rumah tangga, industri, maupun pertanian. Jika terus dibiarkan, hal ini bisa merusak ekosistem dan mengganggu kesehatan manusia. Apa upaya sederhana yang bisa dilakukan untuk menjaga kebersihan air?',
        options: ['Membakar sampah', 'Membuang limbah ke sungai', 'Menghemat air', 'Menyiram oli ke tanah'],
        correctAnswer: 'Menghemat air',
    },
    { id: 4, questionText: 'Soal nomor 4...', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A' },
    { id: 5, questionText: 'Soal nomor 5...', options: ['A', 'B', 'C', 'D'], correctAnswer: 'B' },
    { id: 6, questionText: 'Soal nomor 6...', options: ['A', 'B', 'C', 'D'], correctAnswer: 'C' },
    { id: 7, questionText: 'Soal nomor 7...', options: ['A', 'B', 'C', 'D'], correctAnswer: 'D' },
    { id: 8, questionText: 'Soal nomor 8...', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A' },
    { id: 9, questionText: 'Soal nomor 9...', options: ['A', 'B', 'C', 'D'], correctAnswer: 'B' },
    { id: 10, questionText: 'Soal nomor 10...', options: ['A', 'B', 'C', 'D'], correctAnswer: 'C' },
];

function ExamPage(){
    // Navigate
    const navigate = useNavigate();

    // Sidebar 
    const [left, setLeft] = useState('-left-70') 
    const [bg, setBg] = useState('bg-transparent -z-10')
    const [isSidebarHidden, setIsSidebarHidden] = useState(true)
    const iconSize = '20px'
    const menuButton = <svg xmlns="http://www.w3.org/2000/svg" id='menu' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
    const closeButton = <svg xmlns="http://www.w.w3.org/2000/svg" id='close' height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>;
    const [menuIcon, setMenuIcon] = useState(isSidebarHidden? menuButton : closeButton)
    
    // Function to hide the sidebar
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

    // --- LOGIC & STATE UNTUK UJIAN ---
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); 
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false); 
    const currentQuestion = examData[currentQuestionIndex];

    const handleNext = () => {
        if (currentQuestionIndex < examData.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSelectAnswer = (option) => {
        setUserAnswers({
            ...userAnswers,
            [currentQuestionIndex]: option,
        });
    };
    
    const handleSelectQuestion = (index) => {
        setCurrentQuestionIndex(index);
    }

    //Buat Fungsi handleSubmit
    const handleSubmit = () => {
        
        console.log("Jawaban Pengguna:", userAnswers);
        setShowResults(true); // Tampilkan modal hasil
    };

    const handleReview = () => {
        navigate('/exam/pembahasan', { 
            state: { 
                questions: examData, 
                userAnswers: userAnswers 
            } 
        });
    };

    return(
        <div className="bg-gray-100 min-h-screen font-sans flex flex-col ">
            <Sidebar 
                className='absolute'
                hideSidebar={hideSidebar} 
                left={left} 
                bg={bg}
            >
                <BurgerMenu icon={menuIcon} handleClick={hideSidebar}/>
            </Sidebar>

            <Topbar>
                <BurgerMenu icon={menuIcon} handleClick={hideSidebar}/>
            </Topbar>
            
            <div className="flex-1 flex flex-col ">
                {/* Header Ujian */}
                <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 px-8 shadow-md">
                    <h1 className="text-lg font-semibold">Hi, Beler!</h1>
                    <p className="text-sm">Selamat mengerjakan!</p>
                </header>

                {/*  Ujian */}
                <div className="p-4 md:p-8 flex flex-col sm:flex-row gap-6 items-start justify-center flex-1">
                    
                    {/* Navigasi Nomor Soal */}
                    <div className="grid grid-cols-5 gap-2 md:gap-4 mb-6 mt-6 w-full sm:w-150 max-w-full ">
                        {examData.map((question, index) => (
                            <button 
                                key={question.id}
                                onClick={() => handleSelectQuestion(index)}
                                className={`p-3 text-sm md:text-base rounded-md font-bold transition-colors duration-200 ${
                                    index === currentQuestionIndex 
                                    ? 'bg-green-500 text-white' 
                                    : userAnswers[index] 
                                    ? 'bg-blue-500 text-white' // Tandai jika sudah dijawab
                                    : 'bg-gray-200 hover:bg-gray-400'
                                }`}
                            >
                                {question.id}
                            </button>
                        ))}
                    </div>

                    {/* Kotak Soal dan Jawaban */}
                    <div className=" w-full max-w-4xl mh-full">
                        <div className="flex flex-col bg-white h-full p-6 md:p-8 rounded-lg shadow-md w-full">        
                            <h2 className="text-center text-lg font-bold text-gray-700 mb-6">SOAL NO. {currentQuestion.id}</h2>
                            
                            <div className="border rounded-md p-6 mb-8 border-gray-300">
                                <p className="text-gray-800 leading-relaxed text-justify">
                                    {currentQuestion.questionText}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentQuestion.options.map((option, index) => {
                                    const optionLetter = String.fromCharCode(65 + index);
                                    const isSelected = userAnswers[currentQuestionIndex] === option;

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleSelectAnswer(option)}
                                            className={`p-4 border rounded-lg text-left transition-all duration-200 flex items-start space-x-3 ${
                                                isSelected
                                                ? 'bg-blue-100 border-blue-300 ring-2 ring-blue-300'
                                                : 'border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="font-bold">{optionLetter}.</span>
                                            <span>{option}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex justify-between mt-10 pt-6 ">
                            <button 
                                onClick={handlePrevious}
                                disabled={currentQuestionIndex === 0}
                                className="bg-red-500 text-white px-8 py-2 rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-red-600 transition-colors"
                            >
                                Previous
                            </button>

                            {/* ✅ 4. Ubah Tombol "Next" menjadi "Submit" di soal terakhir */}
                            {currentQuestionIndex === examData.length - 1 ? (
                                <button 
                                    onClick={handleSubmit}
                                    className="bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Submit
                                </button>
                            ) : (
                                <button 
                                    onClick={handleNext}
                                    className="bg-green-500 text-white px-8 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                {showResults && (
                    <ExamResultsModal
                        questions={examData}
                        userAnswers={userAnswers}
                        onReview={handleReview}
                        onClose={() => setShowResults(false)}
                    />
                )}
            </div>

        </div>
    );
}

export default ExamPage;