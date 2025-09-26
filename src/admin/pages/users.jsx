import React, { useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([
    {
      id: 1,
      username: "dimas",
      email: "dimas@gmail.com",
      role: "admin",
      password: "password"
    },
    {
      id: 2,
      username: "suhel",
      email: "suhel@gmail.com",
      role: "user",
      password: "password"
    },
  ]);

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ username: '', email: '', role: '', password: '' });

  // Open modal and set data
  const handleEdit = (user) => {
    setEditId(user.id);
    setEditData({ username: user.username, email: user.email, role: user.role, password: user.password  }); 
  };

  // Close modal
  const closeModal = () => {
    setEditId(null);
  };

  // Handle form change
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Save changes (dummy, just close modal)
  const handleSave = (e) => {
    e.preventDefault();
    setUsers(users.map(u => u.id === editId ? { ...u, ...editData } : u));
    setEditId(null);
  };

  return (
    <div className="p-1 sm:p-6 bg-gray-50 min-h-[calc(100vh-80px)] text-xs sm:text-base">
      {/* Baris pertama: Judul + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 sm:mb-6 sm:gap-3 w-full">
        <h1 className="text-2xl font-bold text-gray-700">
          Manajemen Users
        </h1>
        {/* Search di kanan */}
        <div className="flex items-center border rounded-md overflow-hidden w-47 sm:w-82">
          <i className="fa-solid fa-magnifying-glass text-gray-400 px-2 text-sm"></i>
          <input
            type="text"
            placeholder="Cari Pengguna..."
            className="py-2 pl-2 pr-3 outline-none w-full bg-transparent text-sm"
          />
        </div>
      </div>
      {/* Baris kedua: Dropdown + Filter + Tambah di pojok kanan bawah search */}
      <div className="flex flex-row gap-2 mb-4 sm:mb-6 w-full sm:justify-end">
        <div className="relative w-1/2 sm:w-40">
          <select className="border rounded-md px-3 py-2 text-gray-700 w-full appearance-none">
            <option value="" disabled selected>Filter </option>
            <option>A - Z</option>
            <option>Z - A</option>
            <option>Terbaru</option>
            <option>Terlama</option>
            <option>Progres Terdepan</option>
            <option>Progres Tertinggal</option>
          </select>
          <i className="fa-solid fa-caret-down absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-sm"></i>
        </div>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 w-1/2 sm:w-40">
          + Tambah Users
        </button>
      </div>
      {/* Tabel Users dalam card ala Bootstrap, lebih responsif */}
      <div className="overflow-x-auto mb-6">
        <div className="bg-white rounded-lg shadow border border-gray-300 p-1 sm:p-4">
          <table className="table-auto w-full border-collapse text-[10px] sm:text-base min-w-0">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg sm:w-[80px]">NO</th>
                <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">Username</th>
                <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">Email</th>
                <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">role</th>
                <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg w-[40px] sm:w-[200px]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="p-1 sm:p-3 border border-gray-300 text-sm sm:text-lg text-center">{index + 1}</td>
                  <td className="p-1 sm:p-3 border border-gray-300 text-sm sm:text-lg">{user.username}</td>
                  <td className="p-1 sm:p-3 border border-gray-300 text-sm sm:text-lg">{user.email}</td>
                  <td className="p-1 sm:p-3 border border-gray-300 text-sm sm:text-lg">{user.role}</td>
                  <td className="p-1 sm:p-3 border border-gray-300">
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-blue-600 min-w-[60px] sm:min-w-[80px] inline-flex items-center justify-center gap-1"
                        onClick={() => handleEdit(user)}
                      >
                        <i className="fa-solid fa-user-pen"></i>
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-red-600 min-w-[60px] sm:min-w-[80px] inline-flex items-center justify-center gap-1"
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
      </div>
      {/* Modal Edit User */}
      {editId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-4 w-[90vw] max-w-xs sm:max-w-md relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl">&times;</button>
            <h2 className="text-lg font-semibold mb-4">Edit User</h2>
            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Username</span>
                <input name="username" value={editData.username} onChange={handleChange} className="border rounded px-2 py-1" required />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Email</span>
                <input name="email" value={editData.email} onChange={handleChange} className="border rounded px-2 py-1" required />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Role</span>
                <select name="role" value={editData.role} onChange={handleChange} className="border rounded px-2 py-1">
                  <option value="admin">admin</option>
                  <option value="user">user</option>
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Password</span>
                <input name="password" type="text" value={editData.password} onChange={handleChange} className="border rounded px-2 py-1" required />
              </label>
              <button type="submit" className="bg-blue-600 text-white rounded px-3 py-1 mt-2 hover:bg-blue-700">Simpan</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
