import express from "express";
import { getSubbabByBab, updateSubbab,deleteSubbab } from "../control/subbabcontrol.js";

const router = express.Router();

// GET /api/subbab?id_bab=2
router.get("/", getSubbabByBab);
router.put("/delete:id_subbab", updateSubbab);
router.delete("/delete:id_subbab", deleteSubbab);

export default router;
