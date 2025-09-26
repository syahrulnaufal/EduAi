import db from "../db.js";

// ✅ Get semua guru
export const getAllGuru = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM guru");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: err.message });
  }
};

// ✅ Get guru by ID
export const getGuruById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM guru WHERE id_guru = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Guru tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: err.message });
  }
};

// ✅ Tambah guru
export const addGuru = async (req, res) => {
  try {
    const { nama_guru, bio_guru, pendidikan_terakhir } = req.body;
    if (!nama_guru || !bio_guru) {
      return res.status(400).json({ message: "Nama & Bio wajib diisi" });
    }
    const [result] = await db.query(
      "INSERT INTO guru (nama_guru, bio_guru, pendidikan_terakhir) VALUES (?, ?, ?)",
      [nama_guru, bio_guru, pendidikan_terakhir]
    );
    res.json({ message: "Guru berhasil ditambahkan", id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: err.message });
  }
};

// ✅ Update guru
export const updateGuru = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_guru, bio_guru, pendidikan_terakhir } = req.body;

    const [result] = await db.query(
      "UPDATE guru SET nama_guru = ?, bio_guru = ?, pendidikan_terakhir = ? WHERE id_guru = ?",
      [nama_guru, bio_guru, pendidikan_terakhir, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Guru tidak ditemukan" });
    res.json({ message: "Guru berhasil diupdate" });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: err.message });
  }
};

// ✅ Hapus guru
export const deleteGuru = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM guru WHERE id_guru = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Guru tidak ditemukan" });
    res.json({ message: "Guru berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: err.message });
  }
};
