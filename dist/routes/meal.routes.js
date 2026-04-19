"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const meal_controller_1 = require("../controllers/meal.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const role_middleware_1 = __importDefault(require("../middleware/role.middleware"));
const multer_config_1 = __importDefault(require("../utils/multer.config"));
// Public
router.get("/", meal_controller_1.getMeals);
router.get("/:id", meal_controller_1.getSingleMeal);
// Provider only (and Admin for delete)
router.post("/", auth_middleware_1.default, (0, role_middleware_1.default)("PROVIDER"), multer_config_1.default.single('image'), meal_controller_1.createMeal);
router.put("/:id", auth_middleware_1.default, (0, role_middleware_1.default)("PROVIDER"), multer_config_1.default.single('image'), meal_controller_1.updateMeal);
router.delete("/:id", auth_middleware_1.default, (0, role_middleware_1.default)("PROVIDER", "ADMIN"), meal_controller_1.deleteMeal);
exports.default = router;
//# sourceMappingURL=meal.routes.js.map