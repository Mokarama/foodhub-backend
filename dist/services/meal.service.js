"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMeal = exports.updateMeal = exports.getMealById = exports.getMeals = exports.createMeal = void 0;
const prisma_client_1 = __importDefault(require("../utils/prisma-client"));
// Create
const createMeal = async (userId, data) => {
    return await prisma_client_1.default.meal.create({
        data: {
            name: data.name,
            price: parseFloat(data.price),
            description: data.description,
            image: data.image,
            providerId: userId,
            categoryId: data.categoryId,
        },
    });
};
exports.createMeal = createMeal;
// Get All (with optional filters: categoryId, minPrice, maxPrice)
const getMeals = async (filters = {}) => {
    const where = {};
    if (filters.categoryId) {
        where.categoryId = filters.categoryId;
    }
    if (filters.minPrice || filters.maxPrice) {
        where.price = {};
        if (filters.minPrice)
            where.price.gte = parseFloat(filters.minPrice);
        if (filters.maxPrice)
            where.price.lte = parseFloat(filters.maxPrice);
    }
    return await prisma_client_1.default.meal.findMany({
        where,
        include: {
            category: true,
            provider: {
                select: { id: true, name: true },
            },
        },
    });
};
exports.getMeals = getMeals;
// Get Single
const getMealById = async (id) => {
    const meal = await prisma_client_1.default.meal.findUnique({
        where: { id },
        include: {
            category: true,
            provider: {
                select: { id: true, name: true },
            },
            reviews: {
                include: {
                    user: { select: { id: true, name: true } },
                },
            },
        },
    });
    if (!meal) {
        throw new Error("Meal not found");
    }
    return meal;
};
exports.getMealById = getMealById;
// Update
const updateMeal = async (id, data) => {
    if (data.price) {
        data.price = parseFloat(data.price);
    }
    return await prisma_client_1.default.meal.update({
        where: { id },
        data,
    });
};
exports.updateMeal = updateMeal;
// Delete
const deleteMeal = async (id) => {
    return await prisma_client_1.default.meal.delete({
        where: { id },
    });
};
exports.deleteMeal = deleteMeal;
//# sourceMappingURL=meal.service.js.map