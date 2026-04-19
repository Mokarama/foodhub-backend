const prisma = require("../utils/prisma-client");

// Create
exports.createMeal = async (userId, data) => {
    return await prisma.meal.create({
        data: {
            name: data.name,
            price: data.price,
            description: data.description,
            image: data.image,
            providerId: userId,
            categoryId: data.categoryId,
        },
    });
};

// Get All (with optional filters: categoryId, minPrice, maxPrice)
exports.getMeals = async (filters = {}) => {
    const where = {};

    if (filters.categoryId) {
        where.categoryId = filters.categoryId;
    }

    if (filters.minPrice || filters.maxPrice) {
        where.price = {};
        if (filters.minPrice) where.price.gte = parseFloat(filters.minPrice);
        if (filters.maxPrice) where.price.lte = parseFloat(filters.maxPrice);
    }

    return await prisma.meal.findMany({
        where,
        include: {
            category: true,
            provider: {
                select: { id: true, name: true },
            },
        },
    });
};

// Get Single
exports.getMealById = async (id) => {
    const meal = await prisma.meal.findUnique({
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

// Update
exports.updateMeal = async (id, data) => {
    return await prisma.meal.update({
        where: { id },
        data,
    });
};

// Delete
exports.deleteMeal = async (id) => {
    return await prisma.meal.delete({
        where: { id },
    });
};
