// const express = require("express");
// const router = express.Router();

// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

// const auth = require("../middleware/auth.middleware");
// const role = require("../middleware/role.middleware");

// // Get all users
// router.get("/users", auth, role("ADMIN"), async (req, res) => {
//   const users = await prisma.user.findMany();
//   res.json(users);
// });

// // Ban/Unban user
// router.patch("/users/:id", auth, role("ADMIN"), async (req, res) => {
//   const { status } = req.body;

//   const user = await prisma.user.update({
//     where: { id: req.params.id },
//     data: { status },
//   });

//   res.json(user);
// });

// module.exports = router;


const express = require("express");
const router = express.Router();

const prisma = require("../utils/prisma-client");
const { getAllOrders } = require("../controllers/order.controller");

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

// --- Users ---

// Get all users
router.get("/users", auth, role("ADMIN"), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, status: true },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ban / Unban user
router.patch("/users/:id", auth, role("ADMIN"), async (req, res) => {
  try {
    const { status } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { status },
      select: { id: true, name: true, email: true, role: true, status: true },
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Orders ---

// Get all orders (admin overview)
router.get("/orders", auth, role("ADMIN"), getAllOrders);

// --- Categories ---

// Get all categories
router.get("/categories", auth, role("ADMIN"), async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create category
router.post("/categories", auth, role("ADMIN"), async (req, res) => {
  try {
    const category = await prisma.category.create({
      data: { name: req.body.name },
    });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete category
router.delete("/categories/:id", auth, role("ADMIN"), async (req, res) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
