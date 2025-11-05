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

// ✅ Mulai ujian: buat hasil baru / ambil hasil lama
// POST /api/hasil/start
export const startHasil = async (req, res) => {
  try {
    const { id_user, id_quiz, ulang } = req.body;

    // kalau user mau ulang, hapus hasil + jawaban sebelumnya
    if (ulang) {
      const [old] = await db.query(
        "SELECT id_hasil FROM hasil WHERE id_user=? AND id_quiz=? ORDER BY id_hasil DESC LIMIT 1",
        [id_user, id_quiz]
      );
      if (old.length > 0) {
        await db.query("DELETE FROM jawaban_user WHERE id_hasil=?", [old[0].id_hasil]);
        await db.query("DELETE FROM hasil WHERE id_hasil=?", [old[0].id_hasil]);
      }

      // langsung buat hasil baru
      const [result] = await db.query(
        "INSERT INTO hasil (skor, waktu_pengerjaan, id_quiz, id_user) VALUES (?, NOW(), ?, ?)",
        [0, id_quiz, id_user]
      );
      return res.json({ id_hasil: result.insertId, mode: "ulang" });
    }

    // kalau bukan ulang, cek dulu apakah ada hasil lama
    const [rows] = await db.query(
      "SELECT id_hasil FROM hasil WHERE id_user=? AND id_quiz=? ORDER BY id_hasil DESC LIMIT 1",
      [id_user, id_quiz]
    );

    if (rows.length > 0) {
      const id_hasil = rows[0].id_hasil;

      // cek apakah sudah lengkap
      const [[{ total_soal }]] = await db.query(
        "SELECT COUNT(*) AS total_soal FROM soal WHERE id_quiz=?",
        [id_quiz]
      );

      const [[{ total_jawaban }]] = await db.query(
        "SELECT COUNT(*) AS total_jawaban FROM jawaban_user WHERE id_hasil=?",
        [id_hasil]
      );

      if (total_jawaban < total_soal) {
        // quiz belum selesai → lanjutkan
        return res.json({ id_hasil, mode: "lanjut" });
      } else {
        // quiz sudah selesai → balikin id_hasil lama
        return res.json({ id_hasil, mode: "selesai" });
      }
    }

    // kalau belum ada hasil sama sekali → buat baru
    const [result] = await db.query(
      "INSERT INTO hasil (skor, waktu_pengerjaan, id_quiz, id_user) VALUES (?, NOW(), ?, ?)",
      [0, id_quiz, id_user]
    );

    res.json({ id_hasil: result.insertId, mode: "baru" });
  } catch (err) {
    console.error("DB ERROR startHasil:", err);
    res.status(500).json({ message: "Gagal mulai hasil", error: err.message });
  }
};


// ✅ Simpan jawaban (insert/update)
export const saveJawaban = async (req, res) => {
  try {
    const { id_hasil, id_soal, jawaban_dipilih } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM jawaban_user WHERE id_hasil=? AND id_soal=?",
      [id_hasil, id_soal]
    );

    if (rows.length > 0) {
      await db.query(
        "UPDATE jawaban_user SET jawaban_dipilih=? WHERE id_hasil=? AND id_soal=?",
        [jawaban_dipilih, id_hasil, id_soal]
      );
    } else {
      await db.query(
        "INSERT INTO jawaban_user (jawaban_dipilih, id_hasil, id_soal) VALUES (?, ?, ?)",
        [jawaban_dipilih, id_hasil, id_soal]
      );
    }

    res.json({ message: "Jawaban tersimpan" });
  } catch (err) {
    console.error("DB ERROR saveJawaban:", err);
    res.status(500).json({ message: "Gagal simpan jawaban", error: err.message });
  }
};

// ✅ Ambil semua jawaban user untuk restore
export const getJawabanByHasil = async (req, res) => {
  try {
    const { id_hasil } = req.params;

    const [rows] = await db.query(
      "SELECT id_soal, jawaban_dipilih FROM jawaban_user WHERE id_hasil=?",
      [id_hasil]
    );

    res.json(rows);
  } catch (err) {
    console.error("DB ERROR getJawabanByHasil:", err);
    res.status(500).json({ message: "Gagal ambil jawaban", error: err.message });
  }
};

