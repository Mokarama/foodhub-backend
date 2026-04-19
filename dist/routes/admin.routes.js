"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const prisma_client_1 = __importDefault(require("../utils/prisma-client"));
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const role_middleware_1 = __importDefault(require("../middleware/role.middleware"));
// --- Users ---
// Get all users
router.get("/users", auth_middleware_1.default, (0, role_middleware_1.default)("ADMIN"), async (req, res) => {
    try {
        const users = await prisma_client_1.default.user.findMany({
            select: { id: true, name: true, email: true, role: true, status: true },
        });
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Ban / Unban user
router.patch("/users/:id", auth_middleware_1.default, (0, role_middleware_1.default)("ADMIN"), async (req, res) => {
    try {
        const { status } = req.body;
        const user = await prisma_client_1.default.user.update({
            where: { id: req.params.id }, // ✅ fixed
            data: { status },
            select: { id: true, name: true, email: true, role: true, status: true },
        });
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// --- Orders ---
// Get all orders (admin overview)
router.get("/orders", auth_middleware_1.default, (0, role_middleware_1.default)("ADMIN"), order_controller_1.getAllOrders);
// --- Categories ---
// Get all categories
router.get("/categories", auth_middleware_1.default, (0, role_middleware_1.default)("ADMIN"), async (req, res) => {
    try {
        const categories = await prisma_client_1.default.category.findMany();
        res.json(categories);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Create category
router.post("/categories", auth_middleware_1.default, (0, role_middleware_1.default)("ADMIN"), async (req, res) => {
    try {
        const category = await prisma_client_1.default.category.create({
            data: { name: req.body.name },
        });
        res.status(201).json(category);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Delete category
router.delete("/categories/:id", auth_middleware_1.default, (0, role_middleware_1.default)("ADMIN"), async (req, res) => {
    try {
        await prisma_client_1.default.category.delete({
            where: { id: req.params.id }
        });
        res.json({ message: "Category deleted" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=admin.routes.js.map