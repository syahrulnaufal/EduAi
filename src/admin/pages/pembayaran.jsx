import React, { useState, useEffect } from "react";

export default function Pembelian() {
  const [pembelian, setPembelian] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id_pembelian: null,
    status_pembayaran: "",
  });

  // === Fetch data pembelian ===
  const getPembelian = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/pembelian");
      const data = await res.json();
      setPembelian(Array.isArray(data) ? data : []);
      setFiltered(Array.isArray(data) ? data : []);
    } catch {
      Swal.fire("Error", "Gagal mengambil data pembelian", "error");
    }
  };

  useEffect(() => {
    getPembelian();
  }, []);

  // === Search tanpa hapus data asli ===
  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    if (!val) return setFiltered(pembelian);
    const result = pembelian.filter(
      (p) =>
        p.username?.toLowerCase().includes(val) ||
        p.produk?.toLowerCase().includes(val)
    );
    setFiltered(result);
  };

  // === Edit Status ===
  const openEditStatus = (p) => {
    setFormData({
      id_pembelian: p.id_pembelian,
      status_pembayaran: p.status_pembayaran,
    });
    setShowModal(true);
  };

  const handleSaveStatus = async () => {
    try {
      await fetch(
        `http://localhost:5000/api/pembelian/${formData.id_pembelian}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status_pembayaran: formData.status_pembayaran }),
        }
      );
      Swal.fire("Berhasil!", "Status pembayaran diperbarui.", "success");
      getPembelian();
      setShowModal(false);
    } catch {
      Swal.fire("Error", "Gagal memperbarui status", "error");
    }
  };

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-[calc(100vh-80px)] text-xs sm:text-base w-full overflow-x-hidden">
      <div className="w-full overflow-hidden px-2 sm:px-6">
        {/* === Header === */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
            Manajemen Pembelian
          </h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm sm:text-base">
            <i className="fa-solid fa-filter"></i>
            Filter Periode
          </button>
        </div>

        {/* === Search === */}
        <div className="flex items-center border rounded-md overflow-hidden w-full sm:w-80 mb-6">
          <i className="fa-solid fa-magnifying-glass text-gray-400 px-2"></i>
          <input
            type="text"
            placeholder="Cari Pembelian..."
            className="px-2 py-2 outline-none w-full text-sm"
            onChange={handleSearch}
          />
        </div>

        {/* === Tabel === */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
          <table className="min-w-full border-collapse text-[11px] sm:text-sm md:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 sm:p-3 border border-gray-300 text-center w-[8%]">No</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">Username</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">Produk</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">Harga</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">Tanggal Order</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center">Status Pembayaran</th>
                <th className="p-2 sm:p-3 border border-gray-300 text-center w-[10%]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((p, i) => (
                  <tr key={p.id_pembelian} className="hover:bg-gray-50 text-center">
                    <td className="p-2 sm:p-3 border border-gray-300">{i + 1}</td>
                    <td className="p-2 sm:p-3 border border-gray-300">{p.username}</td>
                    <td className="p-2 sm:p-3 border border-gray-300">{p.produk}</td>
                    <td className="p-2 sm:p-3 border border-gray-300">
                      Rp{p.harga?.toLocaleString("id-ID")}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300">
                      {p.tanggal_pembelian}
                    </td>
                    <td
                      className={`p-2 sm:p-3 border border-gray-300 font-semibold ${
                        p.status_pembayaran === "Lunas"
                          ? "text-green-600"
                          : p.status_pembayaran === "Pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {p.status_pembayaran}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300">
                      <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm flex items-center gap-1 mx-auto"
                        onClick={() => openEditStatus(p)}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-4 text-gray-500 italic"
                  >
                    Tidak ada data pembelian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* === Modal Edit Status === */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow w-[90vw] max-w-md">
            <h2 className="text-lg font-bold mb-4">Edit Status Pembayaran</h2>
            <select
              className="border p-2 rounded w-full"
              value={formData.status_pembayaran}
              onChange={(e) =>
                setFormData({ ...formData, status_pembayaran: e.target.value })
              }
            >
              <option value="">-- Pilih Status --</option>
              <option value="Lunas">Lunas</option>
              <option value="Pending">Pending</option>
              <option value="Gagal">Gagal</option>
            </select>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={handleSaveStatus}
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
