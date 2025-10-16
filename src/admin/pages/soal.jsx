import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Soal() {
  const { pelajaranId, babId, quizId } = useParams();

  const [soal, setSoal] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id_soal: null,
    pertanyaan: "",
    opsi_a: "",
    opsi_b: "",
    opsi_c: "",
    opsi_d: "",
    jawaban: "",
    id_quiz: quizId,
  });

  const [judulBab, setJudulBab] = useState("");
  const [namaQuiz, setNamaQuiz] = useState("");

  // === Fetch data Soal ===
  useEffect(() => {
    fetch(`http://localhost:5000/api/soal/${quizId}`)
      .then((res) => res.json())
      .then((data) => {
        setSoal(Array.isArray(data.soal) ? data.soal : []);
        setJudulBab(data.judul_bab || "");
        setNamaQuiz(data.nama_quiz || "");
      })
      .catch(console.error);
  }, [quizId]);

  // === Modal handlers ===
  const openAddModal = () => {
    setIsEdit(false);
    setFormData({
      pertanyaan: "",
      opsi_a: "",
      opsi_b: "",
      opsi_c: "",
      opsi_d: "",
      jawaban: "",
      id_quiz: quizId,
    });
    setShowModal(true);
  };

  const openEditModal = (s) => {
    setIsEdit(true);
    setFormData(s);
    setShowModal(true);
  };

  // === Simpan data ===
  const handleSave = async () => {
    try {
      const url = isEdit
        ? `http://localhost:5000/api/soal/${formData.id_soal}`
        : "http://localhost:5000/api/soal";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Swal.fire("Sukses", data.message, "success");
      setShowModal(false);

      // Refresh data
      fetch(`http://localhost:5000/api/soal/${quizId}`)
        .then((r) => r.json())
        .then((d) => {
          setSoal(Array.isArray(d.soal) ? d.soal : []);
          setJudulBab(d.judul_bab || "");
          setNamaQuiz(d.nama_quiz || "");
        });
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // === Hapus Soal ===
  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Soal?",
      text: "Data ini tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then(async (res) => {
      if (!res.isConfirmed) return;
      try {
        const r = await fetch(`http://localhost:5000/api/soal/${id}`, {
          method: "DELETE",
        });
        const data = await r.json();
        setSoal(soal.filter((s) => s.id_soal !== id));
        Swal.fire("Terhapus!", data.message, "success");
      } catch {
        Swal.fire("Error", "Gagal menghapus soal", "error");
      }
    });
  };

  const filteredSoal = soal.filter((s) =>
    s.pertanyaan?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-2 sm:p-6 bg-gray-50 min-h-[calc(100vh-80px)] text-xs sm:text-base overflow-hidden">
      <div className="max-w-[95%] lg:max-w-[85%] mx-auto">
        {/* === Header === */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <nav className="flex flex-wrap items-center gap-2 text-base sm:text-2xl font-bold text-gray-800">
            <span>{judulBab}</span>
            <span>/</span>
            <button
              className="hover:underline"
              onClick={() =>
                (window.location.href = `/admin.html#/quiz/${pelajaranId}/${babId}`)
              }
            >
              {namaQuiz}
            </button>
          </nav>
        </div>

        {/* === Search + Tambah === */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-6">
          <div className="flex items-center border rounded-md overflow-hidden w-full sm:w-80">
            <i className="fa-solid fa-magnifying-glass text-gray-400 px-2"></i>
            <input
              type="text"
              placeholder="Cari Soal..."
              className="px-2 py-2 outline-none w-full text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full sm:w-[210px]"
            onClick={openAddModal}
          >
            + Tambah Soal
          </button>
        </div>

        {/* === Table Soal === */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
          <table className="min-w-full border-collapse text-[11px] sm:text-sm md:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">No</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-left">Pertanyaan</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">Jawaban</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">A</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">B</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">C</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">D</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredSoal.length > 0 ? (
                filteredSoal.map((s, i) => (
                  <tr key={s.id_soal} className="hover:bg-gray-50 text-center">
                    <td className="p-2 sm:p-3 border border-gray-300">{i + 1}</td>
                    <td className="p-2 sm:p-3 border border-gray-300 break-words text-left">
                      {s.pertanyaan}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300 font-semibold">
                      {s.jawaban}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300">{s.opsi_a}</td>
                    <td className="p-2 sm:p-3 border border-gray-300">{s.opsi_b}</td>
                    <td className="p-2 sm:p-3 border border-gray-300">{s.opsi_c}</td>
                    <td className="p-2 sm:p-3 border border-gray-300">{s.opsi_d}</td>
                    <td className="p-2 sm:p-3 border border-gray-300 text-center">
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm flex items-center gap-1"
                          onClick={() => openEditModal(s)}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm flex items-center gap-1"
                          onClick={() => handleDelete(s.id_soal)}
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
                    colSpan="8"
                    className="text-center py-4 text-gray-500 italic"
                  >
                    Tidak ada soal.
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
              {isEdit ? "Edit Soal" : "Tambah Soal"}
            </h2>

            <div className="flex flex-col gap-2 text-sm">
              <label>Pertanyaan</label>
              <textarea
                rows="3"
                value={formData.pertanyaan}
                onChange={(e) =>
                  setFormData({ ...formData, pertanyaan: e.target.value })
                }
                className="border p-2 rounded"
                placeholder="Tuliskan pertanyaan..."
              ></textarea>

              <label>Opsi A</label>
              <input
                type="text"
                value={formData.opsi_a}
                onChange={(e) =>
                  setFormData({ ...formData, opsi_a: e.target.value })
                }
                className="border p-2 rounded"
              />

              <label>Opsi B</label>
              <input
                type="text"
                value={formData.opsi_b}
                onChange={(e) =>
                  setFormData({ ...formData, opsi_b: e.target.value })
                }
                className="border p-2 rounded"
              />

              <label>Opsi C</label>
              <input
                type="text"
                value={formData.opsi_c}
                onChange={(e) =>
                  setFormData({ ...formData, opsi_c: e.target.value })
                }
                className="border p-2 rounded"
              />

              <label>Opsi D</label>
              <input
                type="text"
                value={formData.opsi_d}
                onChange={(e) =>
                  setFormData({ ...formData, opsi_d: e.target.value })
                }
                className="border p-2 rounded"
              />

              <label>Jawaban Benar</label>
              <input
                type="text"
                value={formData.jawaban}
                onChange={(e) =>
                  setFormData({ ...formData, jawaban: e.target.value })
                }
                className="border p-2 rounded"
                placeholder="Masukkan huruf atau teks jawaban benar"
              />
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
