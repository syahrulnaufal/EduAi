import express from "express";
import { getSoalByQuiz, createSoal, updateSoal, deleteSoal } from "../control/soalcontrol.js";

const router = express.Router();

router.get("/:id_quiz", getSoalByQuiz);       // GET semua soal berdasarkan id_quiz
router.post("/", createSoal);                // Tambah soal
router.put("/:id_soal", updateSoal);         // Update soal
router.delete("/:id_soal", deleteSoal);      // Hapus soal

export default router;
