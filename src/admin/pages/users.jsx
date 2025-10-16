import React, { useState, useEffect } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // hasil filter
  const [filterRole, setFilterRole] = useState("all"); // semua, admin, user

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    username: "",
    email: "",
    role: "",
    password: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // setiap kali filter berubah, apply filter ulang
    if (filterRole === "all") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter((u) => u.role === filterRole));
    }
    setCurrentPage(1); // reset halaman ke 1 setelah filter
  }, [filterRole, users]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleEdit = (user) => {
    setEditId(user.id_user);
    setEditData({
      username: user.username,
      email: user.email,
      role: user.role,
      password: "",
    });
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/users/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "User berhasil diupdate",
          timer: 1500,
          showConfirmButton: false,
        });
        setEditId(null);
        fetchUsers();
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Terjadi kesalahan saat update user",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
      });
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Yakin?",
      text: "Data user akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:5000/api/users/${id}`, {
            method: "DELETE",
          });
          if (res.ok) {
            Swal.fire("Terhapus!", "User berhasil dihapus", "success");
            fetchUsers();
          } else {
            Swal.fire("Gagal!", "Tidak bisa menghapus user", "error");
          }
        } catch (err) {
          Swal.fire("Error!", err.message, "error");
        }
      }
    });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="p-1 sm:p-6 bg-gray-50 min-h-[calc(100vh-80px)] text-xs sm:text-base">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Users</h1>
        <div className="flex items-center border rounded-md overflow-hidden w-full sm:w-80 bg-white">
          <i className="fa-solid fa-magnifying-glass text-gray-400 px-2 text-sm"></i>
          <input
            type="text"
            placeholder="Cari Pengguna..."
            className="py-2 pl-2 pr-3 outline-none w-full text-sm bg-transparent"
          />
        </div>
      </div>

      {/* Filter & Add */}
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-end mb-4 sm:mb-6">
        {/* Filter Role */}
        <div className="relative w-full sm:w-48">
          <select
            className="border rounded-md px-3 py-2 text-gray-700 w-full appearance-none bg-white"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <i className="fa-solid fa-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none"></i>
        </div>

        <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition w-full sm:w-40">
          + Tambah User
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="w-full border-collapse text-[11px] sm:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 sm:p-3 border border-gray-200 text-center">No</th>
              <th className="p-2 sm:p-3 border border-gray-200">Username</th>
              <th className="p-2 sm:p-3 border border-gray-200">Email</th>
              <th className="p-2 sm:p-3 border border-gray-200 text-center">Role</th>
              <th className="p-2 sm:p-3 border border-gray-200 text-center w-28 sm:w-48">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user.id_user} className="hover:bg-gray-50">
                <td className="p-2 sm:p-3 border border-gray-200 text-center">
                  {indexOfFirstItem + index + 1}
                </td>
                <td className="p-2 sm:p-3 border border-gray-200">{user.username}</td>
                <td className="p-2 sm:p-3 border border-gray-200">{user.email}</td>
                <td className="p-2 sm:p-3 border border-gray-200 text-center">{user.role}</td>
                <td className="p-2 sm:p-3 border border-gray-200 text-center">
                  <div className="flex justify-center gap-2 flex-wrap sm:flex-nowrap">
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-blue-500 text-white px-2 py-1 sm:px-3 sm:py-2 rounded hover:bg-blue-600 transition inline-flex items-center gap-1 text-xs sm:text-sm"
                    >
                      <i className="fa-solid fa-pen"></i>
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(user.id_user)}
                      className="bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-2 rounded hover:bg-red-600 transition inline-flex items-center gap-1 text-xs sm:text-sm"
                    >
                      <i className="fa-solid fa-trash"></i>
                      <span className="hidden sm:inline">Hapus</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-gray-500 py-4 italic text-sm"
                >
                  Tidak ada data {filterRole === "all" ? "user" : filterRole}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination di tengah bawah tabel */}
        {filteredUsers.length > 0 && (
          <div className="flex justify-center items-center py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`px-4 py-2 mx-2 rounded-md ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700 mx-2 text-sm sm:text-base">
              Halaman {currentPage} dari {totalPages || 1}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 mx-2 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal Edit */}
      {editId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg p-5 w-[90vw] max-w-xs sm:max-w-md relative">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Edit User</h3>
            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <input
                name="username"
                value={editData.username}
                onChange={handleChange}
                placeholder="Username"
                className="border px-3 py-2 rounded-md text-sm"
                required
              />
              <input
                name="email"
                value={editData.email}
                onChange={handleChange}
                placeholder="Email"
                className="border px-3 py-2 rounded-md text-sm"
                required
              />
              <select
                name="role"
                value={editData.role}
                onChange={handleChange}
                className="border px-3 py-2 rounded-md text-sm"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <input
                name="password"
                type="text"
                value={editData.password}
                onChange={handleChange}
                placeholder="Password (kosong = tidak ganti)"
                className="border px-3 py-2 rounded-md text-sm"
              />
              <div className="flex gap-2 justify-end mt-3">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setEditId(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
