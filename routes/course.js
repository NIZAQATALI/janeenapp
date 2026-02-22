import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  updateCoursePdf,
} from "../Controllers/courseController.js";
import { verifyAdmin ,verifyJWT} from "../utils/verifyToken.js";
import { upload } from "../MiddleWares/multer.middleware.js";
const router = express.Router();
router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.post("/create", upload.single("thumbnail"),verifyJWT, verifyAdmin, createCourse);
router.put("/update/:id", upload.single("thumbnail"), verifyJWT, verifyAdmin, updateCourse);
router.put(
  "/:id/upload-pdf",
  upload.single("pdf"),
  updateCoursePdf
);
router.delete("/:id", verifyJWT, verifyAdmin, deleteCourse);

export default router;