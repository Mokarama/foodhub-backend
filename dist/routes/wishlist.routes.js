"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const wishlist_controller_1 = require("../controllers/wishlist.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
router.post("/", auth_middleware_1.default, wishlist_controller_1.toggleWishlist);
router.get("/", auth_middleware_1.default, wishlist_controller_1.getWishlist);
exports.default = router;
//# sourceMappingURL=wishlist.routes.js.map