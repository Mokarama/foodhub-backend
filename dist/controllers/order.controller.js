"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getOrderById = exports.getAllOrders = exports.getOrders = exports.createOrder = void 0;
const orderService = __importStar(require("../services/order.service"));
const validation_1 = require("../utils/validation");
// Create Order
const createOrder = async (req, res) => {
    try {
        const { items, address } = req.body;
        // Validation
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Items array is required and cannot be empty" });
        }
        if (!address) {
            return res.status(400).json({ message: "Address is required" });
        }
        if (!(0, validation_1.validateAddress)(address)) {
            return res.status(400).json({ message: "Address must be at least 5 characters" });
        }
        // Validate each item
        for (const item of items) {
            if (!item.mealId || !(0, validation_1.validateQuantity)(item.quantity)) {
                return res.status(400).json({ message: "Invalid meal or quantity" });
            }
        }
        const order = await orderService.createOrder(req.user.userId, req.body);
        res.status(201).json(order);
    }
    catch (err) {
        console.error("Create order error:", err);
        res.status(500).json({ message: err.message });
    }
};
exports.createOrder = createOrder;
// Get Customer Orders
const getOrders = async (req, res) => {
    try {
        const orders = await orderService.getOrders(req.user.userId);
        res.json(orders);
    }
    catch (err) {
        console.error("Get orders error:", err);
        res.status(500).json({ message: err.message });
    }
};
exports.getOrders = getOrders;
// Get All Orders (Admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        res.json(orders);
    }
    catch (err) {
        console.error("Get all orders error:", err);
        res.status(500).json({ message: err.message });
    }
};
exports.getAllOrders = getAllOrders;
// Get Single Order
const getOrderById = async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        res.json(order);
    }
    catch (err) {
        const status = err.message === "Order not found" ? 404 : 500;
        console.error("Get order error:", err);
        res.status(status).json({ message: err.message });
    }
};
exports.getOrderById = getOrderById;
// Update Status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }
        if (!(0, validation_1.validateOrderStatus)(status)) {
            return res.status(400).json({ message: "Invalid order status" });
        }
        const order = await orderService.updateOrderStatus(req.params.id, status);
        res.json(order);
    }
    catch (err) {
        console.error("Update order status error:", err);
        res.status(500).json({ message: err.message });
    }
};
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=order.controller.js.map