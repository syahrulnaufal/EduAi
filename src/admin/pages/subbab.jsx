import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function SubBab() {
  const { jenjangId, pelajaranId, babId } = useParams();

  const [pelajaranInfo, setPelajaranInfo] = useState(null);
  const [subbab, setSubbab] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id_subbab: null,
    judul_subbab: "",
    video_materi: "",
    urutan: "",
    id_bab: babId,
  });

  // === Pagination ===
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

// === Fetch data SubBab ===
useEffect(() => {
  fetch(`http://localhost:5000/api/subbab/admin/${babId}`)
    .then((res) => res.json())
    .then((data) => {
      setSubbab(data);

      if (data.length > 0) {
        setPelajaranInfo({
          nama_pelajaran: data[0].nama_pelajaran,
          nama_jenjang: data[0].nama_jenjang,
          judul_bab: data[0].judul_bab,
        });
      } else {
        // 🟢 kalau kosong, langsung buka modal tambah SubBab
        setIsEdit(false);
        setShowModal(true);
      }
    })
    .catch(console.error);
}, [babId]);


  // === Tambah SubBab ===
  const openAddModal = () => {
    setIsEdit(false);
    setFormData({
      id_subbab: null,
      judul_subbab: "",
      video_materi: "",
      urutan: "",
      id_bab: babId,
    });
    setShowModal(true);
  };

  // === Edit SubBab ===
  const openEditModal = (s) => {
    setIsEdit(true);
    setFormData({
      id_subbab: s.id_subbab,
      judul_subbab: s.judul_subbab || "",
      video_materi: s.video_materi || "",
      urutan: s.urutan ?? "",
      id_bab: babId,
    });
    setShowModal(true);
  };

  // === Hapus SubBab ===
  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus SubBab?",
      text: "Data ini tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        const res = await fetch(`http://localhost:5000/api/subbab/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        Swal.fire("Terhapus!", data.message, "success");
        setSubbab(subbab.filter((s) => s.id_subbab !== id));
      } catch {
        Swal.fire("Error", "Gagal menghapus data", "error");
      }
    });
  };

  // === Simpan Tambah/Edit ===
  const handleSave = async () => {
    try {
      const url = isEdit
        ? `http://localhost:5000/api/subbab/${formData.id_subbab}`
        : "http://localhost:5000/api/subbab";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judul_subbab: formData.judul_subbab,
          video_materi: formData.video_materi,
          urutan: formData.urutan,
          id_bab: babId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Swal.fire("Sukses", data.message, "success");
      setShowModal(false);

      // Refresh data
      fetch(`http://localhost:5000/api/subbab/admin/${babId}`)
        .then((r) => r.json())
        .then(setSubbab);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // === Filter & Pagination ===
  const filteredSubbab = subbab.filter((s) =>
    s.judul_subbab.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubbab.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredSubbab.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-[calc(100vh-80px)] text-xs sm:text-base w-full overflow-x-hidden">
      <div className="w-full overflow-hidden px-2 sm:px-6">
        {/* === Header === */}
        {pelajaranInfo && (
          <nav className="flex flex-wrap items-center gap-2 text-base sm:text-2xl font-bold text-gray-800 mb-6">
            <span>{pelajaranInfo.nama_jenjang}</span>
            <span>/</span>
            <button
              className="hover:underline"
              onClick={() => (window.location.href = "/admin.html#/pelajaran")}
            >
              {pelajaranInfo.nama_pelajaran}
            </button>
            <span>/</span>
            <button
              className="hover:underline"
              onClick={() =>
                (window.location.href = `/admin.html#/pelajaran/${jenjangId}/${pelajaranId}`)
              }
            >
              {pelajaranInfo.judul_bab}
            </button>
          </nav>
        )}

        {/* === Search + Tambah === */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-6">
          <div className="flex items-center border rounded-md overflow-hidden w-full sm:w-80">
            <i className="fa-solid fa-magnifying-glass text-gray-400 px-2"></i>
            <input
              type="text"
              placeholder="Cari SubBab..."
              className="px-2 py-2 outline-none w-full text-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full sm:w-[210px]"
            onClick={openAddModal}
          >
            + Tambah SubBab
          </button>
        </div>

        {/* === Tabel SubBab === */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
          <table className="min-w-full border-collapse text-[11px] sm:text-sm md:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">No</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-left">Nama SubBab</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-left">Link Video</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">Urutan</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((s, i) => (
                  <tr key={s.id_subbab} className="hover:bg-gray-50">
                    <td className="p-2 sm:p-3 border border-gray-300 text-center">
                      {startIndex + i + 1}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300 break-words">
                      {s.judul_subbab}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300 break-words">
                      {s.video_materi || "-"}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300 text-center">
                      {s.urutan || "-"}
                    </td>
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
                          onClick={() => handleDelete(s.id_subbab)}
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
                  <td colSpan="5" className="text-center py-4 text-gray-500 italic">
                    Tidak ada SubBab ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* === Pagination mirip Users === */}
          {filteredSubbab.length > 0 && (
            <div className="flex justify-center items-center py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={prevPage}
                className={`px-4 py-2 mx-2 rounded-md shadow-sm border transition-all ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                Previous
              </button>
              <span className="text-gray-700 mx-2 text-sm sm:text-base font-medium">
                Halaman {currentPage} dari {totalPages || 1}
              </span>
              <button
                onClick={nextPage}
                className={`px-4 py-2 mx-2 rounded-md shadow-sm border transition-all ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* === Modal Tambah/Edit === */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow w-[90vw] max-w-md relative">
            <h2 className="text-lg font-bold mb-4">
              {isEdit ? "Edit SubBab" : "Tambah SubBab"}
            </h2>

            <div className="flex flex-col gap-2 text-sm">
              <label>Nama SubBab</label>
              <input
                type="text"
                value={formData.judul_subbab}
                onChange={(e) =>
                  setFormData({ ...formData, judul_subbab: e.target.value })
                }
                className="border p-2 rounded"
                placeholder="Nama SubBab"
              />

              <label>Link Video</label>
              <input
                type="text"
                value={formData.video_materi}
                onChange={(e) =>
                  setFormData({ ...formData, video_materi: e.target.value })
                }
                className="border p-2 rounded"
                placeholder="URL video (opsional)"
              />

              <label>Urutan</label>
              <input
                type="number"
                value={formData.urutan}
                onChange={(e) =>
                  setFormData({ ...formData, urutan: e.target.value })
                }
                className="border p-2 rounded"
                placeholder="Nomor urutan"
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
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
