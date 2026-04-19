"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWishlist = exports.toggleWishlist = void 0;
const prisma_client_1 = __importDefault(require("../utils/prisma-client"));
const toggleWishlist = async (req, res) => {
    try {
        const { mealId } = req.body;
        const userId = req.user.userId;
        const existing = await prisma_client_1.default.wishlist.findUnique({
            where: {
                userId_mealId: { userId, mealId }
            }
        });
        if (existing) {
            await prisma_client_1.default.wishlist.delete({
                where: { id: existing.id }
            });
            return res.json({ message: "Removed from wishlist", status: "removed" });
        }
        else {
            await prisma_client_1.default.wishlist.create({
                data: { userId, mealId }
            });
            return res.status(201).json({ message: "Added to wishlist", status: "added" });
        }
    }
    catch (err) {
        console.error("Wishlist toggle error:", err);
        res.status(500).json({ message: "Failed to toggle wishlist" });
    }
};
exports.toggleWishlist = toggleWishlist;
const getWishlist = async (req, res) => {
    try {
        const userId = req.user.userId;
        const wishlist = await prisma_client_1.default.wishlist.findMany({
            where: { userId },
            include: {
                meal: {
                    include: { category: true, provider: { select: { name: true } } }
                }
            }
        });
        res.json(wishlist);
    }
    catch (err) {
        console.error("Get wishlist error:", err);
        res.status(500).json({ message: "Failed to get wishlist" });
    }
};
exports.getWishlist = getWishlist;
//# sourceMappingURL=wishlist.controller.js.map