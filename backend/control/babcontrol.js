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

export default { getBabAndProgresByPelajaran, getallbab };