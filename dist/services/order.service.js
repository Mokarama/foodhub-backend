"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getProviderOrders = exports.getOrderById = exports.getAllOrders = exports.getOrders = exports.createOrder = void 0;
const prisma_client_1 = __importDefault(require("../utils/prisma-client"));
// Create Order
const createOrder = async (userId, data) => {
    const { items, address, couponCode } = data;
    // Fetch all meals to validate and calculate price
    const mealIds = items.map((i) => i.mealId);
    const meals = await prisma_client_1.default.meal.findMany({
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
        const coupon = await prisma_client_1.default.coupon.findUnique({
            where: { code: couponCode.toUpperCase() }
        });
        if (coupon && coupon.isActive && (!coupon.expiry || new Date() < new Date(coupon.expiry))) {
            if (coupon.discountType === 'PERCENTAGE') {
                discountAmount = (subtotal * coupon.value) / 100;
            }
            else {
                discountAmount = coupon.value;
            }
        }
    }
    const deliveryFee = 50;
    const tax = Math.round(subtotal * 0.1);
    let finalTotal = Math.max(0, subtotal + deliveryFee + tax - discountAmount);
    return await prisma_client_1.default.order.create({
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
exports.createOrder = createOrder;
// Get Orders (Customer — their own orders)
const getOrders = async (userId) => {
    return await prisma_client_1.default.order.findMany({
        where: { userId },
        include: {
            items: {
                include: { meal: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};
exports.getOrders = getOrders;
// Get All Orders (Admin)
const getAllOrders = async () => {
    return await prisma_client_1.default.order.findMany({
        include: {
            user: { select: { id: true, name: true, email: true } },
            items: {
                include: { meal: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};
exports.getAllOrders = getAllOrders;
// Get Single Order
const getOrderById = async (id) => {
    const order = await prisma_client_1.default.order.findUnique({
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
exports.getOrderById = getOrderById;
// Get Orders for Provider
const getProviderOrders = async (providerId) => {
    return await prisma_client_1.default.order.findMany({
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
exports.getProviderOrders = getProviderOrders;
// Update Status (Provider / Admin)
const updateOrderStatus = async (id, status) => {
    return await prisma_client_1.default.order.update({
        where: { id },
        data: { status },
    });
};
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=order.service.js.map