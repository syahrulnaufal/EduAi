-- Script untuk menambahkan fitur conversation management
-- Tanggal: 2025-01-15

-- 1. Buat tabel conversations
CREATE TABLE IF NOT EXISTS `conversations` (
  `id_conversation` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_conversation`),
  KEY `idx_user` (`id_user`),
  KEY `idx_created` (`created_at`),
  CONSTRAINT `fk_conversations_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tambah kolom id_conversation ke tabel histori_chat
ALTER TABLE `histori_chat` 
ADD COLUMN `id_conversation` int DEFAULT NULL AFTER `id_user`;

-- 3. Tambah foreign key constraint
ALTER TABLE `histori_chat` 
ADD CONSTRAINT `fk_histori_chat_conversation` 
FOREIGN KEY (`id_conversation`) REFERENCES `conversations` (`id_conversation`) ON DELETE CASCADE;

-- 4. Buat index untuk performa
ALTER TABLE `histori_chat` 
ADD INDEX `idx_conversation` (`id_conversation`);

-- 5. Create default conversation for existing chat history
-- First, create conversations for users who already have chat history
INSERT INTO `conversations` (`id_user`, `title`, `created_at`)
SELECT DISTINCT 
    `id_user`, 
    'Percakapan Sebelumnya', 
    MIN(`tanggal`) as created_at
FROM `histori_chat` 
WHERE `id_user` IS NOT NULL
GROUP BY `id_user`;

-- 6. Update existing chat messages to associate with the default conversation
UPDATE `histori_chat` h
JOIN (
    SELECT 
        c.id_conversation,
        c.id_user
    FROM `conversations` c
    WHERE c.title = 'Percakapan Sebelumnya'
) conv ON h.id_user = conv.id_user
SET h.id_conversation = conv.id_conversation
WHERE h.id_conversation IS NULL;

-- 7. View untuk memeriksa hasil
-- SELECT 
--     c.id_conversation,
--     c.title,
--     c.id_user,
--     u.username,
--     COUNT(h.id_chat) as message_count,
--     c.created_at,
--     c.updated_at
-- FROM conversations c
-- JOIN users u ON c.id_user = u.id_user
-- LEFT JOIN histori_chat h ON c.id_conversation = h.id_conversation
-- GROUP BY c.id_conversation, c.title, c.id_user, u.username, c.created_at, c.updated_at
-- ORDER BY c.updated_at DESC;