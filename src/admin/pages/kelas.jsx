import React, { useState, useEffect } from "react";

export default function Kelas() {
  const [kelas, setKelas] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({ id_jenjang: null, nama_jenjang: "" });

  // === Fetch Kelas ===
  const fetchKelas = async (keyword = "") => {
    try {
      const url = keyword
        ? `http://localhost:5000/api/jenjang/nama/${keyword}`
        : "http://localhost:5000/api/jenjang";
      const res = await fetch(url);
      if (!res.ok) return setKelas([]);
      const data = await res.json();
      setKelas(Array.isArray(data) ? data : []);
    } catch {
      Swal.fire("Error", "Gagal mengambil data kelas", "error");
    }
  };

  // === Debounce Search ===
  useEffect(() => {
    const delay = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    fetchKelas(debouncedSearch);
  }, [debouncedSearch]);

  // === Modal Add/Edit ===
  const openAddModal = () => {
    setIsEdit(false);
    setFormData({ id_jenjang: null, nama_jenjang: "" });
    setShowModal(true);
  };

  const openEditModal = (k) => {
    setIsEdit(true);
    setFormData(k);
    setShowModal(true);
  };

  // === Simpan Kelas ===
  const handleSaveKelas = async () => {
    if (!formData.nama_jenjang) {
      Swal.fire("Error", "Nama kelas wajib diisi!", "error");
      return;
    }

    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `http://localhost:5000/api/jenjang/${formData.id_jenjang}`
        : "http://localhost:5000/api/jenjang";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama_jenjang: formData.nama_jenjang }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Swal.fire("Sukses", data.message || "Kelas disimpan!", "success");
      setShowModal(false);
      fetchKelas();
    } catch {
      Swal.fire("Error", "Terjadi kesalahan saat menyimpan!", "error");
    }
  };

  // === Hapus Kelas ===
  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Kelas?",
      text: "Data ini tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (res) => {
      if (!res.isConfirmed) return;
      try {
        await fetch(`http://localhost:5000/api/jenjang/${id}`, { method: "DELETE" });
        Swal.fire("Terhapus!", "Kelas berhasil dihapus.", "success");
        fetchKelas();
      } catch {
        Swal.fire("Error", "Gagal menghapus kelas!", "error");
      }
    });
  };

  return (
    <div className="p-2 sm:p-6 bg-gray-50 min-h-[calc(100vh-80px)] text-xs sm:text-base overflow-hidden">
      <div className="max-w-[95%] lg:max-w-[85%] mx-auto">
        {/* === Header === */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
            Manajemen Kelas
          </h1>
        </div>

        {/* === Search + Tambah === */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-6">
          <div className="flex items-center border rounded-md overflow-hidden w-full sm:w-80">
            <i className="fa-solid fa-magnifying-glass text-gray-400 px-2"></i>
            <input
              type="text"
              placeholder="Cari Kelas..."
              className="px-2 py-2 outline-none w-full text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full sm:w-[210px]"
            onClick={openAddModal}
          >
            + Tambah Kelas
          </button>
        </div>

        {/* === Tabel === */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
          <table className="min-w-full border-collapse text-[11px] sm:text-sm md:text-base">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="p-2 sm:p-3 border border-gray-300 text-center w-[10%]">
                  No
                </th>
                <th className="p-2 sm:p-3 border border-gray-300 text-left">
                  Nama Kelas
                </th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center w-[20%]">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {kelas.length > 0 ? (
                kelas.map((k, i) => (
                  <tr key={k.id_jenjang} className="hover:bg-gray-50">
                    <td className="p-2 sm:p-3 border border-gray-300 text-center">
                      {i + 1}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300">
                      {k.nama_jenjang}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300 text-center">
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm flex items-center gap-1"
                          onClick={() => openEditModal(k)}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm flex items-center gap-1"
                          onClick={() => handleDelete(k.id_jenjang)}
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
                  <td colSpan="3" className="text-center py-4 text-gray-500 italic">
                    Tidak ada data kelas.
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
              {isEdit ? "Edit Kelas" : "Tambah Kelas"}
            </h2>

            <div className="flex flex-col gap-2 text-sm">
              <input
                type="text"
                placeholder="Nama Kelas"
                className="border p-2 rounded"
                value={formData.nama_jenjang}
                onChange={(e) =>
                  setFormData({ ...formData, nama_jenjang: e.target.value })
                }
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
                onClick={handleSaveKelas}
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
