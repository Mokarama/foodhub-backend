"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const foodImage_controller_1 = require("../controllers/foodImage.controller");
router.get("/", foodImage_controller_1.getAllFoodImages);
exports.default = router;
//# sourceMappingURL=foodImage.routes.js.map