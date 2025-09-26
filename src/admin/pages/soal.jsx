import React, { useState,useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Soal = () => {
  const {pelajaranId, babId, quizId} = useParams();  
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

  useEffect(() => {
  fetch(`http://localhost:5000/api/soal/${quizId}`)
    .then((res) => res.json())
    .then((data) => {
      setSoal(Array.isArray(data.soal) ? data.soal : []); // ✅ aman
      setJudulBab(data.judul_bab || "");
      setNamaQuiz(data.nama_quiz || "");
    })
    .catch(console.error);
}, [quizId]);


  // Tambah & Edit modal
  const openAddModal = () => {
    setIsEdit(false);
    setFormData({ pertanyaan: "", opsi_a: "", opsi_b: "", opsi_c: "", opsi_d: "", jawaban: "", id_quiz: quizId });
    setShowModal(true);
  };
  const openEditModal = (s) => {
    setIsEdit(true);
    setFormData(s);
    setShowModal(true);
  };

  // Simpan data
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

      Swal.fire("Sukses", data.message, "success").then(() => {
      setShowModal(false);
       });

      // Refresh
      fetch(`http://localhost:5000/api/soal/${quizId}`)
      .then((res) => res.json())
      .then((data) => {
        setSoal(Array.isArray(data.soal) ? data.soal : []); // ✅ selalu array
        setJudulBab(data.judul_bab || "");
        setNamaQuiz(data.nama_quiz || "");
      });

    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // Hapus soal
  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Soal?",
      text: "Data ini tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:5000/api/soal/${id}`, { method: "DELETE" });
          const data = await res.json();
          setSoal(soal.filter((s) => s.id_soal !== id));
          Swal.fire("Terhapus!", data.message, "success");
        } catch (err) {
          Swal.fire("Error", "Gagal menghapus soal", "error");
        }
      }
    });
  };

  const filteredSoal = soal.filter((s) =>
    s.pertanyaan?.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="p-1 sm:p-6 bg-gray-50 min-h-[calc(100vh-80px)] text-xs sm:text-base">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-xl font-bold mb-4 sm:mb-0">
          <nav className="flex items-center gap-2 text-lg sm:text-2xl font-bold text-black whitespace-nowrap">
            <span>{judulBab}</span>
            <span>/</span>
            <button
              className="hover:underline focus:outline-none"
              onClick={() => window.location.href = `/admin.html#/quiz/${pelajaranId}/${babId}`}
            >
              {namaQuiz}
            </button>
          </nav>
        </h1>
        </div>
        {/* Search kiri, tambah kanan */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-2">
        <div className="flex items-center border rounded-md overflow-hidden w-full sm:w-80">
          <i className="fa-solid fa-magnifying-glass text-gray-400 px-2 text-sm"></i>
          <input
            type="text"
            placeholder="Cari Soal..."
            className="px-2 py-2 outline-none w-full"
            value={search}
          onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full sm:w-[210px]"
          onClick={openAddModal}>
          + Tambah Soal
        </button>
      </div>
      

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg shadow-sm text-sm sm:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">NO</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">Pertanyaan</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">Jawaban</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">A</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">B</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">C</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">D</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg w-[75px] sm:w-[200px]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredSoal.map((s, index) => (
              <tr key={s.id_soal} className="text-center hover:bg-gray-50">
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{index + 1}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{s.pertanyaan}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg font-bold">{s.jawaban}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{s.opsi_a}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{s.opsi_b}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{s.opsi_c}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{s.opsi_d}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 justify-center">
                    <button className="bg-yellow-400 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-yellow-500 inline-flex items-center justify-center text-xs sm:text-base min-w-[60px] sm:min-w-[80px]"
                    onClick={() => openEditModal(s)}>
                      <i className="fa-solid fa-pen-to-square"></i>
                      <span className="hidden sm:inline ml-2">Edit</span>
                    </button>
                    <button className="bg-red-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-red-600 inline-flex items-center justify-center text-xs sm:text-base min-w-[60px] sm:min-w-[80px]"
                    onClick={() => handleDelete(s.id_soal)}>
                      <i className="fa-solid fa-trash"></i>
                      <span className="hidden sm:inline ml-2">Hapus</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredSoal.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-500">
                  Tidak ada soal
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="font-bold mb-4">{isEdit ? "Edit Soal" : "Tambah Soal"}</h2>
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Pertanyaan"
              value={formData.pertanyaan}
              onChange={(e) => setFormData({ ...formData, pertanyaan: e.target.value })}
            />
            <input className="border p-2 mb-2 w-full" placeholder="Opsi A" value={formData.opsi_a}
              onChange={(e) => setFormData({ ...formData, opsi_a: e.target.value })} />
            <input className="border p-2 mb-2 w-full" placeholder="Opsi B" value={formData.opsi_b}
              onChange={(e) => setFormData({ ...formData, opsi_b: e.target.value })} />
            <input className="border p-2 mb-2 w-full" placeholder="Opsi C" value={formData.opsi_c}
              onChange={(e) => setFormData({ ...formData, opsi_c: e.target.value })} />
            <input className="border p-2 mb-2 w-full" placeholder="Opsi D" value={formData.opsi_d}
              onChange={(e) => setFormData({ ...formData, opsi_d: e.target.value })} />
            <input className="border p-2 mb-2 w-full" placeholder="Jawaban" value={formData.jawaban}
              onChange={(e) => setFormData({ ...formData, jawaban: e.target.value })} />

            <div className="flex justify-end gap-2">
              <button className="bg-gray-400 px-4 py-2 rounded" onClick={() => setShowModal(false)}>Batal</button>
              <button className="bg-green-600 px-4 py-2 text-white rounded" onClick={handleSave}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Soal;
