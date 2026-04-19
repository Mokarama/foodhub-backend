import express from "express";
const router = express.Router();

import { createReview, getReviews } from "../controllers/review.controller";

import auth from "../middleware/auth.middleware";
import role from "../middleware/role.middleware";

// Public: get reviews for a meal (?mealId=X)
router.get("/", getReviews);

// Customer only: submit a review
router.post("/", auth, role("CUSTOMER"), createReview);

export default router;