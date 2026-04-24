"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const role_middleware_1 = __importDefault(require("../middleware/role.middleware"));
// Customer: place and view their own orders
router.post("/", auth_middleware_1.default, (0, role_middleware_1.default)("CUSTOMER"), order_controller_1.createOrder);
router.get("/", auth_middleware_1.default, (0, role_middleware_1.default)("CUSTOMER"), order_controller_1.getOrders);
// Provider: view orders for their meals
router.get("/provider", auth_middleware_1.default, (0, role_middleware_1.default)("PROVIDER"), order_controller_1.getProviderOrders);
// Any authenticated user: view single order
router.get("/:id", auth_middleware_1.default, order_controller_1.getOrderById);
// Provider or Admin: update order status
router.patch("/:id/status", auth_middleware_1.default, (0, role_middleware_1.default)("PROVIDER", "ADMIN"), order_controller_1.updateOrderStatus);
exports.default = router;
//# sourceMappingURL=order.routes.js.map