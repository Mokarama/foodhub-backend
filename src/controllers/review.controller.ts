import { Request, Response } from "express";
import prisma from "../utils/prisma-client";
import { validateRating } from "../utils/validation";

// Create Review
export const createReview = async (req: any, res: Response): Promise<any> => {
    try {
        const { mealId, rating, comment } = req.body;

        // Validation
        if (!mealId || !rating) {
            return res.status(400).json({ message: "mealId and rating are required" });
        }

        if (!validateRating(rating)) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        // Check if meal exists
        const meal = await prisma.meal.findUnique({ where: { id: mealId } });
        if (!meal) {
            return res.status(404).json({ message: "Meal not found" });
        }

        const review = await prisma.review.create({
            data: {
                mealId,
                rating: parseInt(rating),
                comment: comment || "",
                userId: req.user.userId,
            },
            include: {
                user: { select: { id: true, name: true } },
            },
        });

        res.status(201).json(review);
    } catch (err: any) {
        console.error("Create review error:", err);
        res.status(500).json({ message: err.message });
    }
};

// Get Reviews for a Meal (?mealId=X)
export const getReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { mealId } = req.query;

        const reviews = await prisma.review.findMany({
            where: mealId ? { mealId } : {},
            include: {
                user: { select: { id: true, name: true } },
            },
            orderBy: { id: "desc" },
        });

        res.json(reviews);
    } catch (err: any) {
        console.error("Get reviews error:", err);
        res.status(500).json({ message: err.message });
    }
};