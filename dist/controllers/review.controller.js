"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviews = exports.createReview = void 0;
const prisma_client_1 = __importDefault(require("../utils/prisma-client"));
const validation_1 = require("../utils/validation");
// Create Review
const createReview = async (req, res) => {
    try {
        const { mealId, rating, comment } = req.body;
        // Validation
        if (!mealId || !rating) {
            return res.status(400).json({ message: "mealId and rating are required" });
        }
        if (!(0, validation_1.validateRating)(rating)) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }
        // Check if meal exists
        const meal = await prisma_client_1.default.meal.findUnique({ where: { id: mealId } });
        if (!meal) {
            return res.status(404).json({ message: "Meal not found" });
        }
        const review = await prisma_client_1.default.review.create({
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
    }
    catch (err) {
        console.error("Create review error:", err);
        res.status(500).json({ message: err.message });
    }
};
exports.createReview = createReview;
// Get Reviews for a Meal (?mealId=X)
const getReviews = async (req, res) => {
    try {
        const { mealId } = req.query;
        const reviews = await prisma_client_1.default.review.findMany({
            where: mealId ? { mealId: mealId } : {}, // ✅ ONLY FIXED LINE
            include: {
                user: { select: { id: true, name: true } },
            },
            orderBy: { id: "desc" },
        });
        res.json(reviews);
    }
    catch (err) {
        console.error("Get reviews error:", err);
        res.status(500).json({ message: err.message });
    }
};
exports.getReviews = getReviews;
//# sourceMappingURL=review.controller.js.map