import express from "express";



import { verifyJWT, verifyAdmin } from "../utils/verifyToken.js";
import { addStage, createCategory, deleteCategory, deleteStage, getAllCategories, getCategoryById, getUserStageContent, updateCategory, updateStage } from "../Controllers/contentCategoryContoller.js";

const router = express.Router();


/* CATEGORY CRUD */

router.post(
  "/category",
  verifyJWT,
  verifyAdmin,
  createCategory
);

router.get(
  "/category",
  verifyJWT,
  getAllCategories
);

router.get(
  "/category/:id",
  verifyJWT,
  getCategoryById
);

router.put(
  "/category/:id",
  verifyJWT,
  verifyAdmin,
  updateCategory
);

router.delete(
  "/category/:id",
  verifyJWT,
  verifyAdmin,
  deleteCategory
);


/* STAGE CRUD */

router.post(
  "/category/:categoryId/stage",
  verifyJWT,
  verifyAdmin,
  addStage
);

router.put(
  "/category/:categoryId/stage/:stageId",
  verifyJWT,
  verifyAdmin,
  updateStage
);

router.delete(
  "/category/:categoryId/stage/:stageId",
  verifyJWT,
  verifyAdmin,
  deleteStage
);


/* USER CONTENT */

router.get(
  "/:category",
  verifyJWT,
  getUserStageContent
);


export default router;