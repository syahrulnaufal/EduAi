-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 30 Sep 2025 pada 16.06
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
(1, 'Matematika: Statistika & Peluang', 75, NULL, 'Ada data tunggal, ada data kelompok. Kita belajar cara penyajiannya yuk! Video ini video konsep kilat. Materi dijelaskan lebih cepat. Langsung aja yuk mulai belajar!', 0, '/img/ikonSuratLamaranKerja.png', 3, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `conversations`
--

CREATE TABLE `conversations` (
  `id_conversation` int NOT NULL,
  `id_user` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `conversations`
--

INSERT INTO `conversations` (`id_conversation`, `id_user`, `title`, `created_at`, `updated_at`) VALUES
(1, 2, 'test', '2025-09-30 22:59:06', '2025-09-30 23:02:56');

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
  `target_course` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `id_guru` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `course`
--

INSERT INTO `course` (`id_course`, `nama_course`, `harga`, `jumlah_peserta`, `detail`, `sertifikasi`, `durasi`, `target_course`, `id_guru`) VALUES
(5, 'xz', 2, 2, 'sd', 'sd', 2, '0', 2),
(6, 'xzc', 2321, 22, 'asd', 'asd', 12, 'adsss', 2);

-- --------------------------------------------------------

--
-- Struktur dari tabel `guru`
--

CREATE TABLE `guru` (
  `id_guru` int NOT NULL,
  `nama_guru` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bio_guru` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `pendidikan_terakhir` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `guru`
--

INSERT INTO `guru` (`id_guru`, `nama_guru`, `bio_guru`, `pendidikan_terakhir`) VALUES
(2, 'er', 'er', 'er');

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
  `tanggal` datetime NOT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_user` int NOT NULL,
  `id_conversation` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `histori_chat`
--

INSERT INTO `histori_chat` (`id_chat`, `isi_chat`, `tanggal`, `role`, `id_user`, `id_conversation`) VALUES
(1, 'test', '2025-09-30 23:02:56', 'user', 2, 1),
(2, 'Tolong berikan pertanyaan yang lebih spesifik terkait pendidikan, sehingga saya dapat membantu Anda dengan lebih efektif. Apakah Anda ingin tahu tentang strategi belajar, cara meningkatkan kemampuan akademik, atau hal-hal lain yang terkait dengan pendidikan?', '2025-09-30 23:02:56', 'assistant', 2, 1);

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
(3, 'Matematika', '/img/mtk.png', 'mtk', 10, NULL),
(5, 'IPA terpadu', '/img/ipa_1758732397872.png', '', 10, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `pembelian`
--

CREATE TABLE `pembelian` (
  `id_pembelian` int NOT NULL,
  `tanggal_pembelian` date NOT NULL,
  `status_pembayaran` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_user` int NOT NULL,
  `id_bab` int DEFAULT NULL,
  `id_course` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `pembelian`
--

INSERT INTO `pembelian` (`id_pembelian`, `tanggal_pembelian`, `status_pembayaran`, `id_user`, `id_bab`, `id_course`) VALUES
(1, '2025-09-26', 'Pending', 4, NULL, 5);

-- --------------------------------------------------------

--
-- Struktur dari tabel `point_pembelajaran`
--

CREATE TABLE `point_pembelajaran` (
  `id_point` int NOT NULL,
  `isi_point` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_course` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `point_pembelajaran`
--

INSERT INTO `point_pembelajaran` (`id_point`, `isi_point`, `id_course`) VALUES
(4, 'ds', 5),
(5, 'sd', 5),
(9, '123', 6),
(10, 'asd', 6),
(11, 'asd', 6);

-- --------------------------------------------------------

--
-- Struktur dari tabel `quiz`
--

CREATE TABLE `quiz` (
  `id_quiz` int NOT NULL,
  `nama_quiz` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` decimal(3,2) NOT NULL,
  `id_bab` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `quiz`
--

INSERT INTO `quiz` (`id_quiz`, `nama_quiz`, `rating`, `id_bab`) VALUES
(1, 'Matematika', 3.00, 1);

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

--
-- Dumping data untuk tabel `soal`
--

INSERT INTO `soal` (`id_soal`, `pertanyaan`, `opsi_a`, `opsi_b`, `opsi_c`, `opsi_d`, `jawaban`, `id_quiz`) VALUES
(1, 'pertinyiinyi', 'anjayy', 'betulll', 'salah', 'coba lagi', 'B', 1);

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
(1, 'Pengertian dan Contoh Data Tunggal', 'httpsss', 1, 1),
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
(2, 'newuser', 'newuser@email.com', '$argon2id$v=19$m=65536,t=3,p=4$TmrSuoDiPJV6qooKaY/c9w$C81rB/OD6TxZKifNvzCLCrteDtPTvuF1Boc5MZLX8YE', NULL, 'user'),
(3, 'faisal', 'fasial@gmail.com', '123456', NULL, 'user'),
(4, 'dimas', 'dimasbeler@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$hboZEmr6g6FN1nH4KW4TQQ$MbAhy2wl7BxMwOuy59FrQRugkt7h6S7Hwp162SuLW1s', NULL, 'user');

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
-- Indeks untuk tabel `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id_conversation`),
  ADD KEY `idx_user` (`id_user`),
  ADD KEY `idx_created` (`created_at`);

--
-- Indeks untuk tabel `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`id_course`),
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
  ADD KEY `id_user` (`id_user`),
  ADD KEY `idx_conversation` (`id_conversation`);

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
  ADD KEY `id_bab` (`id_bab`),
  ADD KEY `id_course` (`id_course`);

--
-- Indeks untuk tabel `point_pembelajaran`
--
ALTER TABLE `point_pembelajaran`
  ADD PRIMARY KEY (`id_point`),
  ADD KEY `fk_point_course` (`id_course`);

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
-- AUTO_INCREMENT untuk tabel `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id_conversation` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `course`
--
ALTER TABLE `course`
  MODIFY `id_course` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `guru`
--
ALTER TABLE `guru`
  MODIFY `id_guru` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `hasil`
--
ALTER TABLE `hasil`
  MODIFY `id_hasil` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `histori_chat`
--
ALTER TABLE `histori_chat`
  MODIFY `id_chat` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `jawaban_user`
--
ALTER TABLE `jawaban_user`
  MODIFY `id_jawaban` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `jenjang`
--
ALTER TABLE `jenjang`
  MODIFY `id_jenjang` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT untuk tabel `pelajaran`
--
ALTER TABLE `pelajaran`
  MODIFY `id_pelajaran` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `pembelian`
--
ALTER TABLE `pembelian`
  MODIFY `id_pembelian` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `point_pembelajaran`
--
ALTER TABLE `point_pembelajaran`
  MODIFY `id_point` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `quiz`
--
ALTER TABLE `quiz`
  MODIFY `id_quiz` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `soal`
--
ALTER TABLE `soal`
  MODIFY `id_soal` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `subbab`
--
ALTER TABLE `subbab`
  MODIFY `id_subbab` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
-- Ketidakleluasaan untuk tabel `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `fk_conversations_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `course`
--
ALTER TABLE `course`
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
  ADD CONSTRAINT `fk_histori_chat_conversation` FOREIGN KEY (`id_conversation`) REFERENCES `conversations` (`id_conversation`) ON DELETE CASCADE,
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
  ADD CONSTRAINT `pembelian_ibfk_2` FOREIGN KEY (`id_bab`) REFERENCES `bab` (`id_bab`),
  ADD CONSTRAINT `pembelian_ibfk_3` FOREIGN KEY (`id_course`) REFERENCES `course` (`id_course`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `point_pembelajaran`
--
ALTER TABLE `point_pembelajaran`
  ADD CONSTRAINT `fk_point_course` FOREIGN KEY (`id_course`) REFERENCES `course` (`id_course`) ON DELETE CASCADE ON UPDATE CASCADE;

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
