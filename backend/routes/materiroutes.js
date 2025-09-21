import express from 'express';
import { getMateriByJenjang } from '../control/matericontrol.js';

const router = express.Router();

// GET /api/materi?jenjang=...
router.get('/', getMateriByJenjang);

export default router;