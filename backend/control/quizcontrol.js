import db from "../db.js";

// ===== Ambil semua quiz untuk 1 bab =====
export const getQuizByBab = async (req, res) => {
  try {
    const { babId } = req.params;

    const [rows] = await db.query(
      `SELECT q.*, 
              b.judul_bab, 
              p.nama_pelajaran, 
              j.nama_jenjang,
              (SELECT COUNT(*) FROM soal s WHERE s.id_quiz = q.id_quiz) AS jumlah_soal
       FROM quiz q
       JOIN bab b ON q.id_bab = b.id_bab
       JOIN pelajaran p ON b.id_pelajaran = p.id_pelajaran
       JOIN jenjang j ON p.id_jenjang = j.id_jenjang
       WHERE q.id_bab = ?`,
      [babId]
    );

    res.json(rows);
  } catch (err) {
    console.error("DB ERROR getQuizByBab:", err);
    res.status(500).json({ message: "Gagal ambil quiz", error: err.message });
  }
};

// ===== Tambah quiz =====
export const createQuiz = async (req, res) => {
  try {
    const { nama_quiz, rating, id_bab } = req.body;
    if (!nama_quiz || !id_bab) {
      return res.status(400).json({ message: "Nama Quiz & id_bab wajib diisi" });
    }

    const [result] = await db.query(
      "INSERT INTO quiz (nama_quiz, rating, id_bab) VALUES (?, ?, ?)",
      [nama_quiz, rating || 0, id_bab]
    );

    res.json({ message: "Quiz berhasil ditambahkan", id: result.insertId });
  } catch (err) {
    console.error("DB ERROR createQuiz:", err);
    res.status(500).json({ message: "Gagal menambah quiz", error: err.message });
  }
};

// ===== Update quiz =====
export const updateQuiz = async (req, res) => {
  try {
    const { id_quiz } = req.params;
    const { nama_quiz, rating, id_bab } = req.body;

    if (!nama_quiz || !id_bab) {
      return res.status(400).json({ message: "Nama Quiz & id_bab wajib diisi" });
    }

    await db.query(
      `UPDATE quiz SET nama_quiz=?, rating=?, id_bab=? WHERE id_quiz=?`,
      [nama_quiz, rating || 0, id_bab, id_quiz]
    );

    res.json({ message: "Quiz berhasil diupdate" });
  } catch (err) {
    console.error("DB ERROR updateQuiz:", err);
    res.status(500).json({ message: "Gagal update quiz", error: err.message });
  }
};

// ===== Hapus quiz =====
export const deleteQuiz = async (req, res) => {
  try {
    const { id_quiz } = req.params;

    const [result] = await db.query("DELETE FROM quiz WHERE id_quiz=?", [id_quiz]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Quiz tidak ditemukan" });
    }

    res.json({ message: "Quiz berhasil dihapus" });
  } catch (err) {
    console.error("DB ERROR deleteQuiz:", err);
    res.status(500).json({ message: "Gagal hapus quiz", error: err.message });
  }
};
