import express from "express";
import {
  getAllCourse,
  getCourseById,
  addCourse,
  updateCourse,
  deleteCourse,
} from "../control/coursecontrol.js";

const router = express.Router();

router.get("/", getAllCourse);
router.get("/:id", getCourseById);
router.post("/", addCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;
