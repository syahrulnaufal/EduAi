import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

  // === Fetch Quiz ===
  const fetchQuiz = () => {
    fetch(`http://localhost:5000/api/quiz/admin/${babId}`)
      .then((res) => res.json())
      .then((data) => {
        setQuiz(Array.isArray(data) ? data : []);
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

  // === Modal Handlers ===
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

  // === Simpan Quiz ===
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
        const res = await fetch(`http://localhost:5000/api/quiz/${id}`, {
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

  return (
    <div className="p-2 sm:p-6 bg-gray-50 min-h-[calc(100vh-80px)] text-xs sm:text-base overflow-hidden">
      <div className="max-w-[95%] lg:max-w-[85%] mx-auto">
        {/* === Header === */}
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

        {/* === Search + Tambah === */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-6">
          <div className="flex items-center border rounded-md overflow-hidden w-full sm:w-80">
            <i className="fa-solid fa-magnifying-glass text-gray-400 px-2"></i>
            <input
              type="text"
              placeholder="Cari Quiz..."
              className="px-2 py-2 outline-none w-full text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full sm:w-[210px]"
            onClick={openAddModal}
          >
            + Tambah Quiz
          </button>
        </div>

        {/* === Table === */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
          <table className="min-w-full border-collapse text-[11px] sm:text-sm md:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">
                  No
                </th>
                <th className="p-2 sm:p-3 border border-gray-300 text-left">
                  Nama Quiz
                </th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">
                  Jumlah Soal
                </th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">
                  Rating
                </th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredQuiz.length > 0 ? (
                filteredQuiz.map((q, i) => (
                  <tr key={q.id_quiz} className="hover:bg-gray-50 text-center">
                    <td className="p-2 sm:p-3 border border-gray-300">
                      {i + 1}
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
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm flex items-center gap-1"
                          onClick={() =>
                            navigate(`/quiz/${pelajaranId}/${babId}/${q.id_quiz}`)
                          }
                        >
                          <i className="fa-solid fa-eye"></i>
                          <span className="hidden sm:inline">View</span>
                        </button>
                        <button
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm flex items-center gap-1"
                          onClick={() => openEditModal(q)}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm flex items-center gap-1"
                          onClick={() => handleDelete(q.id_quiz)}
                        >
                          <i className="fa-solid fa-trash"></i>
                          <span className="hidden sm:inline">Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-4 text-gray-500 italic"
                  >
                    Belum ada quiz.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
