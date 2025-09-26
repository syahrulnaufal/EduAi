import React, { useState, useEffect } from "react";

const Course = () => {
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
  target_course: "",   // ✅ tambahin
  points: [],
});


  // 🔹 Ambil data course & guru dari API
  useEffect(() => {
    getCourses();
    getGuru();
  }, []);

  const getCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/course");
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal mengambil data course", "error");
    }
  };

  const getGuru = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/guru");
      const data = await res.json();
      setGuruList(data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal mengambil data guru", "error");
    }
  };

  // 🔹 Tambah Course
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

  // 🔹 Edit Course
  const openEditModal = (c) => {
    setIsEdit(true);
    setFormData({
      ...c,
      points: c.point_pembelajaran || [], // ✅ ambil dari API
    });
    setShowModal(true);
  };

  // 🔹 Simpan Course
  const handleSaveCourse = async () => {
    if (!formData.nama_course || !formData.id_guru) {
      Swal.fire("Error", "Nama Course dan Guru wajib diisi!", "error");
      return;
    }

    try {
      if (isEdit) {
        await fetch(`http://localhost:5000/api/course/${formData.id_course}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        Swal.fire("Berhasil", "Course berhasil diperbarui!", "success");
      } else {
        await fetch("http://localhost:5000/api/course", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        Swal.fire("Berhasil", "Course berhasil ditambahkan!", "success");
      }
      getCourses();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal menyimpan data course", "error");
    }
  };

  // 🔹 Hapus Course
  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data course akan hilang permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`http://localhost:5000/api/course/${id}`, {
            method: "DELETE",
          });
          Swal.fire("Terhapus!", "Course berhasil dihapus.", "success");
          getCourses();
        } catch (err) {
          Swal.fire("Error", "Gagal menghapus course", "error");
        }
      }
    });
  };


  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-xl font-bold mb-4 sm:mb-0">Manajemen Course</h1>
      </div>

      {/* Search kiri, tambah kanan */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-2">
        <div className="flex items-center border rounded-md overflow-hidden w-full sm:w-80">
          <i className="fa-solid fa-magnifying-glass text-gray-400 px-2 text-sm"></i>
          <input
            type="text"
            placeholder="Cari Course..."
            className="px-2 py-2 outline-none w-full"
            onChange={(e) =>
              setCourses((prev) =>
                prev.filter((c) =>
                  c.nama_course
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
                )
              )
            }
          />
        </div>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full sm:w-[300px]"
          onClick={openAddModal}
        >
          + Tambah Course
        </button>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg shadow-sm text-sm">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg w-[15px] sm:w-[75px]">No</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg w-[100px] sm:w-[350px]">Nama Course</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg w-[75px] sm:w-[200px]">Guru</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg w-[15px] sm:w-[50px]">Jumlah Peserta</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg w-[20px] sm:w-[150px]">Harga</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg w-[30px] sm:w-[100px]">Durasi</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lgw-[75px] sm:w-[250px]">Point Pembelajaran</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lgw-[75px] sm:w-[300px]">Detail</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lgw-[75px] sm:w-[250px]">Target Course</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg w-[75px] sm:w-[100px]">Sertifikasi</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg w-[75px] sm:w-[100px]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c, index) => (
              <tr key={c.id} className="hover:bg-gray-50 text-center">
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{index + 1}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{c.nama_course}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{c.nama_guru}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{c.jumlah_peserta}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{c.harga}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{c.durasi}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">
                  <ul className="list-disc list-inside text-left">
                    {c.point_pembelajaran?.map((p, idx) => (
                      <li key={idx}>{p.isi_point}</li>
                    ))}
                  </ul>
                </td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{c.detail}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{c.target_course}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{c.sertifikasi}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">
                  <div className="flex flex-col sm:flex-row justify-center gap-2">
                    <button
                      className="bg-yellow-400 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-yellow-500 text-xs sm:text-base inline-flex items-center justify-center min-w-[40px] sm:min-w-[60px]"
                      onClick={() => openEditModal(c)}
                    >
                      <i className="fa-solid fa-pen"></i>
                      <span className="hidden sm:inline ml-2">Edit</span>
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-red-600 text-xs sm:text-base inline-flex items-center justify-center min-w-[40px] sm:min-w-[60px]"
                      onClick={() => handleDelete(c.id_course)}
                    >
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow w-96">
            <h2 className="text-lg font-bold mb-4">
              {isEdit ? "Edit Course" : "Tambah Course"}
            </h2>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Nama Course"
                className="border p-2 rounded"
                value={formData.nama_course}
                onChange={(e) =>
                  setFormData({ ...formData, nama_course: e.target.value })
                }
              />

              {/* 🔹 Dropdown Guru */}
              <select
                className="border p-2 rounded"
                value={formData.id_guru}
                onChange={(e) =>
                  setFormData({ ...formData, id_guru: e.target.value })
                }
              >
                <option value="">-- Pilih Guru --</option>
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
                  setFormData({ ...formData, jumlah_peserta: e.target.value })
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

              {/* 🔹 Point Pembelajaran */}
              <div>
                <label className="font-semibold text-sm block mb-1">
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
                    {(formData.points || []).map((p, idx) => (
                      <tr key={idx}>
                        <td className="p-2 border text-center">{idx + 1}</td>
                        <td className="p-2 border">
                          <input
                            type="text"
                            className="border p-1 rounded w-full"
                            value={p.isi_point || ""}   // ✅ fallback ke string kosong
                            onChange={(e) => {
                              const newPoints = [...formData.points];
                              newPoints[idx].isi_point = e.target.value;
                              setFormData({ ...formData, points: newPoints });
                            }}
                          />
                        </td>
                        <td className="p-2 border text-center">
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            onClick={() => {
                              const newPoints = formData.points.filter(
                                (_, i) => i !== idx
                              );
                              setFormData({ ...formData, points: newPoints });
                            }}
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
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      points: [...(formData.points || []), { isi_point: "" }], // ✅ hanya isi_point
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
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
};

export default Course;