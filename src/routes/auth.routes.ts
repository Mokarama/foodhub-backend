import express from "express";
const router = express.Router();

import { register, login, me } from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);

export default router;