import express from "express";
import { getQuizByBab, createQuiz, updateQuiz, deleteQuiz } from "../control/quizcontrol.js";

const router = express.Router();

// GET semua quiz per bab
router.get("/admin/:babId", getQuizByBab);

// CRUD
router.post("/", createQuiz);
router.put("/:id_quiz", updateQuiz);
router.delete("/:id_quiz", deleteQuiz);

export default router;
