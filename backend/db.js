// db.js
import mysql from "mysql2/promise";

// Buat koneksi langsung (ingat: ini async, jadi kita tunggu di awal aplikasi)
// const db = await mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '1234', // isi password kalau ada
//   database: 'eduai'
// });

// // Tes koneksi
// console.log('MySQL connected!');

// export default db;

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, 
  port: process.env.DB_PORT || 4000,
  ssl: { // SSL WAJIB untuk TiDB Cloud
    rejectUnauthorized: true 
  }
});

console.log('Terhubung ke TiDB Cloud (MySQL compatible)!');

export default db;
