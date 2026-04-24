import prisma from "../utils/prisma-client";

// Create
export const createMeal = async (userId: any, data: any): Promise<any> => {
    return await prisma.meal.create({
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

// Get All (with optional filters: categoryId, minPrice, maxPrice)
export const getMeals = async (filters: any = {}): Promise<any> => {
    const where: any = {};

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
/////
// Get Single
export const getMealById = async (id: any): Promise<any> => {
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
export const updateMeal = async (id: any, data: any): Promise<any> => {
    if (data.price) {
        data.price = parseFloat(data.price);
    }
    return await prisma.meal.update({
        where: { id },
        data,
    });
};

// Delete
export const deleteMeal = async (id: any): Promise<any> => {
    return await prisma.meal.delete({
        where: { id },
    });
};