export const submitHasil = async (req, res) => {
  try {
    const { id_hasil, waktu_pengerjaan } = req.body;

    const [userJawaban] = await db.query(
      `SELECT ju.id_soal, ju.jawaban_dipilih, s.jawaban AS jawaban_benar
       FROM jawaban_user ju
       JOIN soal s ON ju.id_soal = s.id_soal
       WHERE ju.id_hasil = ?`,
      [id_hasil]
    );

    if (userJawaban.length === 0) {
      return res.status(400).json({ message: "Belum ada jawaban tersimpan" });
    }

    let benar = 0;
    userJawaban.forEach(j => {
      if (j.jawaban_dipilih && j.jawaban_benar &&
          j.jawaban_dipilih.toUpperCase() === j.jawaban_benar.toUpperCase()) {
        benar++;
      }
    });

    const skor = (benar / userJawaban.length) * 100;

    await db.query(
      `UPDATE hasil SET skor=?, waktu_pengerjaan=? WHERE id_hasil=?`,
      [skor, waktu_pengerjaan, id_hasil]
    );

    res.json({ 
      message: "Hasil disubmit", 
      skor, 
      totalBenar: benar, 
      totalSoal: userJawaban.length 
    });
  } catch (err) {
    console.error("DB ERROR submitHasil:", err);
    res.status(500).json({ message: "Gagal submit hasil", error: err.message });
  }
};

export const getHasilById = async (req, res) => {
  try {
    const { id_hasil } = req.params;

    // Ambil hasil utama
    const [rows] = await db.query(
      "SELECT id_hasil, skor FROM hasil WHERE id_hasil=?",
      [id_hasil]
    );

    if (rows.length === 0) return res.json(null);

    const hasil = rows[0];

    // Hitung benar & salah
    const [[{ benar }]] = await db.query(
      `SELECT COUNT(*) AS benar 
       FROM jawaban_user ju
       JOIN soal s ON ju.id_soal = s.id_soal
       WHERE ju.id_hasil=? AND UPPER(ju.jawaban_dipilih) = UPPER(s.jawaban)`,
      [id_hasil]
    );

    const [[{ total }]] = await db.query(
      "SELECT COUNT(*) AS total FROM soal s JOIN hasil h ON h.id_quiz=s.id_quiz WHERE h.id_hasil=?",
      [id_hasil]
    );

    res.json({
      id_hasil,
      skor: hasil.skor,
      benar,
      salah: total - benar,
      total
    });
  } catch (err) {
    console.error("DB ERROR getHasilById:", err);
    res.status(500).json({ message: "Gagal ambil hasil", error: err.message });
  }
};

export const getPembahasan = async (req, res) => {
  try {
    const { id_quiz, id_hasil } = req.params;

    // Ambil semua soal + jawaban benar
    const [soal] = await db.query(
  `SELECT s.id_soal, s.pertanyaan, s.opsi_a, s.opsi_b, s.opsi_c, s.opsi_d, s.jawaban
   FROM soal s
   WHERE s.id_quiz = ?`,
  [id_quiz]
);


    if (!soal.length) {
      return res.json({ soal: [], jawaban_user: {} });
    }

    // Ambil jawaban user
    const [jawabanUser] = await db.query(
      `SELECT id_soal, jawaban_dipilih
       FROM jawaban_user
       WHERE id_hasil = ?`,
      [id_hasil]
    );

    // Ubah ke map { id_soal: 'A' }
    const jawabanMap = {};
    jawabanUser.forEach(j => {
      jawabanMap[j.id_soal] = (j.jawaban_dipilih || "").toUpperCase();
    });

    res.json({
      soal,
      jawaban_user: jawabanMap
    });

  } catch (err) {
    console.error("DB ERROR getPembahasan:", err);
    res.status(500).json({ message: "Gagal ambil pembahasan", error: err.message });
  }
};
