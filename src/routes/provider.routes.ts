import express from "express";
const router = express.Router();

import { getAllProviders, getProviderById } from "../controllers/provider.controller";

router.get("/", getAllProviders);
router.get("/:id", getProviderById);

export default router;
