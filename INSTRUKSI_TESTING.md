# Instruksi Manual untuk Update Database

## 1. Update Database Schema
Jalankan perintah SQL berikut di phpMyAdmin atau MySQL client kamu:

```sql
ALTER TABLE `histori_chat` 
MODIFY COLUMN `tanggal` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP;
```

Atau bisa menggunakan file SQL yang sudah dibuat:
- Buka phpMyAdmin
- Pilih database 'eduai'
- Import file: `update_histori_chat.sql`

## 2. Test Aplikasi

### Menjalankan Backend:
```bash
cd backend
npm start
```

### Menjalankan Frontend:
```bash
npm run dev
```

## 3. Test Fitur Chat History per User

1. **Login sebagai User A (misalnya Dimas)**
   - Email: dimas@gmail.com
   - Password: 123456
   - Buka halaman chatbot
   - Kirim beberapa pesan
   - Catat pesan yang dikirim

2. **Logout dan Login sebagai User B (misalnya newuser)**
   - Email: newuser@email.com  
   - Password: 12345
   - Buka halaman chatbot
   - Pastikan history kosong (tidak ada pesan dari User A)
   - Kirim pesan berbeda

3. **Logout dan Login kembali sebagai User A**
   - Buka halaman chatbot
   - Pastikan history muncul sesuai dengan pesan User A sebelumnya

## 4. Debug Session (Opsional)

Untuk memastikan session berfungsi, akses endpoint debug:
- URL: http://localhost:5000/api/chat/test-session
- Pastikan response menunjukkan userId yang sesuai dengan user yang login

## 5. Cek Console untuk Debug Logs

Buka browser Developer Tools → Console untuk melihat debug logs yang membantu troubleshooting jika ada masalah.

---

**Catatan:** Jika masih ada masalah, cek:
1. Cookie session terkirim dengan benar (Network tab → Headers)
2. Backend console untuk debug logs
3. Database apakah data tersimpan dengan `id_user` yang benar