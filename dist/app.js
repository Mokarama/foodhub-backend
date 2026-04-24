"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
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
const provider_routes_1 = __importDefault(require("./routes/provider.routes"));
const app = (0, express_1.default)();
// CORS Configuration
const origins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map(origin => origin.trim())
    : ["http://localhost:3000"];
console.log("Allowed CORS Origins:", origins);
app.use((req, res, next) => {
    const origin = req.headers.origin;
    // Normalize origin (remove trailing slash)
    const normalizedOrigin = origin ? origin.replace(/\/$/, "") : "";
    if (normalizedOrigin && origins.includes(normalizedOrigin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    }
    else if (!origin) {
        // For non-browser requests or same-origin
        res.setHeader("Access-Control-Allow-Origin", "*");
    }
    else {
        console.error(`CORS Blocked: Origin "${origin}" not in allowed list:`, origins);
    }
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});
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
app.use("/api/providers", provider_routes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    // Ensure CORS headers are present even in error responses
    const origin = req.headers.origin;
    if (origin && origins.includes(origin.replace(/\/$/, ""))) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    res.status(500).json({ message: "Internal server error", error: err.message });
});
exports.default = app;
//# sourceMappingURL=app.js.map