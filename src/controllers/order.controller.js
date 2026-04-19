const orderService = require("../services/order.service");
const { validateAddress, validateOrderStatus, validateQuantity } = require("../utils/validation");

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { items, address } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items array is required and cannot be empty" });
    }

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    if (!validateAddress(address)) {
      return res.status(400).json({ message: "Address must be at least 5 characters" });
    }

    // Validate each item
    for (const item of items) {
      if (!item.mealId || !validateQuantity(item.quantity)) {
        return res.status(400).json({ message: "Invalid meal or quantity" });
      }
    }

    const order = await orderService.createOrder(req.user.userId, req.body);
    res.status(201).json(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get Customer Orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrders(req.user.userId);
    res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (err) {
    console.error("Get all orders error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get Single Order
exports.getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.json(order);
  } catch (err) {
    const status = err.message === "Order not found" ? 404 : 500;
    console.error("Get order error:", err);
    res.status(status).json({ message: err.message });
  }
};

// Update Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    if (!validateOrderStatus(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await orderService.updateOrderStatus(req.params.id, status);
    res.json(order);
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: err.message });
  }
};
