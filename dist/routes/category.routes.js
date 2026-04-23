"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const category_controller_1 = require("../controllers/category.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const role_middleware_1 = __importDefault(require("../middleware/role.middleware"));
// Public
router.get("/", category_controller_1.getCategories);
// Admin only
router.post("/", auth_middleware_1.default, (0, role_middleware_1.default)("ADMIN"), category_controller_1.createCategory);
exports.default = router;
//# sourceMappingURL=category.routes.js.map