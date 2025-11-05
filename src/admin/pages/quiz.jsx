import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Quiz() {
  const { jenjangId, pelajaranId, babId } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [info, setInfo] = useState(null);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    id_quiz: null,
    nama_quiz: "",
    rating: 0,
  });

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

 // === Fetch Quiz ===
const fetchQuiz = () => {
  fetch(`${API_URL}/api/quiz/admin/${babId}`)
    .then((res) => res.json())
    .then((data) => {
      const quizData = Array.isArray(data) ? data : [];
      setQuiz(quizData);

      if (quizData.length > 0) {
        setInfo({
          nama_jenjang: quizData[0].nama_jenjang,
          nama_pelajaran: quizData[0].nama_pelajaran,
          judul_bab: quizData[0].judul_bab,
        });
      } else {
        // 🟢 kalau kosong, langsung buka modal tambah quiz
        setIsEdit(false);
        setShowModal(true);
      }
    })
    .catch(console.error);
};

useEffect(() => {
  fetchQuiz();
}, [babId]);


  // === Modal handlers ===
  const openAddModal = () => {
    setIsEdit(false);
    setFormData({ id_quiz: null, nama_quiz: "", rating: 0 });
    setShowModal(true);
  };

  const openEditModal = (q) => {
    setIsEdit(true);
    setFormData(q);
    setShowModal(true);
  };

  // === Save data ===
  const handleSave = async () => {
    try {
      const url = isEdit
        ? `${API_URL}/api/quiz/${formData.id_quiz}`
        : `${API_URL}/api/quiz`;
      const method = isEdit ? "PUT" : "POST";

      const body = JSON.stringify({
        nama_quiz: formData.nama_quiz,
        rating: formData.rating,
        id_bab: babId,
      });

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      Swal.fire("Sukses", data.message, "success");
      setShowModal(false);
      fetchQuiz();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // === Hapus Quiz ===
  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Quiz?",
      text: "Data ini tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        const res = await fetch(`${API_URL}/api/quiz/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        Swal.fire("Terhapus!", data.message, "success");
        fetchQuiz();
      } catch {
        Swal.fire("Error", "Gagal menghapus quiz", "error");
      }
    });
  };

  const filteredQuiz = quiz.filter((q) =>
    q.nama_quiz?.toLowerCase().includes(search.toLowerCase())
  );

  // === Pagination logic ===
  const totalPages = Math.ceil(filteredQuiz.length / itemsPerPage);
  const paginatedQuiz = filteredQuiz.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-[calc(100vh-80px)] text-xs sm:text-base w-full overflow-x-hidden">
      <div className="w-full overflow-hidden px-2 sm:px-6">
        {/* Header */}
        {info && (
          <nav className="flex flex-wrap items-center gap-2 text-base sm:text-2xl font-bold text-gray-800 mb-6">
            <span>{info.nama_jenjang}</span>
            <span>/</span>
            <button
              className="hover:underline"
              onClick={() => (window.location.href = "/admin.html#/pelajaran")}
            >
              {info.nama_pelajaran}
            </button>
            <span>/</span>
            <button
              className="hover:underline"
              onClick={() =>
                (window.location.href = `/admin.html#/pelajaran/${jenjangId}/${pelajaranId}`)
              }
            >
              {info.judul_bab}
            </button>
          </nav>
        )}

        {/* Search & Tambah */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-6">
          <div className="flex items-center border rounded-md overflow-hidden w-full sm:w-80">
            <i className="fa-solid fa-magnifying-glass text-gray-400 px-2"></i>
            <input
              type="text"
              placeholder="Cari Quiz..."
              className="px-2 py-2 outline-none w-full text-sm"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full sm:w-[210px]"
            onClick={openAddModal}
          >
            + Tambah Quiz
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
          <table className="min-w-full border-collapse text-[11px] sm:text-sm md:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">No</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-left">Nama Quiz</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">Jumlah Soal</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">Rating</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedQuiz.length > 0 ? (
                paginatedQuiz.map((q, i) => (
                  <tr key={q.id_quiz} className="hover:bg-gray-50 text-center">
                    <td className="p-2 sm:p-3 border border-gray-300">
                      {(currentPage - 1) * itemsPerPage + i + 1}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300 text-left break-words">
                      {q.nama_quiz}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300">
                      {q.jumlah_soal || 0}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300">
                      {q.rating || 0}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300 text-center">
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs sm:text-sm"
                          onClick={() =>
                            navigate(`/quiz/${pelajaranId}/${babId}/${q.id_quiz}`)
                          }
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        <button
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-xs sm:text-sm"
                          onClick={() => openEditModal(q)}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs sm:text-sm"
                          onClick={() => handleDelete(q.id_quiz)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500 italic">
                    Belum ada quiz.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredQuiz.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-6 text-sm sm:text-base">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              Previous
            </button>

            <span className="text-gray-700">
              Halaman {currentPage} dari {totalPages || 1}
            </span>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages || totalPages === 0
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* === Modal Tambah/Edit === */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow w-[90vw] max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {isEdit ? "Edit Quiz" : "Tambah Quiz"}
            </h2>

            <div className="flex flex-col gap-3 text-sm">
              <div>
                <label>Nama Quiz</label>
                <input
                  type="text"
                  placeholder="Masukkan nama quiz..."
                  className="border p-2 rounded w-full"
                  value={formData.nama_quiz}
                  onChange={(e) =>
                    setFormData({ ...formData, nama_quiz: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Rating</label>
                <input
                  type="number"
                  placeholder="Masukkan rating (1-5)"
                  className="border p-2 rounded w-full"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: e.target.value })
                  }
                  min="0"
                  max="5"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={handleSave}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
