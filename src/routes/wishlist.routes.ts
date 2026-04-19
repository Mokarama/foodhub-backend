import express from "express";
const router = express.Router();

import { toggleWishlist, getWishlist } from "../controllers/wishlist.controller";
import authMiddleware from "../middleware/auth.middleware";

router.post("/", authMiddleware, toggleWishlist);
router.get("/", authMiddleware, getWishlist);

export default router;