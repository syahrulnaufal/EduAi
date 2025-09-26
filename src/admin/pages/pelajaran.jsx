import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// asumsi Swal sudah global. Kalau tidak, import: import Swal from "sweetalert2";

export default function Pelajaran() {
  const navigate = useNavigate();

  const [pelajaran, setPelajaran] = useState([]);
  const [selectedJenjang, setSelectedJenjang] = useState(0); // 0 = semua
  const [jenjang, setJenjang] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
  setSearchTerm(e.target.value.toLowerCase());
};


  // form state
  const [formData, setFormData] = useState({
    nama_pelajaran: "",
    icon: null,          // File | null
    id_jenjang: ""
  });
  const [previewIcon, setPreviewIcon] = useState(""); // string URL untuk preview
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // untuk reset input file

  const API_BASE = "http://localhost:5000";

  const getIconUrl = (icon) => {
    if (!icon) return "";
    if (typeof icon === "string" && icon.startsWith("http")) return icon;
    return `${API_BASE}/img/${icon}`;
  };

  const fetchJenjang = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/jenjang`);
      const data = await res.json();
      const formattedJenjang = data.map(j => ({
        id: j.id_jenjang,
        nama: j.nama_jenjang,
      }));
      setJenjang(formattedJenjang);
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "Gagal memuat data jenjang", "error");
    }
  };

  const fetchPelajaran = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/pelajaran`);
      const data = await res.json();
      setPelajaran(data);
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "Gagal memuat data pelajaran", "error");
    }
  };

  useEffect(() => {
    fetchJenjang();
    fetchPelajaran();
  }, []);

  const handleView = (jenjangId, pelajaranId) => {
    navigate(`/pelajaran/${jenjangId}/${pelajaranId}`);
  };

  // ---------- Modal Helpers ----------
  const openAddModal = () => {
    setEditingData(null);
    setFormData({ nama_pelajaran: "", icon: null, id_jenjang: "" });
    // Saat openEditModal
    setPreviewIcon("");
    setFileInputKey(Date.now());
    setShowModal(true);
  };

  const openEditModal = (row) => {
    setEditingData(row);
    setFormData({
      nama_pelajaran: row.nama_pelajaran || "",
      icon: null, // user boleh ganti; kalau tidak ganti, kirim tanpa field icon
      id_jenjang: row.id_jenjang?.toString?.() || ""
    });
    // Saat openEditModal
    setPreviewIcon(row.icon || "");
 // preview icon lama
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

  // Lock scroll saat modal terbuka + ESC to close
  useEffect(() => {
    if (!showModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [showModal]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIconChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFormData(prev => ({ ...prev, icon: null }));
      setPreviewIcon(editingData ? getIconUrl(editingData.icon) : "");
      return;
    }
    // Validasi PNG only
    const isPng = file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
    if (!isPng) {
      Swal.fire("Format salah", "Icon wajib PNG (.png)", "warning");
      // reset input file
      setFileInputKey(Date.now());
      return;
    }
    setFormData(prev => ({ ...prev, icon: file }));
    setPreviewIcon(URL.createObjectURL(file));
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

      // hanya kirim icon kalau user memilih file baru
      if (formData.icon instanceof File) {
        fd.append("icon", formData.icon);
      }

      const url = editingData
        ? `${API_BASE}/api/pelajaran/${editingData.id_pelajaran}`
        : `${API_BASE}/api/pelajaran`;

      const method = editingData ? "PUT" : "POST";

      const res = await fetch(url, { method, body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Gagal menyimpan data");

      Swal.fire("Sukses", data.message, "success");
      closeModal();
      await fetchPelajaran(); // refresh data tanpa reload halaman
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Gagal menyimpan data", "error");
    }
  };

  // ============ HAPUS ============
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Yakin Hapus?",
      text: "Data tidak bisa dikembalikan lagi!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        const res = await fetch(`${API_BASE}/api/pelajaran/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Gagal menghapus data");
        Swal.fire("Terhapus!", data.message, "success");
        await fetchPelajaran();
      } catch (err) {
        console.error(err);
        Swal.fire("Error", err.message || "Gagal menghapus data", "error");
      }
    });
  };

  const visiblePelajaran = pelajaran.filter((p) => {
  const cocokJenjang = selectedJenjang === 0 || Number(p.id_jenjang) === selectedJenjang;
  const cocokSearch = p.nama_pelajaran.toLowerCase().includes(searchTerm);
  return cocokJenjang && cocokSearch;
});


  const getJenjangName = (id) =>
    jenjang.find((j) => j.id === parseInt(id))?.nama || "-";

  return (
    <div className="p-1 sm:p-6 bg-gray-50 min-h-[calc(100vh-80px)] text-xs sm:text-base">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-lg sm:text-2xl font-bold ml-4 mb-4 sm:mb-0">Manajemen Pelajaran</h1>

        {/* Search + Dropdown */}
        <div className="flex flex-col items-end w-full sm:w-82">
          {/* Search (opsional) */}
          <div className="relative mb-2 w-full sm:w-82">
            <input
              type="text"
              placeholder="Cari Pelajaran..."
              className="border p-2 rounded w-full pl-10 text-sm"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <i className="fa-solid fa-magnifying-glass" />
            </span>
          </div>


          {/* Filters */}
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
            <select
              className="border p-2 rounded w-full sm:w-40 text-sm"
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
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 w-full sm:w-40 text-sm"
              onClick={openAddModal}
            >
              + Tambah Pelajaran
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">NO</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">Nama Pelajaran</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">Jenjang</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">Bab</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg w-[330px]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {visiblePelajaran.map((p, index) => (
              <tr key={p.id_pelajaran} className="hover:bg-gray-50">
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{index + 1}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-sm sm:text-lg">
                  <div className="flex items-center gap-2">
                    {p.icon ? (
                      <img
                        src={p.icon}
                        alt="ikon"
                        className="w-8 h-8 object-cover rounded"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />

                    ) : (
                      <div className="w-8 h-8 rounded bg-gray-200 grid place-items-center">-</div>
                    )}
                    <span>{p.nama_pelajaran}</span>
                  </div>
                </td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">
                  {getJenjangName(p.id_jenjang)}
                </td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">
                  {String(p.bab) === "0" || p.bab == null ? "Belum Ada" : p.bab}
                </td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      className="bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-blue-600 inline-flex items-center justify-center min-w-[50px] sm:min-w-[80px]"
                      onClick={() => handleView(p.id_jenjang, p.id_pelajaran)}
                    >
                      <i className="fa-solid fa-eye"></i>
                      <span className="hidden sm:inline ml-2">View</span>
                    </button>
                    <button
                      className="bg-yellow-400 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-yellow-500 inline-flex items-center justify-center min-w-[50px] sm:min-w-[80px]"
                      onClick={() => openEditModal(p)}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                      <span className="hidden sm:inline ml-2">Edit</span>
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-red-600 inline-flex items-center justify-center min-w-[50px] sm:min-w-[80px]"
                      onClick={() => handleDelete(p.id_pelajaran)}
                    >
                      <i className="fa-solid fa-trash"></i>
                      <span className="hidden sm:inline ml-2">Hapus</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {visiblePelajaran.length === 0 && (
              <tr>
                <td className="p-3 text-center text-gray-500" colSpan={6}>
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah/Edit */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={closeModal} // klik overlay = close
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white p-6 rounded-lg shadow w-96"
            onClick={(e) => e.stopPropagation()} // cegah close saat klik konten
          >
            <h2 className="text-lg font-bold mb-4">
              {editingData ? "Edit Pelajaran" : "Tambah Pelajaran"}
            </h2>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-500">Nama Pelajaran</label>
              <input
                type="text"
                name="nama_pelajaran"
                value={formData.nama_pelajaran}
                onChange={handleFormChange}
                placeholder="Nama Pelajaran"
                className="border p-2 rounded"
                autoFocus
              />

              <label className="text-xs text-gray-500">
                Icon (PNG) {previewIcon && <span className="text-gray-400">— akan ditimpa jika memilih baru</span>}
              </label>
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
                  name="icon"
                  accept="image/png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) { setFormData(prev => ({ ...prev, icon: null })); return; }
                    const ok = file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
                    if (!ok) {
                      Swal.fire("Format salah", "Icon wajib PNG (.png)", "warning");
                      setFileInputKey(Date.now()); // reset input
                      return;
                    }
                    setFormData(prev => ({ ...prev, icon: file }));
                  }}
                  className="border p-2 rounded"
                />


              <label className="text-xs text-gray-500">Jenjang</label>
              <select
                name="id_jenjang"
                value={formData.id_jenjang}
                onChange={handleFormChange}
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
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={closeModal}
              >
                Batal
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={handleSave}
              >
                Simpan
              </button>
            </div>

            <p className="text-[11px] text-gray-400 mt-3">
              * Hanya menerima file .png. Jika tidak memilih icon saat edit, icon lama tetap dipakai.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
