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
  const [formData, setFormData] = useState({
    id_bab: null,
    judul_bab: "",
    point_xp: 0,
    detail: "",
    harga: 0,
    icon: "",
    id_pelajaran: pelajaranId,
  });

  // Ambil semua pelajaran untuk dropdown
  useEffect(() => {
    fetch("http://localhost:5000/api/pelajaran")
      .then((res) => res.json())
      .then((data) => {
        setPelajaranList(data);
      })
      .catch(console.error);
  }, []);

  // Fetch data bab sesuai pelajaranId
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
        }
      })
      .catch(console.error);
  }, [selectedPelajaran]);

  // Tambahkan state untuk preview icon
const [previewIcon, setPreviewIcon] = useState(null);
const [fileInputKey, setFileInputKey] = useState(Date.now());

// --- openAddModal & openEditModal disesuaikan ---
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
  setPreviewIcon(b.icon); // kalau edit, tampilkan icon lama
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
        body.append("judul_bab", formData.judul_bab);
        body.append("point_xp", formData.point_xp);
        body.append("detail", formData.detail);
        body.append("harga", formData.harga);
        body.append("id_pelajaran", formData.id_pelajaran);

        if (formData.icon instanceof File) {
          body.append("icon", formData.icon);
        }


      const res = await fetch(url, { method, body });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      Swal.fire("Sukses", data.message, "success");
      setShowModal(false);

      // Refresh data
      fetch(`http://localhost:5000/api/bab/pelajaran/${selectedPelajaran}`)
        .then((res) => res.json())
        .then((data) => setBab(data));
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
        } catch (err) {
          Swal.fire("Error", "Gagal menghapus data", "error");
        }
      }
    });
  };
  const [searchTerm, setSearchTerm] = useState("");

// handle change
const handleSearchChange = (e) => {
  setSearchTerm(e.target.value.toLowerCase());
};

