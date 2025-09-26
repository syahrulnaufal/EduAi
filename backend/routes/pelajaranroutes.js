// routes/pelajaran.js
import express from "express";
import upload from "../middleware/upload.js";
import { getAllpelajaran, addpelajaran, updatepelajaran, deletepelajaran } from "../control/pelajarancontrol.js";

const router = express.Router();

router.get("/", getAllpelajaran);
router.post("/", upload.single("icon"), addpelajaran);
router.put("/:id", upload.single("icon"), updatepelajaran);
router.delete("/:id", deletepelajaran);

export default router;
