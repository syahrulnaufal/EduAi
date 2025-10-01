import express from "express";
import { getSoalByQuiz, 
    createSoal, updateSoal, 
    deleteSoal, startHasil,
    submitHasil, saveJawaban, 
    getJawabanByHasil, getHasilById,getPembahasan } from "../control/soalcontrol.js";

const router = express.Router();

router.get("/:id_quiz", getSoalByQuiz);       // GET semua soal berdasarkan id_quiz
router.post("/", createSoal);                // Tambah soal
router.put("/:id_soal", updateSoal);         // Update soal
router.delete("/:id_soal", deleteSoal);      // Hapus soal
// hasil
router.post("/hasil/start", startHasil);
router.post("/hasil/submit", submitHasil);

// jawaban user
router.post("/hasil/save", saveJawaban);
router.get("/jawaban/:id_hasil", getJawabanByHasil);
router.get("/hasil/:id_hasil", getHasilById);
router.get("/pembahasan/:id_quiz/:id_hasil", getPembahasan);

export default router;
