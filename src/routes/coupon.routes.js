const express = require("express");
const router = express.Router();
const { validateCoupon, createCoupon } = require("../controllers/coupon.controller");

// Both of these are generally public/admin
router.post("/validate", validateCoupon);
router.post("/", createCoupon); // Used to quickly seed a coupon for testing

module.exports = router;
