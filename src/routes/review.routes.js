const express = require("express");
const router = express.Router();

const { createReview, getReviews } = require("../controllers/review.controller");

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

// Public: get reviews for a meal (?mealId=X)
router.get("/", getReviews);

// Customer only: submit a review
router.post("/", auth, role("CUSTOMER"), createReview);

module.exports = router;
