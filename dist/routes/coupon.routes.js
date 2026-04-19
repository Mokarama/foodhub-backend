"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const coupon_controller_1 = require("../controllers/coupon.controller");
// Both of these are generally public/admin
router.post("/validate", coupon_controller_1.validateCoupon);
router.post("/", coupon_controller_1.createCoupon); // Used to quickly seed a coupon for testing
exports.default = router;
//# sourceMappingURL=coupon.routes.js.map