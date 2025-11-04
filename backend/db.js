import mysql from "mysql2/promise";

// 1. Cek apakah kita sedang dalam mode produksi
const isProduction = process.env.NODE_ENV === 'production';

// 2. Siapkan konfigurasi koneksi
const connectionConfig = {
    database: process.env.DB_NAME || 'eduai',
    
    // Atur batas koneksi untuk pool
    connectionLimit: 10, 
    
    ...(isProduction ? {
        // --- PENGATURAN PRODUKSI (UNTUK RENDER + TiDB) ---
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 4000,
        ssl: { rejectUnauthorized: true }
    } : {
        // --- PENGATURAN LOKAL (UNTUK KOMPUTER ANDA) ---
        host: 'localhost',
        user: 'root',
        password: '1234', // Ganti dengan password MySQL lokal Anda
        port: 5173 
    })
};

// 3. ✅ Ganti 'createConnection' menjadi 'createPool'
const pool = mysql.createPool(connectionConfig);

// 4. (Opsional) Tes koneksi pool saat server start
try {
    const connection = await pool.getConnection();
    console.log(isProduction ? 'Berhasil terhubung ke TiDB Cloud (Pool)!' : 'Berhasil terhubung ke database MySQL LOKAL (Pool)!');
    connection.release(); // Penting: Selalu lepaskan koneksi setelah dipakai
} catch (err) {
    console.error("Gagal terhubung ke database pool:", err);
}

// 5. Ekspor 'pool' sebagai default
// Kode di controller Anda (misal: await db.query(...)) akan otomatis
// menggunakan pool ini untuk mengambil koneksi.
export default pool;