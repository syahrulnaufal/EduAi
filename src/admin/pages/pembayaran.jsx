import React, { useState, useEffect } from "react";

const Pembelian = () => {
  const [pembelian, setPembelian] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id_pembelian: null,
    status_pembayaran: "",
  });

  useEffect(() => {
    getPembelian();
  }, []);

  const getPembelian = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/pembelian");
      const data = await res.json();
      setPembelian(data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal mengambil data pembelian", "error");
    }
  };

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
    } catch (err) {
      Swal.fire("Error", "Gagal update status", "error");
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pembelian</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2">
          <i className="fa-solid fa-filter"></i> Filter Periode
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center border rounded-md overflow-hidden w-full sm:w-80 mb-4">
        <i className="fa-solid fa-magnifying-glass text-gray-400 px-2 text-sm"></i>
        <input
          type="text"
          placeholder="Cari Pembelian..."
          className="px-2 py-2 outline-none w-full"
          onChange={(e) => {
            const val = e.target.value.toLowerCase();
            setPembelian((prev) =>
              prev.filter(
                (p) =>
                  p.username.toLowerCase().includes(val) ||
                  p.produk.toLowerCase().includes(val)
              )
            );
          }}
        />
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg shadow-sm text-sm">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">No Order</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">Username</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">Produk</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">Harga</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">Tanggal Order</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">Status Pembayaran</th>
              <th className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pembelian.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 text-center">
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{p.id_pembelian}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{p.username}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{p.produk}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{p.harga}</td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg">{p.tanggal_pembelian}</td>
                <td
                  className={`p-1 sm:p-3 border border-gray-300 text-center text-sm sm:text-lg font-semibold ${
                    p.status === "Lunas"
                      ? "text-green-600"
                      : p.status === "Pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {p.status_pembayaran}
                </td>
                <td className="p-1 sm:p-3 border border-gray-300 text-center">
                  <button
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                    onClick={() => openEditStatus(p)}
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Edit Status */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow w-96">
            <h2 className="text-lg font-bold mb-4">Edit Status Pembayaran</h2>
            <select
              className="border p-2 rounded w-full"
              value={formData.status_pembayaran}
              onChange={(e) =>
                setFormData({ ...formData, status_pembayaran: e.target.value })
              }
            >
              <option value="Lunas">Lunas</option>
              <option value="Pending">Pending</option>
              <option value="Gagal">Gagal</option>
            </select>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
};

export default Pembelian;
