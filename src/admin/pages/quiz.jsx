import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Quiz = () => {
  // Modal state for adding quiz
  const { jenjangId,pelajaranId, babId } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [info, setInfo] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({ id_quiz: null, nama_quiz: "", rating: 0 });

  // Fetch quiz
  const fetchQuiz = () => {
    fetch(`http://localhost:5000/api/quiz/admin/${babId}`)
      .then((res) => res.json())
      .then((data) => {
        setQuiz(data);
        if (data.length > 0) {
          setInfo({
            nama_jenjang: data[0].nama_jenjang,
            nama_pelajaran: data[0].nama_pelajaran,
            judul_bab: data[0].judul_bab,
          });
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchQuiz();
  }, [babId]);

  // Modal add/edit
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

  // Save quiz
  const handleSave = async () => {
    try {
      const url = isEdit
        ? `http://localhost:5000/api/quiz/${formData.id_quiz}`
        : `http://localhost:5000/api/quiz`;

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

  // Delete quiz
  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Quiz?",
      text: "Data ini tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:5000/api/quiz/${id}`, { method: "DELETE" });
          const data = await res.json();
          Swal.fire("Terhapus!", data.message, "success");
          fetchQuiz();
        } catch (err) {
          Swal.fire("Error", "Gagal menghapus quiz", "error");
        }
      }
    });
  };

  return (
    <div className="p-1 sm:p-6 bg-gray-50 min-h-[calc(100vh-80px)] text-xs sm:text-base">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-xl font-bold mb-4 sm:mb-0">
          {info && (
          <nav className="flex items-center gap-2 text-lg sm:text-2xl font-bold text-black whitespace-nowrap">
            <span>{info.nama_jenjang}</span>
            <span>/</span>
            <button
              className="hover:underline focus:outline-none"
              onClick={() => window.location.href = `/admin.html#/pelajaran`}
            >
              {info.nama_pelajaran}
            </button>
            <span>/</span>
            <button
              className="hover:underline focus:outline-none"
              onClick={() => window.location.href = `/admin.html#/pelajaran/${jenjangId}/${pelajaranId}`}
            >
              {info.judul_bab}
            </button>
          </nav>
        )}
        </h1>
      </div>

      {/* Search kiri, tambah kanan */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-2">
        <div className="flex items-center border rounded-md overflow-hidden w-full sm:w-80">
          <i className="fa-solid fa-magnifying-glass text-gray-400 px-2 text-sm"></i>
          <input
            type="text"
            placeholder="Cari Quiz..."
            className="px-2 py-2 outline-none w-full"
            onChange={(e) =>
            setQuiz((prev) =>
              prev.filter((q) => q.nama_quiz.toLowerCase().includes(e.target.value.toLowerCase()))
            )
          }
          />
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full sm:w-[300px]" onClick={openAddModal}>
          + Tambah Quiz
        </button>
      {/* Modal Tambah Quiz */}
      
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg shadow-sm text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">NO</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">Nama Quiz</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">Jumlah Soal</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">Rating</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg w-[75px] sm:w-[200px]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {quiz.map((q, index) => (
              <tr key={q.id_quiz} className="text-center hover:bg-gray-50">
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{index + 1}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{q.nama_quiz}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{q.jumlah_soal}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{q.rating}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 justify-center">
                    {/* View */}
                    <button className="bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-blue-600 inline-flex items-center justify-center text-xs sm:text-base min-w-[60px] sm:min-w-[80px]"
                    onClick={() => navigate(`/quiz/${pelajaranId}/${babId}/${q.id_quiz}`)}>
                      <i className="fa-solid fa-eye"></i>
                      <span className="hidden sm:inline ml-2">View</span>
                    </button>
                    {/* Edit */}
                    <button className="bg-yellow-400 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-yellow-500 inline-flex items-center justify-center text-xs sm:text-base min-w-[60px] sm:min-w-[80px]"
                        onClick={() => openEditModal(q)}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                        <span className="hidden sm:inline ml-2">Edit</span>
                      </button>
                      <button className="bg-red-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-red-600 inline-flex items-center justify-center text-xs sm:text-base min-w-[60px] sm:min-w-[80px]"
                        onClick={() => handleDelete(q.id_quiz)}
                      >
                        <i className="fa-solid fa-trash"></i>
                        <span className="hidden sm:inline ml-2">Hapus</span>
                      </button>
                  </div>
                </td>
              </tr>
            ))}
            {quiz.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  Belum ada quiz
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-bold mb-4">
              {isEdit ? "Edit Quiz" : "Tambah Quiz"}
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Quiz
              </label>
              <input
                type="text"
                placeholder="Masukkan nama quiz..."
                className="border p-2 rounded w-full"
                value={formData.nama_quiz}
                onChange={(e) => setFormData({ ...formData, nama_quiz: e.target.value })}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <input
                type="number"
                placeholder="Masukkan rating (1-5)"
                className="border p-2 rounded w-full"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                min="1"
                max="5"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowModal(false)}>
                Batal
              </button>
              <button className="bg-green-500 px-4 py-2 rounded text-white" onClick={handleSave}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;