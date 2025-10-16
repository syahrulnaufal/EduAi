import React, { useState, useEffect } from "react";

export default function Course() {
  const [courses, setCourses] = useState([]);
  const [guruList, setGuruList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [formData, setFormData] = useState({
    id_course: null,
    nama_course: "",
    id_guru: "",
    jumlah_peserta: "",
    harga: "",
    durasi: "",
    detail: "",
    sertifikasi: "",
    target_course: "",
    points: [],
  });

  // === Fetch Data ===
  useEffect(() => {
    getCourses();
    getGuru();
  }, []);

  const getCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/course");
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch {
      Swal.fire("Error", "Gagal mengambil data course", "error");
    }
  };

  const getGuru = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/guru");
      const data = await res.json();
      setGuruList(Array.isArray(data) ? data : []);
    } catch {
      Swal.fire("Error", "Gagal mengambil data guru", "error");
    }
  };

  // === Modal Handlers ===
  const openAddModal = () => {
    setIsEdit(false);
    setFormData({
      id_course: null,
      nama_course: "",
      id_guru: "",
      jumlah_peserta: "",
      harga: "",
      durasi: "",
      detail: "",
      sertifikasi: "",
      target_course: "",
      points: [],
    });
    setShowModal(true);
  };

  const openEditModal = (c) => {
    setIsEdit(true);
    setFormData({
      ...c,
      points: c.point_pembelajaran || [],
    });
    setShowModal(true);
  };

  // === Simpan Course ===
  const handleSaveCourse = async () => {
    if (!formData.nama_course || !formData.id_guru) {
      Swal.fire("Error", "Nama Course dan Guru wajib diisi!", "error");
      return;
    }

    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `http://localhost:5000/api/course/${formData.id_course}`
        : "http://localhost:5000/api/course";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Swal.fire("Sukses", data.message || "Data course disimpan!", "success");
      setShowModal(false);
      getCourses();
    } catch {
      Swal.fire("Error", "Gagal menyimpan data course", "error");
    }
  };

  // === Hapus Course ===
  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Course?",
      text: "Data ini tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (res) => {
      if (!res.isConfirmed) return;
      try {
        await fetch(`http://localhost:5000/api/course/${id}`, {
          method: "DELETE",
        });
        Swal.fire("Terhapus!", "Course berhasil dihapus.", "success");
        getCourses();
      } catch {
        Swal.fire("Error", "Gagal menghapus course", "error");
      }
    });
  };

  // === Filter Search ===
  const [search, setSearch] = useState("");
  const filteredCourses = courses.filter((c) =>
    c.nama_course?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-2 sm:p-6 bg-gray-50 min-h-[calc(100vh-80px)] text-xs sm:text-base overflow-hidden">
      <div className="max-w-[95%] lg:max-w-[85%] mx-auto">
        {/* === Header === */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
            Manajemen Course
          </h1>
        </div>

        {/* === Search + Tambah === */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-6">
          <div className="flex items-center border rounded-md overflow-hidden w-full sm:w-80">
            <i className="fa-solid fa-magnifying-glass text-gray-400 px-2"></i>
            <input
              type="text"
              placeholder="Cari Course..."
              className="px-2 py-2 outline-none w-full text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full sm:w-[210px]"
            onClick={openAddModal}
          >
            + Tambah Course
          </button>
        </div>

        {/* === Tabel === */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
          <table className="min-w-full border-collapse text-[11px] sm:text-sm md:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">
                  No
                </th>
                <th className="p-2 sm:p-3 border border-gray-300 text-left">
                  Nama Course
                </th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">
                  Guru
                </th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">
                  Peserta
                </th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">
                  Harga
                </th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">
                  Durasi
                </th>
                <th className="p-2 sm:p-3 border border-gray-300 text-left">
                  Point Pembelajaran
                </th>
                <th className="p-2 sm:p-3 border border-gray-300 text-left">
                  Detail
                </th>
                <th className="p-2 sm:p-3 border border-gray-300 text-left">
                  Target
                </th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">
                  Sertifikasi
                </th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((c, i) => (
                  <tr key={c.id_course} className="hover:bg-gray-50 align-top">
                    <td className="p-2 sm:p-3 border border-gray-300 text-center">
                      {i + 1}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300 break-words">
                      {c.nama_course}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300 text-center">
                      {c.nama_guru}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300 text-center">
                      {c.jumlah_peserta || "-"}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300 text-center">
                      Rp{c.harga || 0}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300 text-center">
                      {c.durasi}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300">
                      <ul className="list-disc list-inside text-left">
                        {c.point_pembelajaran?.map((p, idx) => (
                          <li key={idx}>{p.isi_point}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300 break-words">
                      {c.detail}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300 break-words">
                      {c.target_course}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300 text-center">
                      {c.sertifikasi}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300 text-center">
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm flex items-center gap-1"
                          onClick={() => openEditModal(c)}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm flex items-center gap-1"
                          onClick={() => handleDelete(c.id_course)}
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
                  <td
                    colSpan="11"
                    className="text-center py-4 text-gray-500 italic"
                  >
                    Tidak ada course.
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
          <div className="bg-white p-6 rounded-lg shadow w-[90vw] max-w-lg">
            <h2 className="text-lg font-bold mb-4">
              {isEdit ? "Edit Course" : "Tambah Course"}
            </h2>

            <div className="flex flex-col gap-2 text-sm">
              <input
                type="text"
                placeholder="Nama Course"
                className="border p-2 rounded"
                value={formData.nama_course}
                onChange={(e) =>
                  setFormData({ ...formData, nama_course: e.target.value })
                }
              />

              <select
                className="border p-2 rounded"
                value={formData.id_guru}
                onChange={(e) =>
                  setFormData({ ...formData, id_guru: e.target.value })
                }
              >
                <option value="">Pilih Guru</option>
                {guruList.map((g) => (
                  <option key={g.id_guru} value={g.id_guru}>
                    {g.nama_guru}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Jumlah Peserta"
                className="border p-2 rounded"
                value={formData.jumlah_peserta}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    jumlah_peserta: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Harga"
                className="border p-2 rounded"
                value={formData.harga}
                onChange={(e) =>
                  setFormData({ ...formData, harga: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Durasi"
                className="border p-2 rounded"
                value={formData.durasi}
                onChange={(e) =>
                  setFormData({ ...formData, durasi: e.target.value })
                }
              />

              {/* === Point Pembelajaran === */}
              <div>
                <label className="font-semibold text-sm mb-1 block">
                  Point Pembelajaran
                </label>
                <table className="w-full border border-gray-300 text-sm mb-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">No</th>
                      <th className="p-2 border">Deskripsi</th>
                      <th className="p-2 border">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.points.map((p, idx) => (
                      <tr key={idx}>
                        <td className="p-2 border text-center">{idx + 1}</td>
                        <td className="p-2 border">
                          <input
                            type="text"
                            className="border p-1 rounded w-full"
                            value={p.isi_point || ""}
                            onChange={(e) => {
                              const newPoints = [...formData.points];
                              newPoints[idx].isi_point = e.target.value;
                              setFormData({ ...formData, points: newPoints });
                            }}
                          />
                        </td>
                        <td className="p-2 border text-center">
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                points: formData.points.filter(
                                  (_, i) => i !== idx
                                ),
                              })
                            }
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      points: [...formData.points, { isi_point: "" }],
                    })
                  }
                >
                  + Tambah Point
                </button>
              </div>

              <input
                type="text"
                placeholder="Target Course"
                className="border p-2 rounded"
                value={formData.target_course}
                onChange={(e) =>
                  setFormData({ ...formData, target_course: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Detail"
                className="border p-2 rounded"
                value={formData.detail}
                onChange={(e) =>
                  setFormData({ ...formData, detail: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Sertifikasi"
                className="border p-2 rounded"
                value={formData.sertifikasi}
                onChange={(e) =>
                  setFormData({ ...formData, sertifikasi: e.target.value })
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
                onClick={handleSaveCourse}
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
