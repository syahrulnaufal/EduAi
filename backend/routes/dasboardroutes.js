import express from "express";
import { getDashboard } from "../control/dasboardcontrol.js";

const router = express.Router();

router.get("/", getDashboard);

export default router;
