import db from "../db.js";

// Ambil bab + progres + nama_pelajaran berdasarkan id_pelajaran
export const getBabAndProgresByPelajaran = async (req, res) => {
  try {
    const { id_pelajaran, id_user } = req.query;

    if (!id_pelajaran) {
      return res.status(400).json({ message: "id_pelajaran wajib diisi" });
    }

    const [pelajaranRows] = await db.execute(
      "SELECT nama_pelajaran, icon FROM pelajaran WHERE id_pelajaran = ?",
      [id_pelajaran]
    );
    const nama_pelajaran = pelajaranRows.length > 0 ? pelajaranRows[0].nama_pelajaran : null;
    const icon_pelajaran = pelajaranRows.length > 0 ? pelajaranRows[0].icon : null;

    // Ambil semua bab dari pelajaran
    const [bab] = await db.execute(
      "SELECT * FROM bab WHERE id_pelajaran = ?",
      [id_pelajaran]
    );

    if (bab.length === 0) {
      return res.json({ bab: [], subbab: [], progres: { total: 0, selesai: 0, persen: 0 } });
    }

    // Ambil semua subbab dari bab
    const [subbab] = await db.query(
      `SELECT * FROM subbab WHERE id_bab IN (${bab.map(() => "?").join(",")})`,
      bab.map((b) => b.id_bab)
    );

    const totalSubbab = subbab.length;
    let selesaiSubbab = 0;

    if (id_user && id_user != 0) {
      // Ambil progres user
      const [rows] = await db.query(
        `SELECT * FROM user_progres_subbab WHERE id_user = ? 
         AND id_subbab IN (${subbab.map(() => "?").join(",")})`,
        [id_user, ...subbab.map((s) => s.id_subbab)]
      );

      // Hitung subbab selesai
      selesaiSubbab = rows.filter(
        (p) => p.status === 1 || p.durasi_menonton >= p.durasi_video
      ).length;
    }

    // Kalau belum login, semua progres = 0
    const persen = totalSubbab > 0 ? Math.round((selesaiSubbab / totalSubbab) * 100) : 0;

    res.json({
      nama_pelajaran: nama_pelajaran || "",
      icon_pelajaran: icon_pelajaran || "/img/default.png",
      bab,
      subbab,
      progres: {
        total: totalSubbab,
        selesai: selesaiSubbab,
        persen: persen
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getallbab = async (req, res) => {
  try {
    const { id_pelajaran } = req.query;
    const [rows] = await db.execute("SELECT * FROM bab WHERE id_pelajaran = ?", [id_pelajaran]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================== READ ==================
// Semua bab + pelajaran + jenjang (untuk admin)
export const getBabByPelajaran = async (req, res) => {
  try {
    const { id_pelajaran } = req.params;

    const [rows] = await db.query(`
      SELECT 
        b.id_bab,
        b.judul_bab,
        b.detail,
        b.harga,
        b.icon,
        b.point_xp,
        p.id_pelajaran,
        p.nama_pelajaran,
        j.id_jenjang,
        j.nama_jenjang,
        (SELECT COUNT(*) FROM subbab s WHERE s.id_bab = b.id_bab) AS total_subbab,
        (SELECT COUNT(*) FROM quiz q WHERE q.id_bab = b.id_bab) AS total_quiz
      FROM bab b
      JOIN pelajaran p ON b.id_pelajaran = p.id_pelajaran
      JOIN jenjang j ON p.id_jenjang = j.id_jenjang
      WHERE b.id_pelajaran = ?
      ORDER BY b.id_bab ASC
    `, [id_pelajaran]);

    res.json(rows);
  } catch (err) {
    console.error("DB ERROR getBabByPelajaran:", err);
    res.status(500).json({ message: "Gagal ambil data bab", error: err.message });
  }
};



// ================== CREATE ==================
export const addBab = async (req, res) => {
  try {
    const { judul_bab, point_xp, detail, harga, id_pelajaran } = req.body;
    if (!judul_bab || !id_pelajaran) {
      return res.status(400).json({ message: "Judul Bab & id_pelajaran wajib diisi" });
    }

    const iconPath = req.file ? `/img/${req.file.filename}` : "/img/default.png";

    const [result] = await db.query(
      `INSERT INTO bab (judul_bab, point_xp, detail, harga, icon, id_pelajaran) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [judul_bab, point_xp || 0, detail || "", harga || 0, iconPath, id_pelajaran]
    );

    res.json({ message: "Bab berhasil ditambahkan", id: result.insertId });
  } catch (err) {
    console.error("DB ERROR addBab:", err);
    res.status(500).json({ message: "Gagal menambah bab", error: err.message });
  }
};


// ================== UPDATE ==================
export const updateBab = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul_bab, point_xp, detail, harga, id_pelajaran } = req.body;
    if (!judul_bab || !id_pelajaran) {
      return res.status(400).json({ message: "Judul Bab & id_pelajaran wajib diisi" });
    }

    const iconPath = req.file ? `/img/${req.file.filename}` : null;

    let query = `UPDATE bab SET judul_bab=?, point_xp=?, detail=?, harga=?, id_pelajaran=?`;
    const params = [judul_bab, point_xp || 0, detail || "", harga || 0, id_pelajaran];

    if (iconPath) {
      query += `, icon=?`;
      params.push(iconPath);
    }
    query += ` WHERE id_bab=?`;
    params.push(id);

    await db.query(query, params);
    res.json({ message: "Bab berhasil diupdate" });
  } catch (err) {
    console.error("DB ERROR updateBab:", err);
    res.status(500).json({ message: "Gagal mengupdate bab", error: err.message });
  }
};

// ================== DELETE ==================
export const deleteBab = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM bab WHERE id_bab=?", [id]);
    res.json({ message: "Bab berhasil dihapus" });
  } catch (err) {
    console.error("DB ERROR deleteBab:", err);
    res.status(500).json({ message: "Gagal menghapus bab", error: err.message });
  }
};


export default { getBabAndProgresByPelajaran, getallbab, getBabByPelajaran, addBab, updateBab, deleteBab };