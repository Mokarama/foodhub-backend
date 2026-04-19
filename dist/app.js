"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const meal_routes_1 = __importDefault(require("./routes/meal.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
const foodImage_routes_1 = __importDefault(require("./routes/foodImage.routes"));
const wishlist_routes_1 = __importDefault(require("./routes/wishlist.routes"));
const coupon_routes_1 = __importDefault(require("./routes/coupon.routes"));
const app = (0, express_1.default)();
// CORS Configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
// Serve static files from the public directory
app.use("/public", express_1.default.static(path_1.default.join(__dirname, "../public")));
app.get("/", (req, res) => {
    res.send("FoodHub API Running");
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/meals", meal_routes_1.default);
app.use("/api/orders", order_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use("/api/categories", category_routes_1.default);
app.use("/api/reviews", review_routes_1.default);
app.use("/api/foods", foodImage_routes_1.default);
app.use("/api/wishlist", wishlist_routes_1.default);
app.use("/api/coupons", coupon_routes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error", error: err.message });
});
exports.default = app;
//# sourceMappingURL=app.js.map