import db from "../db.js";

// === GET soal by quiz ===
export const getSoalByQuiz = async (req, res) => {
  try {
    const { id_quiz } = req.params;
    const [rows] = await db.query(
      `SELECT 
         s.*, 
         q.nama_quiz, 
         b.judul_bab
       FROM soal s
       JOIN quiz q ON s.id_quiz = q.id_quiz
       JOIN bab b ON q.id_bab = b.id_bab
       WHERE s.id_quiz = ?`,
      [id_quiz]
    );

    if (rows.length === 0) {
      return res.json({ soal: [], judul_bab: "", nama_quiz: "" });
    }

    res.json({
      soal: rows,
      judul_bab: rows[0].judul_bab,
      nama_quiz: rows[0].nama_quiz,
    });
  } catch (err) {
    console.error("DB ERROR getSoalByQuiz:", err);
    res.status(500).json({ message: "Gagal ambil soal", error: err.message });
  }
};


// === CREATE soal ===
export const createSoal = async (req, res) => {
  try {
    const { pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, jawaban, id_quiz } = req.body;
    if (!pertanyaan || !jawaban || !id_quiz) {
      return res.status(400).json({ message: "Pertanyaan, Jawaban, dan id_quiz wajib diisi" });
    }

    const [result] = await db.query(
      `INSERT INTO soal (pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, jawaban, id_quiz)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, jawaban, id_quiz]
    );
    res.json({ message: "Soal berhasil ditambahkan", id: result.insertId });
  } catch (err) {
    console.error("DB ERROR createSoal:", err);
    res.status(500).json({ message: "Gagal menambah soal", error: err.message });
  }
};

// === UPDATE soal ===
export const updateSoal = async (req, res) => {
  try {
    const { id_soal } = req.params;
    const { pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, jawaban } = req.body;

    await db.query(
      `UPDATE soal 
       SET pertanyaan=?, opsi_a=?, opsi_b=?, opsi_c=?, opsi_d=?, jawaban=? 
       WHERE id_soal=?`,
      [pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, jawaban, id_soal]
    );
    res.json({ message: "Soal berhasil diupdate" });
  } catch (err) {
    console.error("DB ERROR updateSoal:", err);
    res.status(500).json({ message: "Gagal update soal", error: err.message });
  }
};

// === DELETE soal ===
export const deleteSoal = async (req, res) => {
  try {
    const { id_soal } = req.params;
    const [result] = await db.query("DELETE FROM soal WHERE id_soal=?", [id_soal]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Soal tidak ditemukan" });
    }
    res.json({ message: "Soal berhasil dihapus" });
  } catch (err) {
    console.error("DB ERROR deleteSoal:", err);
    res.status(500).json({ message: "Gagal hapus soal", error: err.message });
  }
};
