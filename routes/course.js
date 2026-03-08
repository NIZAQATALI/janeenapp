import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  updateCoursePdf,
  addMediaBlock,
  addGalleryBlock,
  addQuizBlock,
  deleteContentBlock,
  updateContentBlock,
  addNoteBlock,
} from "../Controllers/courseController.js";
import { checkEnrollment, verifyAdmin ,verifyJWT} from "../utils/verifyToken.js";
import { upload } from "../MiddleWares/multer.middleware.js";
const router = express.Router();
router.get("/", verifyJWT, getAllCourses);
router.get("/:id",checkEnrollment, verifyJWT, getCourseById);
router.post("/create", upload.single("thumbnail"),verifyJWT, verifyAdmin, createCourse);
router.put("/update/:id", upload.single("thumbnail"), verifyJWT, verifyAdmin, updateCourse);
router.put(
  "/:id/upload-pdf",
  upload.single("pdf"),
  updateCoursePdf
);
router.delete("/:id", verifyJWT, verifyAdmin, deleteCourse);
router.post("/:id/add-note", verifyJWT, verifyAdmin, addNoteBlock);

router.post("/:id/add-media",
  upload.single("media"),
  verifyJWT,
  verifyAdmin,
  addMediaBlock
);

router.post("/:id/add-gallery",
  upload.array("images", 10),
  verifyJWT,
  verifyAdmin,
  addGalleryBlock
);

router.post("/:id/add-quiz",
  verifyJWT,
  verifyAdmin,
  addQuizBlock
);

router.delete("/:id/content/:contentId",
  verifyJWT,
  verifyAdmin,
  deleteContentBlock
);

router.put(
  "/:id/content/:contentId",
  upload.fields([
    { name: "media", maxCount: 1 },
    { name: "images", maxCount: 10 }
  ]),
  verifyJWT,
  verifyAdmin,
  updateContentBlock
);

export default router;