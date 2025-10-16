import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function DetailPelajaran() {
  const { jenjangId, pelajaranId } = useParams();
  const navigate = useNavigate();

  const [bab, setBab] = useState([]);
  const [pelajaranInfo, setPelajaranInfo] = useState(null);
  const [pelajaranList, setPelajaranList] = useState([]);
  const [selectedPelajaran, setSelectedPelajaran] = useState(pelajaranId);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [previewIcon, setPreviewIcon] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    id_bab: null,
    judul_bab: "",
    point_xp: 0,
    detail: "",
    harga: 0,
    icon: "",
    id_pelajaran: pelajaranId,
  });

  // === Pagination ===
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch("http://localhost:5000/api/pelajaran")
      .then((res) => res.json())
      .then(setPelajaranList)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/api/bab/pelajaran/${selectedPelajaran}`)
      .then((res) => res.json())
      .then((data) => {
        setBab(data);
        if (data.length > 0) {
          setPelajaranInfo({
            nama_pelajaran: data[0].nama_pelajaran,
            icon: data[0].icon_pelajaran,
            nama_jenjang: data[0].nama_jenjang,
          });
        } else setPelajaranInfo(null);
      })
      .catch(console.error);
  }, [selectedPelajaran]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value.toLowerCase());
  const filteredBab = bab.filter((b) =>
    b.judul_bab.toLowerCase().includes(searchTerm)
  );

  // === Pagination Logic ===
  const totalPages = Math.ceil(filteredBab.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredBab.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const openAddModal = () => {
    setIsEdit(false);
    setFormData({
      id_bab: null,
      judul_bab: "",
      point_xp: 0,
      detail: "",
      harga: 0,
      icon: "",
      id_pelajaran: selectedPelajaran,
    });
    setPreviewIcon(null);
    setFileInputKey(Date.now());
    setShowModal(true);
  };

  const openEditModal = (b) => {
    setIsEdit(true);
    setFormData({
      id_bab: b.id_bab,
      judul_bab: b.judul_bab,
      point_xp: b.point_xp,
      detail: b.detail,
      harga: b.harga,
      icon: b.icon,
      id_pelajaran: b.id_pelajaran,
    });
    setPreviewIcon(b.icon);
    setFileInputKey(Date.now());
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const url = isEdit
        ? `http://localhost:5000/api/bab/${formData.id_bab}`
        : "http://localhost:5000/api/bab";
      const method = isEdit ? "PUT" : "POST";
      const body = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "id_bab") body.append(key, value);
      });
      if (formData.icon instanceof File) body.append("icon", formData.icon);

      const res = await fetch(url, { method, body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Swal.fire("Sukses", data.message, "success");
      setShowModal(false);
      fetch(`http://localhost:5000/api/bab/pelajaran/${selectedPelajaran}`)
        .then((r) => r.json())
        .then(setBab);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Bab?",
      text: "Data ini tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:5000/api/bab/${id}`, {
            method: "DELETE",
          });
          const data = await res.json();
          Swal.fire("Terhapus!", data.message, "success");
          setBab(bab.filter((b) => b.id_bab !== id));
        } catch {
          Swal.fire("Error", "Gagal menghapus data", "error");
        }
      }
    });
  };

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-[calc(100vh-80px)] text-xs sm:text-base w-full overflow-x-hidden">
      <div className="w-full overflow-hidden px-2 sm:px-6">
        {/* === Header === */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <nav className="flex flex-wrap items-center gap-2 text-base sm:text-2xl font-bold text-gray-800">
            {pelajaranInfo && (
              <>
                <span>{pelajaranInfo.nama_jenjang}</span>
                <span>/</span>
                <button
                  className="hover:underline text-purple-600"
                  onClick={() => navigate("/pelajaran")}
                >
                  {pelajaranInfo.nama_pelajaran}
                </button>
              </>
            )}
          </nav>
        </div>

        {/* === Search + Tambah === */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-6">
          <div className="flex items-center border rounded-md overflow-hidden w-full sm:w-80">
            <i className="fa-solid fa-magnifying-glass text-gray-400 px-2"></i>
            <input
              type="text"
              placeholder="Cari Bab..."
              className="px-2 py-2 outline-none w-full text-sm"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              className="border rounded-md px-3 py-2 w-full sm:w-auto"
              value={selectedPelajaran}
              onChange={(e) => setSelectedPelajaran(e.target.value)}
            >
              {pelajaranList.map((p) => (
                <option key={p.id_pelajaran} value={p.id_pelajaran}>
                  {p.nama_pelajaran}
                </option>
              ))}
            </select>
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full sm:w-[210px]"
              onClick={openAddModal}
            >
              + Tambah Bab
            </button>
          </div>
        </div>

        {/* === Table === */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
          <table className="min-w-full border-collapse text-[11px] sm:text-sm md:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 sm:p-3 border border-gray-300 text-center w-10">No</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-left">Nama Bab</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-left">Deskripsi</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">SubBab</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">Soal</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">XP</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((b, i) => (
                  <tr key={b.id_bab} className="hover:bg-gray-50 text-center">
                    <td className="p-2 sm:p-3 border border-gray-300">{startIndex + i + 1}</td>
                    <td className="p-2 sm:p-3 border border-gray-300 text-left">
                      <div className="flex items-center gap-2">
                        {b.icon ? (
                          <img src={b.icon} alt="icon" className="w-8 h-8 object-cover rounded" />
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 rounded grid place-items-center">-</div>
                        )}
                        <span className="break-words">{b.judul_bab}</span>
                      </div>
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300 text-left">{b.detail || "-"}</td>
                    <td className="p-2 sm:p-3 border border-gray-300">{b.total_subbab}</td>
                    <td className="p-2 sm:p-3 border border-gray-300">{b.total_quiz}</td>
                    <td className="p-2 sm:p-3 border border-gray-300">{b.point_xp}</td>
                    <td className="p-2 sm:p-3 border border-gray-300">
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm"
                          onClick={() =>
                            navigate(`/pelajaran/${jenjangId}/${selectedPelajaran}/${b.id_bab}`)
                          }
                        >
                          <i className="fa-solid fa-layer-group"></i> SubBab
                        </button>
                        <button
                          className="bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm"
                          onClick={() => navigate(`/quiz/${selectedPelajaran}/${b.id_bab}`)}
                        >
                          <i className="fa-solid fa-list-check"></i> Soal
                        </button>
                        <button
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm"
                          onClick={() => openEditModal(b)}
                        >
                          <i className="fa-solid fa-pen-to-square"></i> Edit
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm"
                          onClick={() => handleDelete(b.id_bab)}
                        >
                          <i className="fa-solid fa-trash"></i> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500 italic">
                    Belum ada data bab.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* === Pagination mirip Users === */}
          {filteredBab.length > 0 && (
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
          <div className="bg-white p-6 rounded-lg shadow w-[90vw] max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {isEdit ? "Edit Bab" : "Tambah Bab"}
            </h2>
            <div className="flex flex-col gap-2 text-sm">
              <label>Judul Bab</label>
              <input
                type="text"
                value={formData.judul_bab}
                onChange={(e) =>
                  setFormData({ ...formData, judul_bab: e.target.value })
                }
                className="border p-2 rounded"
              />
              <label>Point XP</label>
              <input
                type="number"
                value={formData.point_xp}
                onChange={(e) =>
                  setFormData({ ...formData, point_xp: e.target.value })
                }
                className="border p-2 rounded"
              />
              <label>Detail</label>
              <textarea
                rows="3"
                value={formData.detail}
                onChange={(e) =>
                  setFormData({ ...formData, detail: e.target.value })
                }
                className="border p-2 rounded"
              />
              <label>Harga</label>
              <input
                type="number"
                value={formData.harga}
                onChange={(e) =>
                  setFormData({ ...formData, harga: e.target.value })
                }
                className="border p-2 rounded"
              />
              <label>Icon (PNG)</label>
              {previewIcon && (
                <img
                  src={
                    formData.icon instanceof File
                      ? URL.createObjectURL(formData.icon)
                      : previewIcon
                  }
                  alt="preview"
                  className="w-16 h-16 object-cover rounded border mb-1"
                />
              )}
              <input
                key={fileInputKey}
                type="file"
                accept="image/png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.type !== "image/png") {
                    Swal.fire("Format salah", "Icon wajib PNG (.png)", "warning");
                    setFileInputKey(Date.now());
                    return;
                  }
                  setFormData({ ...formData, icon: file });
                  setPreviewIcon(URL.createObjectURL(file));
                }}
                className="border p-2 rounded"
              />
              <label>Pindah Pelajaran</label>
              <select
                value={formData.id_pelajaran}
                onChange={(e) =>
                  setFormData({ ...formData, id_pelajaran: e.target.value })
                }
                className="border p-2 rounded"
              >
                {pelajaranList.map((p) => (
                  <option key={p.id_pelajaran} value={p.id_pelajaran}>
                    {p.nama_pelajaran}
                  </option>
                ))}
              </select>
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
