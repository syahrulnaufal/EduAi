-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 15 Sep 2025 pada 05.07
-- Versi server: 8.0.30
-- Versi PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eduai`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `bab`
--

CREATE TABLE `bab` (
  `id_bab` int NOT NULL,
  `judul_bab` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `point_xp` int DEFAULT NULL,
  `point_gold` int DEFAULT NULL,
  `detail` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `harga` int NOT NULL,
  `icon` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_pelajaran` int NOT NULL,
  `id_quiz` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `bab`
--

INSERT INTO `bab` (`id_bab`, `judul_bab`, `point_xp`, `point_gold`, `detail`, `harga`, `icon`, `id_pelajaran`, `id_quiz`) VALUES
(1, 'Matematika: Statistika & Peluang', NULL, NULL, 'Ada data tunggal, ada data kelompok. Kita belajar cara penyajiannya yuk! Video ini video konsep kilat. Materi dijelaskan lebih cepat. Langsung aja yuk mulai belajar!', 0, '/img/ikonSuratLamaranKerja.png', 3, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `course`
--

CREATE TABLE `course` (
  `id_course` int NOT NULL,
  `nama_course` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `harga` float NOT NULL,
  `jumlah_peserta` int DEFAULT NULL,
  `detail` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `sertifikasi` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `durasi` float NOT NULL,
  `target_course` int NOT NULL,
  `id_user` int NOT NULL,
  `id_guru` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `guru`
--

CREATE TABLE `guru` (
  `id_guru` int NOT NULL,
  `nama_guru` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bio_guru` text COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `hasil`
--

CREATE TABLE `hasil` (
  `id_hasil` int NOT NULL,
  `score` decimal(5,2) NOT NULL,
  `waktu_pengerjaan` datetime NOT NULL,
  `id_quiz` int NOT NULL,
  `id_user` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `histori_chat`
--

CREATE TABLE `histori_chat` (
  `id_chat` int NOT NULL,
  `isi_chat` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_user` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `histori_chat`
--

INSERT INTO `histori_chat` (`id_chat`, `isi_chat`, `tanggal`, `role`, `id_user`) VALUES
(29, 'hallo bot', '2025-09-08 10:55:46', 'user', 5),
(30, 'Halo! Saya Dimas, asisten AI yang siap membantu kamu dengan pertanyaan atau masalah terkait pendidikan. Apa yang ingin kamu tanyakan hari ini?', '2025-09-08 10:55:47', 'assistant', 5),
(31, 'ok', '2025-09-08 10:59:19', 'user', 5),
(32, 'Tidak apa-apa kalau kamu belum siap bertanya. Kamu bisa memilih topik yang ingin kamu bahas, seperti sekolah, kuliah, mata pelajaran, atau lain-lain. Atau kamu bisa meminta saran tentang cara belajar yang efektif atau tips untuk meningkatkan prestasi akademik.\n\nJika kamu ingin, kamu bisa memulai dengan bertanya, \"Apa yang ingin saya tahu tentang...\" atau \"Bagaimana cara...\"', '2025-09-08 10:59:19', 'assistant', 5),
(33, 'test', '2025-09-08 10:59:22', 'user', 5),
(34, 'Test saja! Tapi sebenarnya, saya tidak memiliki jawaban yang spesifik untuk \"test\". Jika kamu ingin melakukan tes atau simulasi, saya bisa membantu kamu dengan contoh soal atau materi yang relevan. Misalnya, kamu ingin melakukan tes matematika atau tes bahasa Inggris?', '2025-09-08 10:59:23', 'assistant', 5),
(35, 'halo kamu siapa', '2025-09-08 10:59:30', 'user', 5),
(36, 'Halo! Saya Dimas, asisten AI yang siap membantu kamu dengan pertanyaan atau masalah terkait pendidikan. Saya disini untuk membantu kamu belajar, memahami materi, dan meningkatkan prestasi akademik. Apa yang ingin kamu tanyakan hari ini?', '2025-09-08 10:59:31', 'assistant', 5),
(37, 'test', '2025-09-08 11:00:19', 'user', 5),
(38, 'Tidak ada jawaban spesifik untuk \"test\" karena itu adalah instruksi. Jika kamu ingin melakukan tes atau simulasi, saya bisa membantu kamu dengan contoh soal atau materi yang relevan.\n\nMisalnya, kamu ingin melakukan tes matematika atau tes bahasa Inggris? Atau kamu ingin melakukan tes tentang geografi, sejarah, atau lain-lain?', '2025-09-08 11:00:19', 'assistant', 5),
(39, 'test', '2025-09-08 11:00:31', 'user', 5),
(40, 'Saya rasa kamu ingin melakukan tes atau simulasi. Tapi saya masih belum tahu apa yang kamu ingin tes. Apakah kamu ingin tes tentang:\n\n- Matematika?\n- Bahasa Inggris?\n- Geografi?\n- Sejarah?\n- Lain-lain?\n\nSilakan beritahu saya, saya akan membantu kamu dengan contoh soal atau materi yang relevan!', '2025-09-08 11:00:31', 'assistant', 5),
(41, 'matematika kelas 10 smp', '2025-09-08 11:00:42', 'user', 5),
(42, 'Baiklah! Saya akan membantu kamu dengan contoh soal matematika kelas 10 SMP.\n\nBerikut adalah beberapa topik matematika kelas 10 SMP:\n\n1. Aljabar (penyelesaian persamaan linear dan kuadrat)\n2. Geometri (luas dan keliling bangun datar)\n3. Trigonometri (fungsi trigonometri dan identitas trigonometri)\n4. Statistika dan Probabilitas (penghitungan mean, median, dan modus)\n\nSilakan pilih salah satu topik di atas, atau kamu bisa memilih topik lain yang kamu ingin tes.\n\nSetelah itu, saya akan memberikan kamu contoh soal dan kamu bisa menjawabnya. Apakah kamu siap?', '2025-09-08 11:00:43', 'assistant', 5),
(43, 'siap dong', '2025-09-08 11:00:56', 'user', 5),
(44, 'Baiklah! Saya akan memberikan kamu contoh soal matematika kelas 10 SMP tentang Aljabar (penyelesaian persamaan linear).\n\nBerikut adalah contoh soal:\n\n**Soal 1**\n\n2x + 5 = 11\n\nTentukan nilai x!\n\nSilakan kamu menjawab soal tersebut. Setelah itu, saya akan memberikan kamu jawaban yang benar dan penjelasannya.\n\nApakah kamu siap menjawab soal?', '2025-09-08 11:00:57', 'assistant', 5),
(45, 'aduh lupa', '2025-09-08 11:01:00', 'user', 5),
(46, 'Tidak apa-apa! Saya akan membantu kamu mengingat cara menyelesaikan persamaan linear.\n\nCara menyelesaikan persamaan linear adalah dengan menggunakan metode penyelesaian sederhana atau metode penyelesaian dengan aljabar.\n\nMisalnya, dalam contoh soal sebelumnya:\n\n2x + 5 = 11\n\nKamu bisa menyelesaikannya dengan cara berikut:\n\n1. Kembalikan 2x ke sisi kiri dengan cara mengurangi 5 dari kedua sisi:\n2x = 11 - 5\n2x = 6\n2. Kemudian, bagilah kedua sisi oleh 2 untuk menemukan nilai x:\nx = 6/2\nx = 3\n\nJadi, nilai x adalah 3!\n\nApakah kamu sudah mengingat cara menyelesaikan persamaan linear?', '2025-09-08 11:01:01', 'assistant', 5),
(47, 'oke udah cukup untuk hari ini', '2025-09-08 11:01:11', 'user', 5),
(48, 'Baiklah! Saya senang bisa membantu kamu hari ini. Jika kamu memiliki pertanyaan atau ingin belajar lebih lanjut, jangan ragu untuk menghubungi saya lagi nanti.\n\nSampai jumpa lagi, dan semoga kamu berhasil dalam belajar matematika!', '2025-09-08 11:01:12', 'assistant', 5);

-- --------------------------------------------------------

--
-- Struktur dari tabel `jawaban_user`
--

CREATE TABLE `jawaban_user` (
  `id_jawaban` int NOT NULL,
  `jawaban_dipilih` char(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_hasil` int NOT NULL,
  `id_soal` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `jenjang`
--

CREATE TABLE `jenjang` (
  `id_jenjang` int NOT NULL,
  `nama_jenjang` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `jenjang`
--

INSERT INTO `jenjang` (`id_jenjang`, `nama_jenjang`) VALUES
(1, 'Kelas 1'),
(2, 'Kelas 2'),
(3, 'Kelas 3'),
(4, 'Kelas 4'),
(5, 'Kelas 5'),
(6, 'Kelas 6'),
(7, 'Kelas 7 SMP/MTs'),
(8, 'Kelas 8 SMP/MTs'),
(9, 'Kelas 9 SMP/MTs'),
(10, 'Kelas 10 MA/SMA/SMK'),
(11, 'Kelas 11 MA/SMA/SMK'),
(12, 'Kelas 12 MA/SMA/SMK');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pelajaran`
--

CREATE TABLE `pelajaran` (
  `id_pelajaran` int NOT NULL,
  `nama_pelajaran` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `link` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_jenjang` int NOT NULL,
  `id_bab` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `pelajaran`
--

INSERT INTO `pelajaran` (`id_pelajaran`, `nama_pelajaran`, `icon`, `link`, `id_jenjang`, `id_bab`) VALUES
(2, 'Bahasa Indonesia', '/img/ikonKelasBahasaIndo.png', 'indo', 10, NULL),
(3, 'Matematika', '/img/mtk.png', 'mtk', 10, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `pembelian`
--

CREATE TABLE `pembelian` (
  `id_pembelian` int NOT NULL,
  `tanggal_pembelian` date NOT NULL,
  `status_pembayaran` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_user` int NOT NULL,
  `id_bab` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `point_pembelajaran`
--

CREATE TABLE `point_pembelajaran` (
  `id_point` int NOT NULL,
  `isi_point` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_bab` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `quiz`
--

CREATE TABLE `quiz` (
  `id_quiz` int NOT NULL,
  `nama_quiz` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jumlah_soal` int NOT NULL,
  `rating` decimal(3,2) NOT NULL,
  `id_bab` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `soal`
--

CREATE TABLE `soal` (
  `id_soal` int NOT NULL,
  `pertanyaan` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `opsi_a` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `opsi_b` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `opsi_c` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `opsi_d` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jawaban` char(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_quiz` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `subbab`
--

CREATE TABLE `subbab` (
  `id_subbab` int NOT NULL,
  `judul_subbab` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `video_materi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `urutan` int NOT NULL,
  `id_bab` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `subbab`
--

INSERT INTO `subbab` (`id_subbab`, `judul_subbab`, `video_materi`, `urutan`, `id_bab`) VALUES
(1, 'Pengertian dan Contoh Data Tunggal', 'http', 1, 1),
(2, 'Pengertian dan Contoh Data Kelompok', 'http', 2, 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id_user` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_google` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('admin','user') COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id_user`, `username`, `email`, `password`, `id_google`, `role`) VALUES
(1, 'Dimas', 'dimas@gmail.com', '123456', NULL, 'user'),
(2, 'newuser', 'newuser@email.com', '12345', NULL, 'user'),
(3, 'faisal', 'fasial@gmail.com', '123456', NULL, 'user'),
(4, 'dimas', 'dimasbeler@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$hboZEmr6g6FN1nH4KW4TQQ$MbAhy2wl7BxMwOuy59FrQRugkt7h6S7Hwp162SuLW1s', NULL, 'user'),
(5, 'user', 'user@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$oRgf5LwgIzSP5YQ2MgKFmQ$pi81+uR2oyHOtt51ZppLrv+NMnxWUPfbJZHKS1SEavE', NULL, 'admin');

-- --------------------------------------------------------

--
-- Struktur dari tabel `user_progres_bab`
--

CREATE TABLE `user_progres_bab` (
  `status` int NOT NULL,
  `tanggal_selesai` datetime DEFAULT NULL,
  `tanggal_menonton` datetime DEFAULT NULL,
  `durasi_video` int NOT NULL,
  `durasi_menonton` int NOT NULL,
  `id_user` int NOT NULL,
  `id_subbab` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `bab`
--
ALTER TABLE `bab`
  ADD PRIMARY KEY (`id_bab`),
  ADD KEY `fk_bab_quiz` (`id_quiz`),
  ADD KEY `fk_bab_pelajaran` (`id_pelajaran`);

--
-- Indeks untuk tabel `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`id_course`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_guru` (`id_guru`);

--
-- Indeks untuk tabel `guru`
--
ALTER TABLE `guru`
  ADD PRIMARY KEY (`id_guru`);

--
-- Indeks untuk tabel `hasil`
--
ALTER TABLE `hasil`
  ADD PRIMARY KEY (`id_hasil`),
  ADD KEY `id_quiz` (`id_quiz`),
  ADD KEY `id_user` (`id_user`);

--
-- Indeks untuk tabel `histori_chat`
--
ALTER TABLE `histori_chat`
  ADD PRIMARY KEY (`id_chat`),
  ADD KEY `id_user` (`id_user`);

--
-- Indeks untuk tabel `jawaban_user`
--
ALTER TABLE `jawaban_user`
  ADD PRIMARY KEY (`id_jawaban`),
  ADD KEY `id_hasil` (`id_hasil`),
  ADD KEY `id_soal` (`id_soal`);

--
-- Indeks untuk tabel `jenjang`
--
ALTER TABLE `jenjang`
  ADD PRIMARY KEY (`id_jenjang`);

--
-- Indeks untuk tabel `pelajaran`
--
ALTER TABLE `pelajaran`
  ADD PRIMARY KEY (`id_pelajaran`),
  ADD KEY `id_jenjang` (`id_jenjang`),
  ADD KEY `id_bab` (`id_bab`);

--
-- Indeks untuk tabel `pembelian`
--
ALTER TABLE `pembelian`
  ADD PRIMARY KEY (`id_pembelian`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_bab` (`id_bab`);

--
-- Indeks untuk tabel `point_pembelajaran`
--
ALTER TABLE `point_pembelajaran`
  ADD PRIMARY KEY (`id_point`),
  ADD KEY `id_bab` (`id_bab`);

--
-- Indeks untuk tabel `quiz`
--
ALTER TABLE `quiz`
  ADD PRIMARY KEY (`id_quiz`),
  ADD KEY `id_bab` (`id_bab`);

--
-- Indeks untuk tabel `soal`
--
ALTER TABLE `soal`
  ADD PRIMARY KEY (`id_soal`),
  ADD KEY `id_quiz` (`id_quiz`);

--
-- Indeks untuk tabel `subbab`
--
ALTER TABLE `subbab`
  ADD PRIMARY KEY (`id_subbab`),
  ADD KEY `id_bab` (`id_bab`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- Indeks untuk tabel `user_progres_bab`
--
ALTER TABLE `user_progres_bab`
  ADD PRIMARY KEY (`id_user`,`id_subbab`),
  ADD KEY `fk_subbab` (`id_subbab`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `bab`
--
ALTER TABLE `bab`
  MODIFY `id_bab` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `course`
--
ALTER TABLE `course`
  MODIFY `id_course` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `guru`
--
ALTER TABLE `guru`
  MODIFY `id_guru` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `hasil`
--
ALTER TABLE `hasil`
  MODIFY `id_hasil` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `histori_chat`
--
ALTER TABLE `histori_chat`
  MODIFY `id_chat` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT untuk tabel `jawaban_user`
--
ALTER TABLE `jawaban_user`
  MODIFY `id_jawaban` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `jenjang`
--
ALTER TABLE `jenjang`
  MODIFY `id_jenjang` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `pelajaran`
--
ALTER TABLE `pelajaran`
  MODIFY `id_pelajaran` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `pembelian`
--
ALTER TABLE `pembelian`
  MODIFY `id_pembelian` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `point_pembelajaran`
--
ALTER TABLE `point_pembelajaran`
  MODIFY `id_point` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `quiz`
--
ALTER TABLE `quiz`
  MODIFY `id_quiz` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `soal`
--
ALTER TABLE `soal`
  MODIFY `id_soal` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `subbab`
--
ALTER TABLE `subbab`
  MODIFY `id_subbab` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `bab`
--
ALTER TABLE `bab`
  ADD CONSTRAINT `fk_bab_pelajaran` FOREIGN KEY (`id_pelajaran`) REFERENCES `pelajaran` (`id_pelajaran`),
  ADD CONSTRAINT `fk_bab_quiz` FOREIGN KEY (`id_quiz`) REFERENCES `quiz` (`id_quiz`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `course`
--
ALTER TABLE `course`
  ADD CONSTRAINT `course_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`),
  ADD CONSTRAINT `course_ibfk_2` FOREIGN KEY (`id_guru`) REFERENCES `guru` (`id_guru`);

--
-- Ketidakleluasaan untuk tabel `hasil`
--
ALTER TABLE `hasil`
  ADD CONSTRAINT `hasil_ibfk_1` FOREIGN KEY (`id_quiz`) REFERENCES `quiz` (`id_quiz`),
  ADD CONSTRAINT `hasil_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);

--
-- Ketidakleluasaan untuk tabel `histori_chat`
--
ALTER TABLE `histori_chat`
  ADD CONSTRAINT `histori_chat_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);

--
-- Ketidakleluasaan untuk tabel `jawaban_user`
--
ALTER TABLE `jawaban_user`
  ADD CONSTRAINT `jawaban_user_ibfk_1` FOREIGN KEY (`id_hasil`) REFERENCES `hasil` (`id_hasil`),
  ADD CONSTRAINT `jawaban_user_ibfk_2` FOREIGN KEY (`id_soal`) REFERENCES `soal` (`id_soal`);

--
-- Ketidakleluasaan untuk tabel `pelajaran`
--
ALTER TABLE `pelajaran`
  ADD CONSTRAINT `pelajaran_ibfk_1` FOREIGN KEY (`id_jenjang`) REFERENCES `jenjang` (`id_jenjang`),
  ADD CONSTRAINT `pelajaran_ibfk_2` FOREIGN KEY (`id_bab`) REFERENCES `bab` (`id_bab`);

--
-- Ketidakleluasaan untuk tabel `pembelian`
--
ALTER TABLE `pembelian`
  ADD CONSTRAINT `pembelian_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`),
  ADD CONSTRAINT `pembelian_ibfk_2` FOREIGN KEY (`id_bab`) REFERENCES `bab` (`id_bab`);

--
-- Ketidakleluasaan untuk tabel `point_pembelajaran`
--
ALTER TABLE `point_pembelajaran`
  ADD CONSTRAINT `point_pembelajaran_ibfk_1` FOREIGN KEY (`id_bab`) REFERENCES `bab` (`id_bab`);

--
-- Ketidakleluasaan untuk tabel `quiz`
--
ALTER TABLE `quiz`
  ADD CONSTRAINT `quiz_ibfk_1` FOREIGN KEY (`id_bab`) REFERENCES `bab` (`id_bab`);

--
-- Ketidakleluasaan untuk tabel `soal`
--
ALTER TABLE `soal`
  ADD CONSTRAINT `soal_ibfk_1` FOREIGN KEY (`id_quiz`) REFERENCES `quiz` (`id_quiz`);

--
-- Ketidakleluasaan untuk tabel `subbab`
--
ALTER TABLE `subbab`
  ADD CONSTRAINT `subbab_ibfk_1` FOREIGN KEY (`id_bab`) REFERENCES `bab` (`id_bab`);

--
-- Ketidakleluasaan untuk tabel `user_progres_bab`
--
ALTER TABLE `user_progres_bab`
  ADD CONSTRAINT `fk_subbab` FOREIGN KEY (`id_subbab`) REFERENCES `subbab` (`id_subbab`),
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
