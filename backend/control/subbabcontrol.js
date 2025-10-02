import db from "../db.js";

// Ambil subbab berdasarkan id_bab
export const getSubbabByBab = async (req, res) => {
  try {
    const { id_bab } = req.query;

    if (!id_bab) {
      return res.status(400).json({ message: "id_bab wajib diisi" });
    }

    // ✅ Ambil bab
    const [babRow] = await db.execute("SELECT * FROM bab WHERE id_bab = ?", [id_bab]);
    if (babRow.length === 0) {
      return res.status(404).json({ message: "Bab tidak ditemukan" });
    }

    // ✅ Ambil subbab
    const [subbabRows] = await db.execute("SELECT * FROM subbab WHERE id_bab = ?", [id_bab]);

    // ✅ Ambil quiz berdasarkan id_bab
    const [quizRows] = await db.execute(
      "SELECT id_quiz, nama_quiz, rating FROM quiz WHERE id_bab = ?",
      [id_bab]
    );

    res.json({
      bab: babRow[0],
      subbab: subbabRows,
      quiz: quizRows, // akan berisi array quiz dengan id_quiz, nama_quiz, rating
    });
  } catch (err) {
    console.error("DB ERROR getSubbabByBab:", err);
    res.status(500).json({ error: err.message });
  }
};


// Tambah SubBab
export const createSubbab = async (req, res) => {
  try {
    const { id_bab, judul_subbab, video_materi, urutan } = req.body;

    if (!id_bab || !judul_subbab) {
      return res.status(400).json({ message: "id_bab & judul_subbab wajib diisi" });
    }

    const [result] = await db.execute(
      "INSERT INTO subbab (id_bab, judul_subbab, video_materi, urutan) VALUES (?, ?, ?, ?)",
      [id_bab, judul_subbab, video_materi || "", urutan ?? null]
    );

    res.status(201).json({
      message: "Subbab berhasil ditambahkan",
      id_subbab: result.insertId,
    });
  } catch (err) {
    console.error("DB ERROR createSubbab:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update SubBab
export const updateSubbab = async (req, res) => {
  try {
    const { id_subbab } = req.params;
    const { judul_subbab = "", video_materi = "", urutan = null, id_bab } = req.body || {};

    if (!judul_subbab) {
      return res.status(400).json({ message: "Judul SubBab wajib diisi" });
    }

    let query = `
      UPDATE subbab 
      SET judul_subbab = ?, 
          video_materi = ?, 
          urutan = ?`;
    const params = [judul_subbab, video_materi, urutan];

    if (id_bab) {
      query += `, id_bab = ?`;
      params.push(id_bab);
    }

    query += ` WHERE id_subbab = ?`;
    params.push(id_subbab);

    await db.query(query, params);
    res.json({ message: "SubBab berhasil diupdate" });
  } catch (err) {
    console.error("DB ERROR updateSubbab:", err);
    res.status(500).json({ message: "Gagal mengupdate SubBab", error: err.message });
  }
};

// Hapus SubBab
export const deleteSubbab = async (req, res) => {
  try {
    const { id_subbab } = req.params;
    if (!id_subbab) {
      return res.status(400).json({ message: "id_subbab wajib diisi" });
    }

    const [result] = await db.execute("DELETE FROM subbab WHERE id_subbab = ?", [id_subbab]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "SubBab tidak ditemukan" });
    }

    res.json({ message: "SubBab berhasil dihapus" });
  } catch (err) {
    console.error("DB ERROR deleteSubbab:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get SubBab untuk admin (join lengkap)
export const getSubbabAdmin = async (req, res) => {
  try {
    const { id_bab } = req.params;

    const [rows] = await db.query(
      `SELECT 
        s.*,
        b.judul_bab,
        p.nama_pelajaran,
        j.nama_jenjang
       FROM subbab s
       JOIN bab b ON s.id_bab = b.id_bab
       JOIN pelajaran p ON b.id_pelajaran = p.id_pelajaran
       JOIN jenjang j ON p.id_jenjang = j.id_jenjang
       WHERE s.id_bab = ?`,
      [id_bab]
    );

    res.json(rows);
  } catch (err) {
    console.error("DB ERROR getSubbabAdmin:", err);
    res.status(500).json({ message: "Gagal ambil data subbab", error: err.message });
  }
};

export default {
  getSubbabByBab,
  createSubbab,
  updateSubbab,
  deleteSubbab,
  getSubbabAdmin,
};
