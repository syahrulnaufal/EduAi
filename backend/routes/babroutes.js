import express from 'express';
import upload from "../middleware/upload.js";
import { getBabAndProgresByPelajaran, 
    getallbab, 
    getBabByPelajaran, 
    addBab, 
    updateBab, 
    deleteBab } from '../control/babcontrol.js';

const router = express.Router();

// GET /api/bab-progres?id_pelajaran=2
router.get("/bab-progres", getBabAndProgresByPelajaran);
router.get("/bab-all", getallbab);

// CRUD Bab untuk Admin
router.get("/pelajaran/:id_pelajaran", getBabByPelajaran);
router.post("/", upload.single("icon"), addBab);
router.put("/:id", upload.single("icon"), updateBab);
router.delete("/:id", deleteBab);

export default router;