const express = require("express");
const router = express.Router();

const { createCategory, getCategories } = require("../controllers/category.controller");

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

// Public
router.get("/", getCategories);

// Admin only
router.post("/", auth, role("ADMIN"), createCategory);

module.exports = router;