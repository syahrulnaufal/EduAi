import db from "../db.js";
import dotenv from "dotenv";
import Groq from "groq-sdk";

// Optional: load .env
dotenv.config();

console.log("DEBUG: GROQ_API_KEY =", process.env.GROQ_API_KEY ? "ADA ✅" : "TIDAK ADA ❌");
console.log("DEBUG: GROQ_MODEL =", process.env.GROQ_MODEL || "Belum di-set");

// Helper ambil userId dari session 
function getUserIdFromSession(req) {
  console.log("🔍 Session debug:", {
    hasSession: !!req.session,
    sessionData: req.session,
    hasUser: !!req.session?.user,
    userData: req.session?.user
  });
  
  return (
    req.session?.user?.id ||         // dari login response
    req.session?.user?.id_user ||    // kebiasaan projek kamu
    req.session?.userId ||           // ada juga yang pakai ini
    null
  );
}

// ===== Optional GROQ client =====
let groqClient = null;
try {
  if (process.env.GROQ_API_KEY) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
    console.log("Groq client berhasil dibuat 🚀");
  } else {
    console.log("GROQ_API_KEY tidak ditemukan, Groq client tidak dibuat ❌");
  }
} catch { /* ignore */ }

// Kamu adalah asisten "EDU AI" yang membantu pelajar Indonesia belajar sains (Matematika, Fisika, Kimia, Biologi)
// Jawablah ringkas, jelas, dan dalam Bahasa Indonesia
// Jika perlu, beri langkah-langkah dan contoh soal
const SYSTEM_PROMPT = `
Kamu adalah Dimas, asisten AI ramah yang selalu berbicara dalam bahasa Indonesia. 
Peranmu fokus pada topik pendidikan (sekolah, kuliah, mata pelajaran, pedagogi, kurikulum, beasiswa, belajar efektif, psikologi belajar, teknik mengajar, riset akademik, dan karier di bidang edukasi). 
Jika pertanyaan di luar pendidikan, tolak dengan sopan dan arahkan pengguna agar menanyakan hal terkait pendidikan. 
Jawaban harus singkat, jelas, dan membantu, sertakan langkah-langkah atau contoh soal serta cara menjawabnya jika relevan.
`;

