"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const review_controller_1 = require("../controllers/review.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const role_middleware_1 = __importDefault(require("../middleware/role.middleware"));
// Public: get reviews for a meal (?mealId=X)
router.get("/", review_controller_1.getReviews);
// Customer only: submit a review
router.post("/", auth_middleware_1.default, (0, role_middleware_1.default)("CUSTOMER"), review_controller_1.createReview);
exports.default = router;
//# sourceMappingURL=review.routes.js.map