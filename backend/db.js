// db.js
import mysql from "mysql2/promise";

// Buat koneksi langsung (ingat: ini async, jadi kita tunggu di awal aplikasi)
const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // isi password kalau ada
  database: 'eduai'
});

// Tes koneksi
console.log('MySQL connected!');

export default db;
