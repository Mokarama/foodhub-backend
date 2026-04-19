import express from "express";
const router = express.Router();

import { getAllFoodImages } from "../controllers/foodImage.controller";

router.get("/images", getAllFoodImages);

export default router;