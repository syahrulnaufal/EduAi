import db from "../db.js";

// ✅ Ambil semua pembelian (join user + course/bab)
export const getAllPembelian = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id_pembelian,
        p.tanggal_pembelian,
        p.status_pembayaran,
        u.username,
        c.nama_course,
        b.judul_bab,
        c.harga AS harga_course,
        b.harga AS harga_bab
      FROM pembelian p
      JOIN users u ON p.id_user = u.id_user
      LEFT JOIN course c ON p.id_course = c.id_course
      LEFT JOIN bab b ON p.id_bab = b.id_bab
      ORDER BY p.id_pembelian DESC
    `);

    const result = rows.map(r => ({
      ...r,
      produk: r.nama_course || r.judul_bab || "-",
      harga: r.harga_course || r.harga_bab || 0,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error server", error: err.message });
  }
};

// ✅ Ambil pembelian by ID
export const getPembelianById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `
      SELECT 
        p.id_pembelian,
        p.tanggal_pembelian,
        p.status_pembayaran,
        u.username,
        c.nama_course,
        b.judul_bab,
        c.harga AS harga_course,
        b.harga AS harga_bab
      FROM pembelian p
      JOIN users u ON p.id_user = u.id_user
      LEFT JOIN course c ON p.id_course = c.id_course
      LEFT JOIN bab b ON p.id_bab = b.id_bab
      WHERE p.id_pembelian = ?
      `,
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Pembelian tidak ditemukan" });

    const r = rows[0];
    res.json({
      ...r,
      produk: r.nama_course || r.judul_bab || "-",
      harga: r.harga_course || r.harga_bab || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Error server", error: err.message });
  }
};

// ✅ Tambah pembelian
export const addPembelian = async (req, res) => {
  try {
    const { tanggal_pembelian, status_pembayaran, id_user, id_bab, id_course } =
      req.body;

    const [result] = await db.query(
      `INSERT INTO pembelian (tanggal_pembelian, status_pembayaran, id_user, id_bab, id_course) 
       VALUES (?, ?, ?, ?, ?)`,
      [tanggal_pembelian, status_pembayaran, id_user, id_bab, id_course]
    );

    res.json({ message: "Pembelian berhasil ditambahkan", id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Error server", error: err.message });
  }
};

// ✅ Update status pembayaran
export const updatePembelianStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status_pembayaran } = req.body;

    const [result] = await db.query(
      "UPDATE pembelian SET status_pembayaran=? WHERE id_pembelian=?",
      [status_pembayaran, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Pembelian tidak ditemukan" });

    res.json({ message: "Status pembayaran berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ message: "Error server", error: err.message });
  }
};

// ✅ Hapus pembelian
export const deletePembelian = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM pembelian WHERE id_pembelian=?",
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Pembelian tidak ditemukan" });

    res.json({ message: "Pembelian berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Error server", error: err.message });
  }
};
