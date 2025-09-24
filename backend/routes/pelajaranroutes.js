import express from 'express';
import { getAllpelajaran, addpelajaran, updatepelajaran, deletepelajaran } from '../control/pelajarancontrol.js';

const router = express.Router();

router.get('/', getAllpelajaran);
router.post('/', addpelajaran);
router.put('/:id', updatepelajaran);
router.delete('/:id', deletepelajaran);

export default router;

