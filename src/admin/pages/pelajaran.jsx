import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Pelajaran() {
  const navigate = useNavigate();
  const API_BASE = "http://localhost:5000";

  const [pelajaran, setPelajaran] = useState([]);
  const [jenjang, setJenjang] = useState([]);
  const [selectedJenjang, setSelectedJenjang] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const [formData, setFormData] = useState({
    nama_pelajaran: "",
    icon: null,
    id_jenjang: "",
  });
  const [previewIcon, setPreviewIcon] = useState("");
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const getJenjangName = (id) =>
    jenjang.find((j) => j.id === parseInt(id))?.nama || "-";

  useEffect(() => {
    fetch(`${API_BASE}/api/jenjang`)
      .then((r) => r.json())
      .then((data) =>
        setJenjang(data.map((j) => ({ id: j.id_jenjang, nama: j.nama_jenjang })))
      )
      .catch(() => Swal.fire("Error", "Gagal memuat jenjang", "error"));

    fetch(`${API_BASE}/api/pelajaran`)
      .then((r) => r.json())
      .then(setPelajaran)
      .catch(() => Swal.fire("Error", "Gagal memuat pelajaran", "error"));
  }, []);

  const visiblePelajaran = pelajaran.filter((p) => {
    const cocokJenjang =
      selectedJenjang === 0 || Number(p.id_jenjang) === selectedJenjang;
    const cocokSearch = p.nama_pelajaran
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return cocokJenjang && cocokSearch;
  });

  const openAddModal = () => {
    setEditingData(null);
    setFormData({ nama_pelajaran: "", icon: null, id_jenjang: "" });
    setPreviewIcon("");
    setFileInputKey(Date.now());
    setShowModal(true);
  };

  const openEditModal = (row) => {
    setEditingData(row);
    setFormData({
      nama_pelajaran: row.nama_pelajaran || "",
      icon: null,
      id_jenjang: row.id_jenjang?.toString?.() || "",
    });
    setPreviewIcon(row.icon || "");
    setFileInputKey(Date.now());
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingData(null);
    setFormData({ nama_pelajaran: "", icon: null, id_jenjang: "" });
    setPreviewIcon("");
    setFileInputKey(Date.now());
  };

  const handleSave = async () => {
    if (!formData.nama_pelajaran || !formData.id_jenjang) {
      Swal.fire("Error", "Nama Pelajaran dan Jenjang wajib diisi!", "error");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("nama_pelajaran", formData.nama_pelajaran);
      fd.append("id_jenjang", formData.id_jenjang);
      if (formData.icon instanceof File) fd.append("icon", formData.icon);

      const url = editingData
        ? `${API_BASE}/api/pelajaran/${editingData.id_pelajaran}`
        : `${API_BASE}/api/pelajaran`;
      const method = editingData ? "PUT" : "POST";

      const res = await fetch(url, { method, body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Gagal menyimpan data");

      Swal.fire("Sukses", data.message, "success");
      closeModal();

      const refresh = await fetch(`${API_BASE}/api/pelajaran`);
      setPelajaran(await refresh.json());
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Yakin Hapus?",
      text: "Data tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (res) => {
      if (!res.isConfirmed) return;
      try {
        const r = await fetch(`${API_BASE}/api/pelajaran/${id}`, {
          method: "DELETE",
        });
        const data = await r.json();
        if (!r.ok) throw new Error(data?.message);
        Swal.fire("Terhapus!", data.message, "success");
        setPelajaran(pelajaran.filter((p) => p.id_pelajaran !== id));
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    });
  };

  const handleView = (jenjangId, pelajaranId) =>
    navigate(`/pelajaran/${jenjangId}/${pelajaranId}`);

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-[calc(100vh-80px)] text-xs sm:text-base">
      <div className="max-w-[1200px] mx-auto">
        {/* === HEADER === */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-0">
            Manajemen Pelajaran
          </h1>

          <div className="flex flex-col items-end w-full sm:w-auto gap-2">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Cari Pelajaran..."
                className="border p-2 rounded w-full pl-10 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
            </div>

            {/* Filter & Tambah */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
              <select
                className="border p-2 rounded text-sm w-full sm:w-44"
                value={selectedJenjang}
                onChange={(e) => setSelectedJenjang(Number(e.target.value))}
              >
                <option value={0}>Semua Jenjang</option>
                {jenjang.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.nama}
                  </option>
                ))}
              </select>

              <button
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium w-full sm:w-44"
                onClick={openAddModal}
              >
                + Tambah Pelajaran
              </button>
            </div>
          </div>
        </div>

        {/* === TABEL === */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-[950px] w-full border-collapse text-[11px] sm:text-sm md:text-base">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 sm:p-3 border border-gray-200 text-center whitespace-nowrap">No</th>
                  <th className="p-2 sm:p-3 border border-gray-200 text-left whitespace-nowrap">Nama Pelajaran</th>
                  <th className="p-2 sm:p-3 border border-gray-200 text-center whitespace-nowrap">Jenjang</th>
                  <th className="p-2 sm:p-3 border border-gray-200 text-center whitespace-nowrap">Bab</th>
                  <th className="p-2 sm:p-3 border border-gray-200 text-center whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {visiblePelajaran.length > 0 ? (
                  visiblePelajaran.map((p, i) => (
                    <tr key={p.id_pelajaran} className="hover:bg-gray-50">
                      <td className="p-2 sm:p-3 border border-gray-200 text-center">
                        {i + 1}
                      </td>
                      <td className="p-2 sm:p-3 border border-gray-200 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {p.icon ? (
                            <img
                              src={p.icon}
                              alt="ikon"
                              className="w-8 h-8 object-cover rounded"
                              onError={(e) =>
                                (e.currentTarget.style.display = "none")
                              }
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded grid place-items-center">
                              -
                            </div>
                          )}
                          <span className="font-medium">{p.nama_pelajaran}</span>
                        </div>
                      </td>
                      <td className="p-2 sm:p-3 border border-gray-200 text-center whitespace-nowrap">
                        {getJenjangName(p.id_jenjang)}
                      </td>
                      <td className="p-2 sm:p-3 border border-gray-200 text-center whitespace-nowrap">
                        {p.bab ? p.bab : "Belum Ada"}
                      </td>
                      <td className="p-2 sm:p-3 border border-gray-200 text-center whitespace-nowrap">
                        <div className="flex justify-center gap-2 flex-wrap">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs sm:text-sm"
                            onClick={() =>
                              handleView(p.id_jenjang, p.id_pelajaran)
                            }
                          >
                            <i className="fa-solid fa-eye"></i>
                          </button>
                          <button
                            className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-xs sm:text-sm"
                            onClick={() => openEditModal(p)}
                          >
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs sm:text-sm"
                            onClick={() => handleDelete(p.id_pelajaran)}
                          >
                            <i className="fa-solid fa-trash"></i>
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
                      Tidak ada data pelajaran.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* === MODAL === */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg w-[90vw] max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">
              {editingData ? "Edit Pelajaran" : "Tambah Pelajaran"}
            </h2>

            <div className="flex flex-col gap-2 text-sm">
              <label>Nama Pelajaran</label>
              <input
                type="text"
                name="nama_pelajaran"
                value={formData.nama_pelajaran}
                onChange={(e) =>
                  setFormData({ ...formData, nama_pelajaran: e.target.value })
                }
                className="border p-2 rounded"
              />

              <label>Icon (PNG)</label>
              {previewIcon && (
                <img
                  src={previewIcon}
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
                  if (
                    file.type !== "image/png" &&
                    !file.name.toLowerCase().endsWith(".png")
                  ) {
                    Swal.fire("Format salah", "Gunakan file PNG", "warning");
                    setFileInputKey(Date.now());
                    return;
                  }
                  setFormData({ ...formData, icon: file });
                  setPreviewIcon(URL.createObjectURL(file));
                }}
                className="border p-2 rounded"
              />

              <label>Jenjang</label>
              <select
                name="id_jenjang"
                value={formData.id_jenjang}
                onChange={(e) =>
                  setFormData({ ...formData, id_jenjang: e.target.value })
                }
                className="border p-2 rounded"
              >
                <option value="">Pilih Jenjang</option>
                {jenjang.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.nama}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                onClick={closeModal}
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
