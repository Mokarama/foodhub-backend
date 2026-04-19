import express from "express";
const router = express.Router();

import {
  createMeal,
  getMeals,
  getSingleMeal,
  updateMeal,
  deleteMeal,
} from "../controllers/meal.controller";

import auth from "../middleware/auth.middleware";
import role from "../middleware/role.middleware";
import upload from "../utils/multer.config";

// Public
router.get("/", getMeals);
router.get("/:id", getSingleMeal);

// Provider only (and Admin for delete)
router.post("/", auth, role("PROVIDER"), upload.single('image'), createMeal);
router.put("/:id", auth, role("PROVIDER"), upload.single('image'), updateMeal);
router.delete("/:id", auth, role("PROVIDER", "ADMIN"), deleteMeal);

export default router;