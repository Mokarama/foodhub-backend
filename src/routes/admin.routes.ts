import express, { Request, Response } from "express";
const router = express.Router();

import prisma from "../utils/prisma-client";
import { getAllOrders } from "../controllers/order.controller";

import auth from "../middleware/auth.middleware";
import role from "../middleware/role.middleware";

// --- Users ---

// Get all users
router.get("/users", auth, role("ADMIN"), async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, status: true },
    });
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Ban / Unban user
router.patch("/users/:id", auth, role("ADMIN"), async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id as string }, // ✅ fixed
      data: { status },
      select: { id: true, name: true, email: true, role: true, status: true },
    });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// --- Orders ---

// Get all orders (admin overview)
router.get("/orders", auth, role("ADMIN"), getAllOrders);

// --- Categories ---

// Get all categories
router.get("/categories", auth, role("ADMIN"), async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Create category
router.post("/categories", auth, role("ADMIN"), async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.create({
      data: { name: req.body.name },
    });
    res.status(201).json(category);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Delete category
router.delete("/categories/:id", auth, role("ADMIN"), async (req: Request, res: Response) => {
  try {
    await prisma.category.delete({
      where: { id: req.params.id as string } 
    });
    res.json({ message: "Category deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;