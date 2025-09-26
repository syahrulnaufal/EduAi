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

  // Fetch data subbab
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
        }
      })
      .catch(console.error);
  }, [babId]);

  // Tambah SubBab
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

  // Edit SubBab
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

  // Hapus SubBab
  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus SubBab?",
      text: "Data ini tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:5000/api/subbab/${id}`, {
            method: "DELETE",
          });
          const data = await res.json();
          Swal.fire("Terhapus!", data.message, "success");
          setSubbab(subbab.filter((s) => s.id_subbab !== id));
        } catch (err) {
          Swal.fire("Error", "Gagal menghapus data", "error");
        }
      }
    });
  };

  // Simpan Tambah/Edit
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
        id_bab: babId, // wajib dikirim agar tidak NULL (FK error)
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    Swal.fire("Sukses", data.message, "success");
    setShowModal(false);

    // Refresh data setelah simpan
    fetch(`http://localhost:5000/api/subbab/admin/${babId}`)
      .then((res) => res.json())
      .then(setSubbab);
  } catch (err) {
    Swal.fire("Error", err.message, "error");
  }
};
const filteredSubbab = subbab.filter((s) =>
    s.judul_subbab.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="p-1 sm:p-6 bg-gray-50 min-h-[calc(100vh-80px)] text-xs sm:text-base">
      {/* Header: Judul left, search right */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-xl font-bold mb-4 sm:mb-0">
          {pelajaranInfo && (
          <nav className="flex items-center gap-2 text-lg sm:text-2xl font-bold text-black whitespace-nowrap">
            <span>{pelajaranInfo.nama_jenjang}</span>
            <span>/</span>
            <button
              className="hover:underline focus:outline-none"
              onClick={() => window.location.href = '/admin.html#/pelajaran'}
            >
              {pelajaranInfo.nama_pelajaran}
            </button>
            <span>/</span>
            <button
              className="hover:underline focus:outline-none"
              onClick={() => window.location.href = `/admin.html#/pelajaran/${jenjangId}/${pelajaranId}`}
            >
              {pelajaranInfo.judul_bab}
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
            placeholder="Cari SubBab..."
            className="px-2 py-2 outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // update state
          />
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full sm:w-[210px]"
          onClick={openAddModal}>
          + Tambah SubBab
        </button>
      </div>
      

      {/* Tabel SubBab */}
      <div className="overflow-x-auto mb-6 bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">NO</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">Nama SubBab</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">Link Video</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">Urutan</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg w-[75px] sm:w-[200px]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubbab.map((s, i) => (
              <tr key={s.id_subbab} className="hover:bg-gray-50">
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{i + 1}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{s.judul_subbab}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg truncate">{s.video_materi}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{s.urutan}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 justify-center">
                    <button className="bg-yellow-400 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-yellow-500 inline-flex items-center justify-center text-xs sm:text-base min-w-[60px] sm:min-w-[80px]"
                    onClick={() => openEditModal(s)}>
                      <i className="fa-solid fa-pen-to-square"></i>
                      <span className="hidden sm:inline ml-2">Edit</span>
                    </button>
                    <button className="bg-red-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-red-600 inline-flex items-center justify-center text-xs sm:text-base min-w-[60px] sm:min-w-[80px]"
                    onClick={() => handleDelete(s.id_subbab)}>
                      <i className="fa-solid fa-trash"></i>
                      <span className="hidden sm:inline ml-2">Hapus</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded shadow w-[500px]">
            <h2 className="text-lg font-bold mb-4">
              {isEdit ? "Edit SubBab" : "Tambah SubBab"}
            </h2>
            <span className="text-xs text-gray-500">Nama SubBab</span>
            <input
              type="text"
              value={formData.judul_subbab}
              onChange={(e) =>
                setFormData({ ...formData, judul_subbab: e.target.value })
              }
              className="border p-2 w-full mb-2"
              placeholder="Nama SubBab"
            />
            <span className="text-xs text-gray-500">Link Video</span>
            <input
              type="text"
              value={formData.video_materi}
              onChange={(e) =>
                setFormData({ ...formData, video_materi: e.target.value })
              }
              className="border p-2 w-full mb-2"
              placeholder="Link Video"
            />
            <span className="text-xs text-gray-500">Urutan</span>
            <input
              type="number"
              value={formData.urutan}
              onChange={(e) =>
                setFormData({ ...formData, urutan: e.target.value })
              }
              className="border p-2 w-full mb-4"
              placeholder="Urutan"
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-400 px-4 py-2 text-white rounded"
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button
                className="bg-blue-600 px-4 py-2 text-white rounded"
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