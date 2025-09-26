import express from "express";
import { 
  getSubbabByBab, 
  createSubbab, 
  updateSubbab, 
  deleteSubbab, 
  getSubbabAdmin 
} from "../control/subbabcontrol.js";

const router = express.Router();

// GET /api/subbab?id_bab=2 → ambil subbab berdasarkan id_bab (query)
router.get("/", getSubbabByBab);

// GET /api/subbab/admin/:id_bab → ambil subbab lengkap dengan join
router.get("/admin/:id_bab", getSubbabAdmin);

// POST /api/subbab → tambah subbab
router.post("/", createSubbab);

// PUT /api/subbab/:id_subbab → update subbab
router.put("/:id_subbab", updateSubbab);

// DELETE /api/subbab/:id_subbab → hapus subbab
router.delete("/:id_subbab", deleteSubbab);

export default router;
