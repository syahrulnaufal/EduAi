import express from "express";
import { 
  getAllGuru, 
  getGuruById, 
  addGuru, 
  updateGuru, 
  deleteGuru 
} from "../control/gurucontrol.js";

const router = express.Router();

// Route utama guru
router.get("/", getAllGuru);
router.get("/:id", getGuruById);
router.post("/", addGuru);
router.put("/:id", updateGuru);
router.delete("/:id", deleteGuru);

export default router;
