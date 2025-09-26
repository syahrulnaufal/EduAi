import express from "express";
import {
  getAllPembelian,
  getPembelianById,
  addPembelian,
  updatePembelianStatus,
  deletePembelian,
} from "../control/pembeliancontrol.js";

const router = express.Router();

router.get("/", getAllPembelian);
router.get("/:id", getPembelianById);
router.post("/", addPembelian);
router.put("/:id", updatePembelianStatus);
router.delete("/:id", deletePembelian);

export default router;
