import db from "../db.js";

export const getDashboard = async (req, res) => {
  try {
    const { periode } = req.query; // "minggu", "bulan", "tahun"
    let dateFilter = "";

    if (periode === "minggu") {
      dateFilter = "AND YEARWEEK(tanggal_pembelian, 1) = YEARWEEK(CURDATE(), 1)";
    } else if (periode === "bulan") {
      dateFilter = "AND MONTH(tanggal_pembelian) = MONTH(CURDATE()) AND YEAR(tanggal_pembelian) = YEAR(CURDATE())";
    } else if (periode === "tahun") {
      dateFilter = "AND YEAR(tanggal_pembelian) = YEAR(CURDATE())";
    }

    // 🔹 Total Users
    const [[userCount]] = await db.query("SELECT COUNT(*) as total FROM users");

    // 🔹 Total Pelajaran
    const [[pelajaranCount]] = await db.query("SELECT COUNT(*) as total FROM pelajaran");

    // 🔹 Total Subbab
    const [[subbabCount]] = await db.query("SELECT COUNT(*) as total FROM bab");

    // 🔹 Total Soal
    const [[soalCount]] = await db.query("SELECT COUNT(*) as total FROM soal");

    // 🔹 Data pembelian untuk LineChart
    const [pembelianRows] = await db.query(`
      SELECT DAYNAME(tanggal_pembelian) as hari, COUNT(*) as total
      FROM pembelian
      WHERE 1=1 ${dateFilter}
      GROUP BY DAYNAME(tanggal_pembelian)
      ORDER BY FIELD(hari, 'Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu')
    `);

    // 🔹 Total Guru untuk PieChart
    const [[guruCount]] = await db.query("SELECT COUNT(*) as total FROM guru");

    res.json({
      totalUsers: userCount.total,
      totalPelajaran: pelajaranCount.total,
      totalSubbab: subbabCount.total,
      totalSoal: soalCount.total,
      pembelian: pembelianRows,
      guru: [
        { name: "Guru", value: guruCount.total }
      ]
    });
  } catch (err) {
    console.error("Error dashboard:", err);
    res.status(500).json({ message: "Error server", error: err.message });
  }
};
