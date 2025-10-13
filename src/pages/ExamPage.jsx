import React, { useState, useEffect } from "react";
import Topbar from "../components/Topbar";
import "../style.css"; 
import Sidebar from "../components/Sidebar";
import BurgerMenu from "../components/BurgerMenu";
import ExamResultsModal from "../components/ExamResultsModal";
import { useNavigate, useParams } from "react-router-dom";

function ExamPage() {
  const navigate = useNavigate();
  const { id: id_quiz } = useParams();

  const user = JSON.parse(localStorage.getItem("user"));
  const id_user = user?.id || user?.id_user;
  const [idHasil, setIdHasil] = useState(null);

  const [examData, setExamData] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true); // <== ini tadi belum ada


  // Sidebar
  const [left, setLeft] = useState("-left-70"); 
  const [bg, setBg] = useState("bg-transparent -z-10");
  const [isSidebarHidden, setIsSidebarHidden] = useState(true);
  const iconSize = "20px";
  const menuButton = (
    <svg xmlns="http://www.w3.org/2000/svg" height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark">
      <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
    </svg>
  );
  const closeButton = (
    <svg xmlns="http://www.w3.org/2000/svg" height={iconSize} viewBox="0 -960 960 960" width={iconSize} className="fill-my-text dark:fill-my-text-dark">
      <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
    </svg>
  );
  const [menuIcon, setMenuIcon] = useState(isSidebarHidden ? menuButton : closeButton);

  function hideSidebar() {
    if (isSidebarHidden) {
      setLeft("left-0");
      setBg("bg-my-bg-dark/70 z-20");
      setIsSidebarHidden(false);
      setMenuIcon(closeButton);
    } else {
      setLeft("-left-70");
      setIsSidebarHidden(true);
      setBg("bg-transparent -z-10");
      setMenuIcon(menuButton);
    }
  }

  // Load soal & hasil
 useEffect(() => {
    if (!id_user || !id_quiz) {
      navigate("/login");
      return;
    }

    // ✅ Ambil id_hasil dari query param
    const params = new URLSearchParams(window.location.search);
    const id_hasil = params.get("id_hasil");

    if (!id_hasil) {
      console.error("❌ id_hasil tidak ditemukan di query param!");
      navigate("/ruang-belajar"); // fallback biar ga error
      return;
    }

    setIdHasil(id_hasil);

    const loadExam = async () => {
      try {
        // Ambil soal quiz
        const soalRes = await fetch(`http://localhost:5000/api/soal/${id_quiz}`);
        const soalData = await soalRes.json();
        setExamData(soalData.soal || []);

        // Ambil jawaban user berdasarkan id_hasil
        const jawabanRes = await fetch(`http://localhost:5000/api/soal/jawaban/${id_hasil}`);
        const rows = await jawabanRes.json();

        const restored = {};
        rows.forEach(r => {
          restored[r.id_soal] = (r.jawaban_dipilih || "").toUpperCase();
        });
        setUserAnswers(restored);
      } catch (err) {
        console.error("ERROR load exam:", err);
      } finally {
        setLoading(false);
      }
    };

    loadExam();
  }, [id_user, id_quiz, navigate]);


  // Klik jawaban → simpan huruf (A/B/C/D uppercase)
  const handleSelectAnswer = (id_soal, optionLetter) => {
    const upper = optionLetter.toUpperCase();
    setUserAnswers(prev => ({ ...prev, [id_soal]: upper }));

    fetch("http://localhost:5000/api/soal/hasil/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_hasil: idHasil, id_soal, jawaban_dipilih: upper })
    }).catch(err => console.error(err));
  };

  // Submit akhir
  const handleSubmit = () => {
    fetch("http://localhost:5000/api/soal/hasil/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_hasil: idHasil, waktu_pengerjaan: "00:15:00" })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Score:", data.score);
        setShowResults(true);
      })
      .catch(err => console.error("Error submit:", err));
  };

  // Navigasi
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
  const handleSelectQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  if (!examData.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Memuat soal...</p>
      </div>
    );
  }

  const currentQuestion = examData[currentQuestionIndex];

  return (
    <div className="bg-gray-100 min-h-screen font-sans flex flex-col ">
      <Sidebar className="absolute" hideSidebar={hideSidebar} left={left} bg={bg}>
        <BurgerMenu icon={menuIcon} handleClick={hideSidebar}/>
      </Sidebar>

      <Topbar>
        <BurgerMenu icon={menuIcon} handleClick={hideSidebar}/>
      </Topbar>
      
      <div className="flex-1 flex flex-col ">
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 px-8 shadow-md">
          <h1 className="text-lg font-semibold">Hi, {user?.username}!</h1>
          <p className="text-sm">Selamat mengerjakan!</p>
        </header>

        <div className="p-4 md:p-8 flex flex-col sm:flex-row gap-6 items-start justify-center flex-1">
          {/* Navigasi Nomor Soal */}
          <div className="grid grid-cols-5 gap-2 md:gap-4 mb-6 mt-6 w-full sm:w-150 max-w-full ">
            {examData.map((question, index) => (
              <button 
                key={question.id_soal}
                onClick={() => handleSelectQuestion(index)}
                className={`p-3 text-sm md:text-base rounded-md font-bold transition-colors duration-200 ${
                  index === currentQuestionIndex 
                  ? "bg-green-500 text-white" 
                  : userAnswers[question.id_soal] 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-200 hover:bg-gray-400"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

           {/* Kotak Soal */}
          <div className="w-full max-w-2xl">
            <div className="flex flex-col bg-white p-4 md:p-5 rounded-lg shadow-md">        
              <h2 className="text-center text-base font-bold text-gray-700 mb-4">
                SOAL NO. {currentQuestionIndex + 1}
              </h2>
              
              <div className="border rounded-md p-4 mb-6 border-gray-300">
                <p className="text-gray-800 leading-relaxed text-justify text-sm">
                  {currentQuestion.pertanyaan}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[currentQuestion.opsi_a, currentQuestion.opsi_b, currentQuestion.opsi_c, currentQuestion.opsi_d]
                  .filter(Boolean)
                  .map((option, index) => {
                    const optionLetter = String.fromCharCode(65 + index);
                    const isSelected = (userAnswers[currentQuestion.id_soal] || "").toUpperCase() === optionLetter;

                    return (
                      <button
                        key={index}
                        onClick={() => handleSelectAnswer(currentQuestion.id_soal, optionLetter)}
                        className={`p-3 border rounded-md text-left text-sm transition-all duration-200 flex items-start space-x-2 ${
                          isSelected
                            ? "bg-blue-100 border-blue-300 ring-2 ring-blue-300"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <span className="font-bold">{optionLetter}.</span>
                        <span>{option}</span>
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="flex justify-between mt-6 pt-4">
              <button 
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-red-600 transition-colors"
              >
                Previous
              </button>

              {currentQuestionIndex === examData.length - 1 ? (
                <button 
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Submit
                </button>
              ) : (
                <button 
                  onClick={handleNext}
                  className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>

        {showResults && (
          <ExamResultsModal
            id_hasil={idHasil}
            userAnswers={userAnswers}
            onReview={() => navigate(`/exam/pembahasan?id_quiz=${id_quiz}&id_hasil=${idHasil}`)}
            onClose={() => navigate(-1)}
          />
        )}
      </div>
    </div>
  );
}

export default ExamPage;