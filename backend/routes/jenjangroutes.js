import express from 'express';
import { getAllJenjang, addJenjang, updateJenjang, deleteJenjang } from '../control/jenjangcontrol.js';

const router = express.Router();

router.get('/', getAllJenjang);
router.post('/', addJenjang);
router.put('/:id', updateJenjang);
router.delete('/:id', deleteJenjang);

export default router;
