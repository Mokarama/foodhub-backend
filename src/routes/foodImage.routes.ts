import express from "express";
const router = express.Router();

import { getAllFoodImages } from "../controllers/foodImage.controller";
// Support both /api/foods and /api/foods/images endpoints
router.get("/", getAllFoodImages);router.get("/", getAllFoodImages);

export default router;