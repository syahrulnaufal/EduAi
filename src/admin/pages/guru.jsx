import React, { useState, useEffect } from "react";

export default function Guru() {
  const [guru, setGuru] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id_guru: null,
    nama_guru: "",
    bio_guru: "",
    pendidikan_terakhir: "",
  });

  // === Fetch Data Guru ===
  useEffect(() => {
    getGuru();
  }, []);

  const getGuru = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/guru");
      const data = await res.json();
      setGuru(Array.isArray(data) ? data : []);
    } catch {
      Swal.fire("Error", "Gagal mengambil data guru", "error");
    }
  };

  // === Modal Tambah/Edit ===
  const openAddModal = () => {
    setIsEdit(false);
    setFormData({ id_guru: null, nama_guru: "", bio_guru: "", pendidikan_terakhir: "" });
    setShowModal(true);
  };

  const openEditModal = (g) => {
    setIsEdit(true);
    setFormData(g);
    setShowModal(true);
  };

  // === Simpan Data ===
  const handleSaveGuru = async () => {
    if (!formData.nama_guru || !formData.bio_guru) {
      Swal.fire("Error", "Nama dan Bio wajib diisi!", "error");
      return;
    }

    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `http://localhost:5000/api/guru/${formData.id_guru}`
        : "http://localhost:5000/api/guru";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      Swal.fire("Sukses", data.message || "Data guru disimpan!", "success");
      setShowModal(false);
      getGuru();
    } catch {
      Swal.fire("Error", "Gagal menyimpan data guru", "error");
    }
  };

  // === Hapus Data ===
  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Guru?",
      text: "Data ini tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (res) => {
      if (!res.isConfirmed) return;
      try {
        await fetch(`http://localhost:5000/api/guru/${id}`, { method: "DELETE" });
        Swal.fire("Terhapus!", "Guru berhasil dihapus.", "success");
        getGuru();
      } catch {
        Swal.fire("Error", "Gagal menghapus data guru", "error");
      }
    });
  };

  // === Filter Search ===
  const filteredGuru = guru.filter((g) =>
    g.nama_guru?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-2 sm:p-6 bg-gray-50 min-h-[calc(100vh-80px)] text-xs sm:text-base overflow-hidden">
      <div className="max-w-[95%] lg:max-w-[85%] mx-auto">
        {/* === Header === */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
            Manajemen Guru
          </h1>
        </div>

        {/* === Search + Tambah === */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-6">
          <div className="flex items-center border rounded-md overflow-hidden w-full sm:w-80">
            <i className="fa-solid fa-magnifying-glass text-gray-400 px-2"></i>
            <input
              type="text"
              placeholder="Cari Guru..."
              className="px-2 py-2 outline-none w-full text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full sm:w-[210px]"
            onClick={openAddModal}
          >
            + Tambah Guru
          </button>
        </div>

        {/* === Tabel === */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
          <table className="min-w-full border-collapse text-[11px] sm:text-sm md:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 sm:p-3 border border-gray-300 text-center w-[5%]">No</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-left">Nama Guru</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-left">Bio Guru</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-left">Pendidikan Terakhir</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center w-[15%]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuru.length > 0 ? (
                filteredGuru.map((g, i) => (
                  <tr key={g.id_guru} className="hover:bg-gray-50">
                    <td className="p-2 sm:p-3 border border-gray-300 text-center">{i + 1}</td>
                    <td className="p-2 sm:p-3 border border-gray-300">{g.nama_guru}</td>
                    <td className="p-2 sm:p-3 border border-gray-300 break-words">{g.bio_guru}</td>
                    <td className="p-2 sm:p-3 border border-gray-300 text-center">
                      {g.pendidikan_terakhir || "-"}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300 text-center">
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm flex items-center gap-1"
                          onClick={() => openEditModal(g)}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm flex items-center gap-1"
                          onClick={() => handleDelete(g.id_guru)}
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
                    Tidak ada data guru.
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
              {isEdit ? "Edit Guru" : "Tambah Guru"}
            </h2>

            <div className="flex flex-col gap-2 text-sm">
              <input
                type="text"
                placeholder="Nama Guru"
                className="border p-2 rounded"
                value={formData.nama_guru}
                onChange={(e) => setFormData({ ...formData, nama_guru: e.target.value })}
              />
              <input
                type="text"
                placeholder="Bio Guru"
                className="border p-2 rounded"
                value={formData.bio_guru}
                onChange={(e) => setFormData({ ...formData, bio_guru: e.target.value })}
              />
              <input
                type="text"
                placeholder="Pendidikan Terakhir"
                className="border p-2 rounded"
                value={formData.pendidikan_terakhir}
                onChange={(e) => setFormData({ ...formData, pendidikan_terakhir: e.target.value })}
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
                onClick={handleSaveGuru}
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