// GET /chat/history?limit=50
export const getHistory = async (req, res) => {
  try {
    const userId = getUserIdFromSession(req);
    console.log("🔍 Getting history for user ID:", userId);
    
    if (!userId) {
      console.log("❌ No user ID found in session");
      return res.status(401).json({ msg: "Silakan login dulu" });
    }

    const limit = Math.min(parseInt(req.query.limit || "50", 10) || 50, 200);
    const [rows] = await db.query(
      `SELECT id_chat, isi_chat, tanggal, role, id_user
       FROM histori_chat
       WHERE id_user = ?
       ORDER BY tanggal ASC, id_chat ASC
       LIMIT ?`,
      [userId, limit]
    );

    console.log(`📚 Found ${rows.length} chat messages for user ${userId}`);
    return res.json(rows);
  } catch (err) {
    console.error("getHistory error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// POST /chat/clear
export const clearHistory = async (req, res) => {
  try {
    const userId = getUserIdFromSession(req);
    if (!userId) return res.status(401).json({ msg: "Silakan login dulu" });

    await db.query(`DELETE FROM histori_chat WHERE id_user = ?`, [userId]);
    return res.json({ msg: "History dihapus" });
  } catch (err) {
    console.error("clearHistory error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// POST /chat/send { message: string, conversationId?: number }
export const sendMessage = async (req, res) => {
  try {
    const userId = getUserIdFromSession(req);
    console.log("💬 Sending message for user ID:", userId);
    
    if (!userId) {
      console.log("❌ No user ID found in session for sending message");
      return res.status(401).json({ msg: "Silakan login dulu" });
    }

    const message = (req.body?.message || "").toString().trim();
    let conversationId = req.body?.conversationId;
    
    if (!message) return res.status(400).json({ msg: "Field 'message' wajib diisi" });

    // Jika tidak ada conversationId, buat conversation baru
    if (!conversationId) {
      console.log("🆕 No conversation ID provided, creating new conversation...");
      const conversationTitle = message.length > 50 ? message.substring(0, 50) + '...' : message;
      
      const [result] = await db.query(
        `INSERT INTO conversations (id_user, title) VALUES (?, ?)`,
        [userId, conversationTitle]
      );
      
      conversationId = result.insertId;
      console.log(`✅ Created new conversation with ID: ${conversationId}`);
    } else {
      // Verifikasi bahwa conversation ini milik user yang login
      const [convCheck] = await db.query(
        `SELECT id_conversation FROM conversations WHERE id_conversation = ? AND id_user = ?`,
        [conversationId, userId]
      );

      if (convCheck.length === 0) {
        console.log(`❌ Conversation ${conversationId} not found or not owned by user ${userId}`);
        return res.status(404).json({ msg: "Conversation tidak ditemukan" });
      }
    }

    console.log("💾 Saving user message to database...");
    // 1) simpan pesan user dengan conversation ID
    await db.query(
      `INSERT INTO histori_chat (id_user, id_conversation, role, isi_chat, tanggal) VALUES (?, ?, 'user', ?, NOW())`,
      [userId, conversationId, message]
    );

    // 2) ambil history terakhir untuk konteks dari conversation yang sama
    const contextLimit = 20;
    const [rows] = await db.query(
      `SELECT role, isi_chat
       FROM histori_chat
       WHERE id_conversation = ?
       ORDER BY tanggal DESC, id_chat DESC
       LIMIT ?`,
      [conversationId, contextLimit]
    );

    const historyAsc = rows.reverse(); // urut naik (terdahulu -> terbaru)

    // 3) susun messages untuk GROQ
    const aiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...historyAsc.map((m) => ({
        role: (m.role && m.role.toLowerCase() === "assistant") ? "assistant" : "user",
        content: m.isi_chat,
      }))
    ];

    // 4) panggil GROQ (jika aktif)
    let replyText = "Fitur AI belum diaktifkan di server (VITE_GROQ_API_KEY tidak ditemukan). Pesanmu sudah tersimpan.";

    if (groqClient) {
      try {
        // NOTE: API usage depends on groq SDK version. This code is for groq-sdk@latest (chat.completions.create)
        const completion = await groqClient.chat.completions.create({
          model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
          messages: aiMessages,
          temperature: parseFloat(process.env.GROQ_TEMP || "0.5"),
        });

        replyText = completion?.choices?.[0]?.message?.content?.trim() || "Maaf, aku tidak menemukan jawaban.";
      } catch (err) {
        console.error("Groq error:", err);
        replyText = "Terjadi kesalahan saat menghubungi AI.";
      }
    }

    console.log("💾 Saving AI response to database...");
    // 5) simpan jawaban AI ke conversation yang sama
    await db.query(
      `INSERT INTO histori_chat (id_user, id_conversation, role, isi_chat, tanggal) VALUES (?, ?, 'assistant', ?, NOW())`,
      [userId, conversationId, replyText]
    );

    // Update conversation timestamp
    await db.query(
      `UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id_conversation = ?`,
      [conversationId]
    );

    console.log("✅ Message exchange completed successfully");
    // 6) kirim balik ke frontend dengan conversation ID
    return res.json({ reply: replyText, conversationId: conversationId });
  } catch (err) {
    console.error("sendMessage error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// GET /chat/debug-session - endpoint untuk debugging session
export const debugSession = async (req, res) => {
  try {
    const userId = getUserIdFromSession(req);
    const sessionInfo = {
      hasSession: !!req.session,
      hasUser: !!req.session?.user,
      userId: userId,
      userInfo: req.session?.user || null,
      timestamp: new Date().toISOString()
    };
    
    console.log("🔧 Debug session info:", sessionInfo);
    return res.json(sessionInfo);
  } catch (err) {
    console.error("debugSession error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// ===== CONVERSATION MANAGEMENT =====

// GET /chat/conversations - mendapatkan daftar conversations per user
export const getConversations = async (req, res) => {
  try {
    const userId = getUserIdFromSession(req);
    console.log("📋 Getting conversations for user ID:", userId);
    
    if (!userId) {
      console.log("❌ No user ID found in session");
      return res.status(401).json({ msg: "Silakan login dulu" });
    }

    const [rows] = await db.query(
      `SELECT c.id_conversation, c.title, c.created_at, c.updated_at,
              COUNT(h.id_chat) as message_count,
              MAX(h.tanggal) as last_message_time
       FROM conversations c
       LEFT JOIN histori_chat h ON c.id_conversation = h.id_conversation
       WHERE c.id_user = ?
       GROUP BY c.id_conversation, c.title, c.created_at, c.updated_at
       ORDER BY c.updated_at DESC
       LIMIT 50`,
      [userId]
    );

    console.log(`📚 Found ${rows.length} conversations for user ${userId}`);
    return res.json(rows);
  } catch (err) {
    console.error("getConversations error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// POST /chat/conversations - membuat conversation baru
export const createConversation = async (req, res) => {
  try {
    const userId = getUserIdFromSession(req);
    console.log("➕ Creating new conversation for user ID:", userId);
    
    if (!userId) {
      console.log("❌ No user ID found in session");
      return res.status(401).json({ msg: "Silakan login dulu" });
    }

    const { title } = req.body;
    const conversationTitle = title || `Chat Baru - ${new Date().toLocaleString('id-ID')}`;

    const [result] = await db.query(
      `INSERT INTO conversations (id_user, title) VALUES (?, ?)`,
      [userId, conversationTitle]
    );

    const newConversationId = result.insertId;
    console.log(`✅ Created new conversation with ID: ${newConversationId}`);
    
    return res.json({ 
      id_conversation: newConversationId, 
      title: conversationTitle,
      message: "Conversation berhasil dibuat" 
    });
  } catch (err) {
    console.error("createConversation error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// GET /chat/conversations/:id/messages - mendapatkan messages dari conversation tertentu
export const getConversationMessages = async (req, res) => {
  try {
    const userId = getUserIdFromSession(req);
    const conversationId = req.params.id;
    
    console.log(`💬 Getting messages for conversation ${conversationId}, user ${userId}`);
    
    if (!userId) {
      console.log("❌ No user ID found in session");
      return res.status(401).json({ msg: "Silakan login dulu" });
    }

    // Verifikasi bahwa conversation ini milik user yang login
    const [convCheck] = await db.query(
      `SELECT id_conversation FROM conversations WHERE id_conversation = ? AND id_user = ?`,
      [conversationId, userId]
    );

    if (convCheck.length === 0) {
      console.log(`❌ Conversation ${conversationId} not found or not owned by user ${userId}`);
      return res.status(404).json({ msg: "Conversation tidak ditemukan" });
    }

    const limit = Math.min(parseInt(req.query.limit || "50", 10) || 50, 200);
    const [rows] = await db.query(
      `SELECT id_chat, isi_chat, tanggal, role, id_user, id_conversation
       FROM histori_chat
       WHERE id_conversation = ?
       ORDER BY tanggal ASC, id_chat ASC
       LIMIT ?`,
      [conversationId, limit]
    );

    console.log(`📚 Found ${rows.length} messages for conversation ${conversationId}`);
    return res.json(rows);
  } catch (err) {
    console.error("getConversationMessages error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// DELETE /chat/conversations/:id - menghapus conversation
export const deleteConversation = async (req, res) => {
  try {
    const userId = getUserIdFromSession(req);
    const conversationId = req.params.id;
    
    console.log(`🗑️ Deleting conversation ${conversationId} for user ${userId}`);
    
    if (!userId) {
      console.log("❌ No user ID found in session");
      return res.status(401).json({ msg: "Silakan login dulu" });
    }

    // Verifikasi bahwa conversation ini milik user yang login
    const [convCheck] = await db.query(
      `SELECT id_conversation FROM conversations WHERE id_conversation = ? AND id_user = ?`,
      [conversationId, userId]
    );

    if (convCheck.length === 0) {
      console.log(`❌ Conversation ${conversationId} not found or not owned by user ${userId}`);
      return res.status(404).json({ msg: "Conversation tidak ditemukan" });
    }

    // Hapus conversation (histori_chat akan terhapus otomatis karena CASCADE)
    await db.query(
      `DELETE FROM conversations WHERE id_conversation = ? AND id_user = ?`,
      [conversationId, userId]
    );

    console.log(`✅ Successfully deleted conversation ${conversationId}`);
    return res.json({ msg: "Conversation berhasil dihapus" });
  } catch (err) {
    console.error("deleteConversation error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// PUT /chat/conversations/:id - mengubah nama conversation
export const renameConversation = async (req, res) => {
  try {
    const userId = getUserIdFromSession(req);
    const conversationId = req.params.id;
    const { title } = req.body;
    
    console.log(`✏️ Renaming conversation ${conversationId} for user ${userId} to: "${title}"`);
    
    if (!userId) {
      console.log("❌ No user ID found in session");
      return res.status(401).json({ msg: "Silakan login dulu" });
    }

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ msg: "Nama conversation tidak boleh kosong" });
    }

    const newTitle = title.trim();
    if (newTitle.length > 255) {
      return res.status(400).json({ msg: "Nama conversation terlalu panjang (maksimal 255 karakter)" });
    }

    // Verifikasi bahwa conversation ini milik user yang login
    const [convCheck] = await db.query(
      `SELECT id_conversation FROM conversations WHERE id_conversation = ? AND id_user = ?`,
      [conversationId, userId]
    );

    if (convCheck.length === 0) {
      console.log(`❌ Conversation ${conversationId} not found or not owned by user ${userId}`);
      return res.status(404).json({ msg: "Conversation tidak ditemukan" });
    }

    // Update nama conversation
    await db.query(
      `UPDATE conversations SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id_conversation = ? AND id_user = ?`,
      [newTitle, conversationId, userId]
    );

    console.log(`✅ Successfully renamed conversation ${conversationId} to: "${newTitle}"`);
    return res.json({ 
      msg: "Nama conversation berhasil diubah",
      title: newTitle 
    });
  } catch (err) {
    console.error("renameConversation error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};
