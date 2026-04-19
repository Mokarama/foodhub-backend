const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/order.controller");

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

// Customer: place and view their own orders
router.post("/", auth, role("CUSTOMER"), createOrder);
router.get("/",  auth, role("CUSTOMER"), getOrders);

// Any authenticated user: view single order
router.get("/:id", auth, getOrderById);

// Provider or Admin: update order status
router.patch("/:id/status", auth, role("PROVIDER", "ADMIN"), updateOrderStatus);

module.exports = router;
