import { Request, Response } from "express";
import prisma from "../utils/prisma-client";

export const getAllFoodImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const images = await prisma.foodImage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(images);
  } catch (err: any) {
    console.error("Get food images error:", err);
    res.status(500).json({ message: "Failed to fetch food images", error: err.message });
  }
};