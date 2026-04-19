const express = require("express");
const router = express.Router();

const {
  createMeal,
  getMeals,
  getSingleMeal,
  updateMeal,
  deleteMeal,
} = require("../controllers/meal.controller");

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const upload = require("../utils/multer.config");

// Public
router.get("/", getMeals);
router.get("/:id", getSingleMeal);

// Provider only (and Admin for delete)
router.post("/", auth, role("PROVIDER"), upload.single('image'), createMeal);
router.put("/:id", auth, role("PROVIDER"), upload.single('image'), updateMeal);
router.delete("/:id", auth, role("PROVIDER", "ADMIN"), deleteMeal);

module.exports = router;