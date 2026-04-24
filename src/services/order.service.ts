import prisma from "../utils/prisma-client";

// Create Order
export const createOrder = async (userId: any, data: any): Promise<any> => {
    const { items, address, couponCode } = data;

    // Fetch all meals to validate and calculate price
    const mealIds = items.map((i: any) => i.mealId);
    const meals = await prisma.meal.findMany({
        where: { id: { in: mealIds } },
    });

    if (meals.length !== mealIds.length) {
        throw new Error("One or more meals not found");
    }

    // Build a price lookup map
    const priceMap: any = {};
    meals.forEach((m: any) => (priceMap[m.id] = m.price));

    // Calculate base total price
    let subtotal = items.reduce((sum: number, item: any) => {
        return sum + priceMap[item.mealId] * item.quantity;
    }, 0);

    // Apply Coupon
    let discountAmount = 0;
    if (couponCode) {
        const coupon = await prisma.coupon.findUnique({
            where: { code: couponCode.toUpperCase() }
        });
        if (coupon && coupon.isActive && (!coupon.expiry || new Date() < new Date(coupon.expiry))) {
            if (coupon.discountType === 'PERCENTAGE') {
               discountAmount = (subtotal * coupon.value) / 100;
            } else {
               discountAmount = coupon.value;
            }
        }
    }

    const deliveryFee = 50;
    const tax = Math.round(subtotal * 0.1);
    let finalTotal = Math.max(0, subtotal + deliveryFee + tax - discountAmount);

    return await prisma.order.create({
        data: {
            userId,
            address,
            totalPrice: finalTotal,
            items: {
                create: items.map((item: any) => ({
                    mealId: item.mealId,
                    quantity: item.quantity,
                    price: priceMap[item.mealId],
                })),
            },
        },
        include: {
            items: {
                include: { meal: true },
            },
        },
    });
};

// Get Orders (Customer — their own orders)
export const getOrders = async (userId: any): Promise<any> => {
    return await prisma.order.findMany({
        where: { userId },
        include: {
            items: {
                include: { meal: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};

// Get All Orders (Admin)
export const getAllOrders = async (): Promise<any> => {
    return await prisma.order.findMany({
        include: {
            user: { select: { id: true, name: true, email: true } },
            items: {
                include: { meal: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};

// Get Single Order
export const getOrderById = async (id: any): Promise<any> => {
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            user: { select: { id: true, name: true } },
            items: {
                include: { meal: true },
            },
        },
    });

    return order;
};

// Get Orders for Provider
export const getProviderOrders = async (providerId: string): Promise<any> => {
    return await prisma.order.findMany({
        where: {
            items: {
                some: {
                    meal: { providerId }
                }
            }
        },
        include: {
            user: { select: { id: true, name: true, email: true } },
            items: {
                include: { meal: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};

// Update Status (Provider / Admin)
export const updateOrderStatus = async (id: any, status: any): Promise<any> => {
    return await prisma.order.update({
        where: { id },
        data: { status },
    });
};