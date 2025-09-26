import express from 'express';
import { getAllJenjang, addJenjang, updateJenjang, deleteJenjang,getJenjangByNama } from '../control/jenjangcontrol.js';

const router = express.Router();
router.get('/nama/:nama', getJenjangByNama);
router.get('/', getAllJenjang);
router.post('/', addJenjang);
router.put('/:id', updateJenjang);
router.delete('/:id', deleteJenjang);

export default router;