// filter bab
const filteredBab = bab.filter((b) =>
  b.judul_bab.toLowerCase().includes(searchTerm)
);


  return (
    <div className="p-1 sm:p-6 bg-gray-50 min-h-[calc(100vh-80px)] text-xs sm:text-base">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-xl font-bold mb-4 sm:mb-0">
          {pelajaranInfo && (
            <nav className="flex items-center gap-2 text-lg sm:text-2xl font-bold text-black whitespace-nowrap">
              <span>{pelajaranInfo.nama_jenjang}</span>
              <span>/</span>
              <button
                className="hover:underline focus:outline-none"
                onClick={() => (window.location.href = "/admin.html#/pelajaran")}
              >
                {pelajaranInfo.nama_pelajaran}
              </button>
            </nav>
          )}
        </h1>
        <div className="flex flex-col items-end w-full sm:w-auto">
          {/* Search Input with Icon */}
          <div className="relative mb-2 w-full w-47 sm:w-82">
            <input
              type="text"
              placeholder="Cari bab..."
              className="border p-2 rounded w-full pl-10"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
          </div>

          {/* Dropdown Selects (stack) */}
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
            <select
            className="border p-2 rounded w-47 sm:w-40"
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
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 w-full sm:w-40 text-sm"
              onClick={openAddModal}
            >
              + Tambah Bab
            </button>
          </div>
        </div>
      </div>
       
      {/* Tabel Bab */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">NO</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">Nama Bab</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg w-[75px] sm:w-[600px]">Deskripsi</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">SubBab</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">Soal</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">XP</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg w-[75px] sm:w-[440px]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {bab.map((b, i) => (
              <tr key={b.id_bab} className="hover:bg-gray-50">
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{i + 1}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">
                  <div className="flex items-center gap-2">
                    {b.icon ? (
                      <img
                        src={b.icon}
                        alt="ikon"
                        className="w-8 h-8 object-cover rounded"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />

                    ) : (
                      <div className="w-8 h-8 rounded bg-gray-200 grid place-items-center">-</div>
                    )}
                    <span>{b.judul_bab}</span>
                  </div>
                  </td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">
                  {b.detail}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">
                  {b.total_subbab}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">
                  {b.total_quiz}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">
                  {b.point_xp}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 justify-center">
                    <button
                      className="bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-blue-600 inline-flex items-center justify-center text-xs sm:text-sm min-w-[60px] sm:min-w-[100px]"
                      onClick={() => navigate(`/pelajaran/${jenjangId}/${selectedPelajaran}/${b.id_bab}`)}
                    >
                      <i className="fa-solid fa-layer-group"></i>
                      <span className="ml-2">SubBab</span>
                    </button>
                    <button className="bg-blue-400 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-blue-500 inline-flex items-center justify-center text-xs sm:text-sm min-w-[60px] sm:min-w-[100px]"
                      onClick={() => navigate(`/quiz/${selectedPelajaran}/${b.id_bab}`)}
                    >
                      <i className="fa-solid fa-list-check"></i>
                      <span className="ml-2">Soal</span>
                    </button>
                    <button
                      className="bg-yellow-400 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-yellow-500 inline-flex items-center justify-center text-xs sm:text-sm min-w-[60px] sm:min-w-[100px]"
                      onClick={() => openEditModal(b)}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                      <span className="ml-2">Edit</span>
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-red-600 inline-flex items-center justify-center text-xs sm:text-sm min-w-[60px] sm:min-w-[100px]"
                      onClick={() => handleDelete(b.id_bab)}
                    >
                      <i className="fa-solid fa-trash"></i>
                      <span className="ml-2">Hapus</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       {/* Modal */}
      {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white p-6 rounded-lg w-[600px]">
      <h2 className="text-lg font-bold mb-4">
        {isEdit ? "Edit Bab" : "Tambah Bab"}
      </h2>
      <div className="flex flex-col gap-2">
        {/* Judul Bab */}
        <label>Judul Bab</label>
        <input
          type="text"
          value={formData.judul_bab}
          onChange={(e) =>
            setFormData({ ...formData, judul_bab: e.target.value })
          }
          className="border p-2 rounded"
        />

        {/* XP */}
        <label>Point XP</label>
        <input
          type="number"
          value={formData.point_xp}
          onChange={(e) =>
            setFormData({ ...formData, point_xp: e.target.value })
          }
          className="border p-2 rounded"
        />

        {/* Detail */}
        <label>Detail</label>
        <textarea
          value={formData.detail}
          onChange={(e) =>
            setFormData({ ...formData, detail: e.target.value })
          }
          className="border p-2 rounded"
        />

        {/* Harga */}
        <label>Harga</label>
        <input
          type="number"
          value={formData.harga}
          onChange={(e) =>
            setFormData({ ...formData, harga: e.target.value })
          }
          className="border p-2 rounded"
        />

        {/* Icon dengan Preview */}
        <label>Icon (PNG)</label>
        {previewIcon && (
          <img
            src={
              formData.icon instanceof File
                ? URL.createObjectURL(formData.icon) // preview file baru
                : previewIcon // icon lama dari DB
            }
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
            if (!file) {
              setFormData((prev) => ({ ...prev, icon: null }));
              setPreviewIcon(null);
              return;
            }
            const ok =
              file.type === "image/png" ||
              file.name.toLowerCase().endsWith(".png");
            if (!ok) {
              Swal.fire("Format salah", "Icon wajib PNG (.png)", "warning");
              setFileInputKey(Date.now()); // reset input
              return;
            }
            setFormData((prev) => ({ ...prev, icon: file }));
            setPreviewIcon(URL.createObjectURL(file));
          }}
          className="border p-2 rounded"
        />

        {/* Pilih Pelajaran */}
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

      {/* Tombol */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          className="bg-gray-300 px-4 py-2 rounded"
          onClick={() => setShowModal(false)}
        >
          Batal
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
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