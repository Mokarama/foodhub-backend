const prisma = require("../utils/prisma-client");

// Create Order
exports.createOrder = async (userId, data) => {
    const { items, address, couponCode } = data;

    // Fetch all meals to validate and calculate price
    const mealIds = items.map((i) => i.mealId);
    const meals = await prisma.meal.findMany({
        where: { id: { in: mealIds } },
    });

    if (meals.length !== mealIds.length) {
        throw new Error("One or more meals not found");
    }

    // Build a price lookup map
    const priceMap = {};
    meals.forEach((m) => (priceMap[m.id] = m.price));

    // Calculate base total price
    let subtotal = items.reduce((sum, item) => {
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
                create: items.map((item) => ({
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
exports.getOrders = async (userId) => {
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
exports.getAllOrders = async () => {
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
exports.getOrderById = async (id) => {
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            user: { select: { id: true, name: true } },
            items: {
                include: { meal: true },
            },
        },
    });

    if (!order) {
        throw new Error("Order not found");
    }

    return order;
};

// Update Status (Provider / Admin)
exports.updateOrderStatus = async (id, status) => {
    return await prisma.order.update({
        where: { id },
        data: { status },
    });
};
