const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const mealRoutes = require("./routes/meal.routes");
const orderRoutes = require("./routes/order.routes");
const adminRoutes = require("./routes/admin.routes");
const categoryRoutes = require("./routes/category.routes");
const reviewRoutes = require("./routes/review.routes");
const foodImageRoutes = require("./routes/foodImage.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const couponRoutes = require("./routes/coupon.routes");

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

// Serve static files from the public directory
app.use("/public", express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.send("FoodHub API Running 🍱");
});

app.use("/api/auth", authRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/foods", foodImageRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/coupons", couponRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

module.exports = app;

