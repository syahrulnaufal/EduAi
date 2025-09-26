// control/pelajarancontrol.js
import db from '../db.js';

// GET semua pelajaran
// control/pelajarancontrol.js
export const getAllpelajaran = async (req, res) => {
  try {
    // ambil semua pelajaran
    const [pelajaran] = await db.query("SELECT * FROM pelajaran");

    // ambil semua bab
    const [bab] = await db.query("SELECT id_pelajaran FROM bab");

    // hitung jumlah bab per pelajaran
    const countBab = {};
    bab.forEach(b => {
      countBab[b.id_pelajaran] = (countBab[b.id_pelajaran] || 0) + 1;
    });

    // gabung
    const result = pelajaran.map(p => ({
      ...p,
      bab: countBab[p.id_pelajaran] || 0
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: err.message });
  }
};


// ADD pelajaran
export const addpelajaran = async (req, res) => {
  try {
    const { nama_pelajaran, id_jenjang } = req.body;
    if (!nama_pelajaran || !id_jenjang) {
      return res.status(400).json({ message: "nama_pelajaran dan id_jenjang wajib diisi" });
    }

    const iconPath = req.file ? `/img/${req.file.filename}` : ''; // simpan path /img/xxx.png
    // NOTE: kalau kolom icon NOT NULL, set default '/img/default.png' sesuai file default kamu

    const [result] = await db.query(
      "INSERT INTO pelajaran (nama_pelajaran, icon, id_jenjang) VALUES (?, ?, ?)",
      [nama_pelajaran, iconPath, Number(id_jenjang)]
    );

    res.json({ message: "Pelajaran ditambahkan", id: result.insertId });
  } catch (err) {
    console.error("DB ERROR:", err);

    // foreign key error → beri pesan jelas
    if (err.code === "ER_NO_REFERENCED_ROW_2" || err.errno === 1452) {
      return res.status(400).json({ message: "id_jenjang tidak ditemukan di tabel jenjang" });
    }
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: err.message });
  }
};

// UPDATE pelajaran
export const updatepelajaran = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_pelajaran, id_jenjang } = req.body;
    if (!nama_pelajaran || !id_jenjang) {
      return res.status(400).json({ message: "nama_pelajaran dan id_jenjang wajib diisi" });
    }

    const iconPath = req.file ? `/img/${req.file.filename}` : null;

    let query = "UPDATE pelajaran SET nama_pelajaran=?, id_jenjang=?";
    const params = [nama_pelajaran, Number(id_jenjang)];

    if (iconPath) {
      query += ", icon=?";
      params.push(iconPath);
    }
    query += " WHERE id_pelajaran=?";
    params.push(Number(id));

    await db.query(query, params);
    res.json({ message: "Pelajaran diupdate" });
  } catch (err) {
    console.error("DB ERROR:", err);
    if (err.code === "ER_NO_REFERENCED_ROW_2" || err.errno === 1452) {
      return res.status(400).json({ message: "id_jenjang tidak ditemukan di tabel jenjang" });
    }
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: err.message });
  }
};

// DELETE pelajaran
export const deletepelajaran = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM pelajaran WHERE id_pelajaran = ?', [Number(id)]);
    res.json({ message: 'pelajaran dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: err.message });
  }
};
