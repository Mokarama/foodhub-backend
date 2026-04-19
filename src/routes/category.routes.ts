import express from "express";
const router = express.Router();

import { createCategory, getCategories } from "../controllers/category.controller";

import auth from "../middleware/auth.middleware";
import role from "../middleware/role.middleware";

// Public
router.get("/", getCategories);

// Admin only
router.post("/", auth, role("ADMIN"), createCategory);

export default router;