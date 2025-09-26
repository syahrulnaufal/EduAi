import db from "../db.js";

// ✅ Ambil semua course dengan guru + point pembelajaran
export const getAllCourse = async (req, res) => {
  try {
    const [courses] = await db.query(`
      SELECT c.*, g.nama_guru 
      FROM course c 
      JOIN guru g ON c.id_guru = g.id_guru
    `);

    const [points] = await db.query("SELECT * FROM point_pembelajaran");

    const result = courses.map((c) => ({
      ...c,
      point_pembelajaran: points.filter((p) => p.id_course === c.id_course),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error server",
      error: err.message,
    });
  }
};

// ✅ Ambil course by ID
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const [course] = await db.query(
      `SELECT c.*, g.nama_guru 
       FROM course c 
       JOIN guru g ON c.id_guru = g.id_guru 
       WHERE c.id_course = ?`,
      [id]
    );

    if (course.length === 0) {
      return res.status(404).json({ message: "Course tidak ditemukan" });
    }

    const [points] = await db.query(
      "SELECT * FROM point_pembelajaran WHERE id_course = ?",
      [id]
    );

    res.json({ ...course[0], point_pembelajaran: points });
  } catch (err) {
    res.status(500).json({
      message: "Error server",
      error: err.message,
    });
  }
};

// ✅ Tambah course + point
// ✅ Tambah course + point
export const addCourse = async (req, res) => {
  try {
    const {
      nama_course,
      harga,
      jumlah_peserta,
      detail,
      sertifikasi,
      durasi,
      target_course,
      id_guru,
      points,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO course 
        (nama_course, harga, jumlah_peserta, detail, sertifikasi, durasi, target_course, id_guru) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nama_course, harga, jumlah_peserta, detail, sertifikasi, durasi, target_course, id_guru]
    );

    const courseId = result.insertId;

    if (Array.isArray(points)) {
      for (const p of points) {
        await db.query(
          "INSERT INTO point_pembelajaran (id_course, isi_point) VALUES (?, ?)",
          [courseId, p.isi_point] // ✅ pakai isi_point
        );
      }
    }

    res.json({ message: "Course berhasil ditambahkan", id: courseId });
  } catch (err) {
    console.error("❌ Error addCourse:", err);
    res.status(500).json({ message: "Error server", error: err.message });
  }
};

// ✅ Update course + point
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nama_course,
      harga,
      jumlah_peserta,
      detail,
      sertifikasi,
      durasi,
      target_course,
      id_guru,
      points,
    } = req.body;

    await db.query(
      `UPDATE course 
       SET nama_course=?, harga=?, jumlah_peserta=?, detail=?, sertifikasi=?, durasi=?, target_course=?, id_guru=? 
       WHERE id_course=?`,
      [nama_course, harga, jumlah_peserta, detail, sertifikasi, durasi, target_course, id_guru, id]
    );

    // hapus point lama
    await db.query("DELETE FROM point_pembelajaran WHERE id_course=?", [id]);

    // tambah point baru
    if (Array.isArray(points)) {
      for (const p of points) {
        await db.query(
          "INSERT INTO point_pembelajaran (id_course, isi_point) VALUES (?, ?)",
          [id, p.isi_point] // ✅ pakai isi_point
        );
      }
    }

    res.json({ message: "Course berhasil diupdate" });
  } catch (err) {
    console.error("❌ Error updateCourse:", err);
    res.status(500).json({ message: "Error server", error: err.message });
  }
};

// ✅ Hapus course + point
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM point_pembelajaran WHERE id_course=?", [id]);
    const [result] = await db.query("DELETE FROM course WHERE id_course=?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Course tidak ditemukan" });
    }

    res.json({ message: "Course berhasil dihapus" });
  } catch (err) {
    res.status(500).json({
      message: "Error server",
      error: err.message,
    });
  }
};
