import express from "express";
const router = express.Router();

import { validateCoupon, createCoupon } from "../controllers/coupon.controller";

// Both of these are generally public/admin
router.post("/validate", validateCoupon);
router.post("/", createCoupon); // Used to quickly seed a coupon for testing

export default router;