import React, { useState,useEffect } from "react";

const Guru = () => {
  // State daftar guru
  const [guru, setGuru] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id_guru: null,
    nama_guru: "",
    bio_guru: "",
    pendidikan_terakhir: "",
  });

  // 🔹 GET data dari backend
  useEffect(() => {
    getGuru();
  }, []);

  const getGuru = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/guru");
      const data = await res.json();
      setGuru(data);
    } catch (err) {
      Swal.fire("Error", "Gagal mengambil data guru", "error");
    }
  };

  // 🔹 Tambah guru
  const openAddModal = () => {
    setIsEdit(false);
    setFormData({ id_guru: null, nama_guru: "", bio_guru: "", pendidikan_terakhir: "" });
    setShowModal(true);
  };

  // 🔹 Edit guru
  const openEditModal = (g) => {
    setIsEdit(true);
    setFormData(g);
    setShowModal(true);
  };

  // 🔹 Simpan guru (Create / Update)
  const handleSaveGuru = async () => {
    if (!formData.nama_guru || !formData.bio_guru) {
      Swal.fire("Error", "Nama dan Bio wajib diisi!", "error");
      return;
    }

    try {
      if (isEdit) {
        await fetch(`http://localhost:5000/api/guru/${formData.id_guru}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        Swal.fire("Berhasil", "Data guru berhasil diperbarui!", "success");
      } else {
        await fetch("http://localhost:5000/api/guru", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        Swal.fire("Berhasil", "Guru berhasil ditambahkan!", "success");
      }
      getGuru();
      setShowModal(false);
    } catch (err) {
      Swal.fire("Error", "Gagal menyimpan data guru", "error");
    }
  };

  // 🔹 Hapus guru
  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data guru akan hilang permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`http://localhost:5000/api/guru/${id}`, { method: "DELETE" });
          Swal.fire("Terhapus!", "Guru berhasil dihapus.", "success");
          getGuru();
        } catch (err) {
          Swal.fire("Error", "Gagal menghapus data guru", "error");
        }
      }
    });
  };

  return (
    <div className="p-1 sm:p-6 bg-gray-50 min-h-[calc(100vh-80px)] text-xs sm:text-base">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-xl font-bold mb-4 sm:mb-0">
          Manajemen Guru
        </h1>
        </div>
        {/* Search kiri, tambah kanan */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-2">
        <div className="flex items-center border rounded-md overflow-hidden w-full sm:w-80">
          <i className="fa-solid fa-magnifying-glass text-gray-400 px-2 text-sm"></i>
          <input
            type="text"
            placeholder="Cari Guru..."
            className="px-2 py-2 outline-none w-full"
            onChange={(e) =>
              setGuru((prev) =>
                prev.filter((g) =>
                  g.nama_guru.toLowerCase().includes(e.target.value.toLowerCase())
                )
              )
            }
          />
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full sm:w-[300px]"
          onClick={openAddModal}>
          + Tambah Guru
        </button>
      </div>
      

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">No</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">Nama Guru</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">Bio Guru</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">Pendidikan Terakhir</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {guru.map((g, index) => (
              <tr key={g.id_guru} className="hover:bg-gray-50 text-center">
                <td className="p-1 sm:p-3 border border-gray-300 text-sm sm:text-lg">{index + 1}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-sm sm:text-lg">{g.nama_guru}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-sm sm:text-lg">{g.bio_guru}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-sm sm:text-lg">
                   {g.pendidikan_terakhir || '-'}
                </td>
                <td className="p-3 border border-gray-300">
                  <div className="flex justify-center gap-2">
                    <button
                      className="bg-yellow-400 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-yellow-500 min-w-[60px] sm:min-w-[80px] inline-flex items-center justify-center gap-1"
                      onClick={() => openEditModal(g)}
                    >
                      <i className="fa-solid fa-pen"></i>
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-red-600 min-w-[60px] sm:min-w-[80px] inline-flex items-center justify-center gap-1"
                      onClick={() => handleDelete(g.id_guru)}
                    >
                      <i className="fa-solid fa-trash"></i>
                      <span className="hidden sm:inline">Hapus</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah/Edit Guru */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow w-96">
            <h2 className="text-lg font-bold mb-4">
              {isEdit ? "Edit Guru" : "Tambah Guru"}
            </h2>
            <div className="flex flex-col gap-2">
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
                onChange={(e) =>
                  setFormData({ ...formData, pendidikan_terakhir: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
};


export default Guru;
