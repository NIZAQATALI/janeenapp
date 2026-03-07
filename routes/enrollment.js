import express from "express";
import { enrollStudent, getCourseStudents, getUserCourses } from "../Controllers/enrollmentController.js";
import { verifyAdmin ,verifyJWT} from "../utils/verifyToken.js";


const router = express.Router();

router.post("/enroll", verifyJWT, enrollStudent);
router.get("/usercourses", verifyJWT, getUserCourses);
router.get("/get-course-students", verifyJWT,verifyAdmin, getCourseStudents);

export default router;