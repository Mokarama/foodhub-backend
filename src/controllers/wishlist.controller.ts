import { Request, Response } from "express";
import prisma from "../utils/prisma-client";

export const toggleWishlist = async (req: any, res: Response): Promise<any> => {
  try {
    const { mealId } = req.body;
    const userId = req.user.userId;

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_mealId: { userId, mealId }
      }
    });

    if (existing) {
      await prisma.wishlist.delete({
        where: { id: existing.id }
      });
      return res.json({ message: "Removed from wishlist", status: "removed" });
    } else {
      await prisma.wishlist.create({
        data: { userId, mealId }
      });
      return res.status(201).json({ message: "Added to wishlist", status: "added" });
    }
  } catch (err: any) {
    console.error("Wishlist toggle error:", err);
    res.status(500).json({ message: "Failed to toggle wishlist" });
  }
};

export const getWishlist = async (req: any, res: Response): Promise<any> => {
  try {
    const userId = req.user.userId;
    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        meal: {
          include: { category: true, provider: { select: { name: true } } }
        }
      }
    });
    res.json(wishlist);
  } catch (err: any) {
    console.error("Get wishlist error:", err);
    res.status(500).json({ message: "Failed to get wishlist" });
  }
};