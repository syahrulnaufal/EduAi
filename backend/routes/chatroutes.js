import express from "express";
import { getHistory, clearHistory, sendMessage, debugSession, getConversations, createConversation, getConversationMessages, deleteConversation, renameConversation } from "../control/chatcontrol.js";
import { verifyUser } from "../middleware/auth.js"; 

const router = express.Router();

// semua route chat butuh login
router.get("/history", verifyUser, getHistory);
router.post("/send", verifyUser, sendMessage);
router.post("/clear", verifyUser, clearHistory);

// conversation management routes
router.get("/conversations", verifyUser, getConversations);
router.post("/conversations", verifyUser, createConversation);
router.get("/conversations/:id/messages", verifyUser, getConversationMessages);
router.delete("/conversations/:id", verifyUser, deleteConversation);
router.put("/conversations/:id", verifyUser, renameConversation);

// debug endpoint (opsional, untuk testing)
router.get("/debug-session", debugSession);

export default router;
