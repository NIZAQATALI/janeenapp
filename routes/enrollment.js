import express from "express";
import { enrollStudent } from "../Controllers/enrollmentController.js";
import { verifyAdmin ,verifyJWT} from "../utils/verifyToken.js";


const router = express.Router();

router.post("/enroll", verifyJWT, enrollStudent);

export default router;