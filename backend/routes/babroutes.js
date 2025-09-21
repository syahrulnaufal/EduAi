import express from 'express';
import { getBabAndProgresByPelajaran, getallbab } from '../control/babcontrol.js';

const router = express.Router();

// GET /api/bab-progres?id_pelajaran=2
router.get("/bab-progres", getBabAndProgresByPelajaran);
router.get("/bab-all", getallbab);

export default router;