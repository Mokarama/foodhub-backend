"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFoodImages = void 0;
const prisma_client_1 = __importDefault(require("../utils/prisma-client"));
const getAllFoodImages = async (req, res) => {
    try {
        const images = await prisma_client_1.default.foodImage.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(images);
    }
    catch (err) {
        console.error("Get food images error:", err);
        res.status(500).json({ message: "Failed to fetch food images", error: err.message });
    }
};
exports.getAllFoodImages = getAllFoodImages;
//# sourceMappingURL=foodImage.controller.js.map