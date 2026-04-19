import express from "express";
const router = express.Router();

import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order.controller";

import auth from "../middleware/auth.middleware";
import role from "../middleware/role.middleware";

// Customer: place and view their own orders
router.post("/", auth, role("CUSTOMER"), createOrder);
router.get("/", auth, role("CUSTOMER"), getOrders);

// Any authenticated user: view single order
router.get("/:id", auth, getOrderById);

// Provider or Admin: update order status
router.patch("/:id/status", auth, role("PROVIDER", "ADMIN"), updateOrderStatus);

export default router;