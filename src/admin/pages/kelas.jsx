import React, { useState, useEffect } from "react";

const Kelas = () => {

  // State daftar kelas
  const [kelas, setKelas] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // 🔹 Fungsi fetch dinamis (kalau ada keyword → search, kalau kosong → semua)
  const fetchKelas = async (keyword = "") => {
    try {
      let url = "http://localhost:5000/api/jenjang";
      if (keyword) {
        url = `http://localhost:5000/api/jenjang/nama/${keyword}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        setKelas([]); // kosongkan kalau tidak ada hasil
        return;
      }

      const data = await res.json();
      setKelas(data);
    } catch (err) {
      console.error("Gagal fetch data:", err);
    }
  };

  // 🔹 Debounce search (tunggu 500ms setelah user berhenti mengetik)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  // 🔹 Fetch data ketika pertama kali load & saat search berubah
  useEffect(() => {
    fetchKelas(debouncedSearch);
  }, [debouncedSearch]);


  // State modal
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({ id_jenjang: null, nama_jenjang: "" });

  // Tambah kelas
  const openAddModal = () => {
    setIsEdit(false);
    setFormData({ id_jenjang: null, nama_jenjang: "" });
    setShowModal(true);
  };

  // Edit kelas
  const openEditModal = (k) => {
    setIsEdit(true);
    setFormData(k);
    setShowModal(true);
  };

  // Simpan kelas

   const handleSaveKelas = async () => {
    if (!formData.nama_jenjang) {
      Swal.fire("Error", "Nama kelas wajib diisi!", "error");
      return;
    }

    try {
      if (isEdit) {
        // Update
        await fetch(`http://localhost:5000/api/jenjang/${formData.id_jenjang}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nama_jenjang: formData.nama_jenjang }),
        });
        Swal.fire("Berhasil", "Kelas berhasil diperbarui!", "success");
      } else {
        // Tambah
        await fetch("http://localhost:5000/api/jenjang", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nama_jenjang: formData.nama_jenjang }),
        });
        Swal.fire("Berhasil", "Kelas berhasil ditambahkan!", "success");
      }

      setShowModal(false);
      fetchKelas(); // refresh data
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Terjadi kesalahan!", "error");
    }
  };


  // Hapus kelas
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data kelas akan hilang permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`http://localhost:5000/api/jenjang/${id}`, {
            method: "DELETE",
          });
          Swal.fire("Terhapus!", "Kelas berhasil dihapus.", "success");
          fetchKelas(); // refresh data
        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Gagal menghapus kelas!", "error");
        }
      }
    });
  };

  return (
    <div className="p-1 sm:p-6 bg-gray-50 min-h-[calc(100vh-80px)] text-xs sm:text-base">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-xl font-bold mb-4 sm:mb-0">Manajemen Kelas</h1>
      </div>

      {/* Search kiri, tambah kanan */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-2">
        <div className="flex items-center border rounded-md overflow-hidden w-full sm:w-80">
          <i className="fa-solid fa-magnifying-glass text-gray-400 px-2 text-sm"></i>
          <input
            type="text"
            placeholder="Cari Kelas..."
            onChange={(e) => setSearch(e.target.value)}
            className="px-2 py-2 outline-none w-full"
          />
        </div>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full sm:w-[300px]"
          onClick={openAddModal}
        >
          + Tambah Kelas
        </button>
      </div>

      {/* Tabel */}
      <div className="relative w-full h-150 overflow-y-auto">
      <table className="min-w-full border border-gray-200 rounded-lg shadow-sm border-collapse">
        <thead className="sticky top-0 bg-gray-100 z-10 border-b border-gray-300">
          <tr>
            <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg bg-gray-100">
              No
            </th>
            <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg bg-gray-100">
              Nama Kelas
            </th>
            <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg bg-gray-100">
              Aksi
            </th>
          </tr>
        </thead>

    <tbody>
      {kelas.map((k, index) => (
        <tr key={k.id_jenjang} className="hover:bg-gray-50 text-center">
          <td className="p-1 sm:p-3 border border-gray-300 text-sm sm:text-lg">
            {index + 1}
          </td>
          <td className="p-1 sm:p-3 border border-gray-300 text-sm sm:text-lg">
            {k.nama_jenjang}
          </td>
          <td className="p-3 border border-gray-300">
            <div className="flex justify-center gap-2">
              <button
                className="bg-yellow-400 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-yellow-500 min-w-[60px] sm:min-w-[80px] inline-flex items-center justify-center gap-1"
                onClick={() => openEditModal(k)}
              >
                <i className="fa-solid fa-pen"></i>
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                className="bg-red-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-red-600 min-w-[60px] sm:min-w-[80px] inline-flex items-center justify-center gap-1"
                onClick={() => handleDelete(k.id_jenjang)}
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


      {/* Modal Tambah/Edit Kelas */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow w-96">
            <h2 className="text-lg font-bold mb-4">
              {isEdit ? "Edit Kelas" : "Tambah Kelas"}
            </h2>
            <div className="flex flex-col gap-2">
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
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
};

export default Kelas;
