import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import path from "path";

import authRoutes from "./routes/auth.routes";
import mealRoutes from "./routes/meal.routes";
import orderRoutes from "./routes/order.routes";
import adminRoutes from "./routes/admin.routes";
import categoryRoutes from "./routes/category.routes";
import reviewRoutes from "./routes/review.routes";
import foodImageRoutes from "./routes/foodImage.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import couponRoutes from "./routes/coupon.routes";
import providerRoutes from "./routes/provider.routes";

const app = express();

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
    res.setHeader("Access-Control-Allow-Origin", origin!);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  } else if (!origin) {
    // For non-browser requests or same-origin
    res.setHeader("Access-Control-Allow-Origin", "*");
  } else {
    console.error(`CORS Blocked: Origin "${origin}" not in allowed list:`, origins);
  }

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());
app.use(morgan("dev"));

// Serve static files from the public directory
app.use("/public", express.static(path.join(__dirname, "../public")));

app.get("/", (req: Request, res: Response) => {
  res.send("FoodHub API Running");
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
app.use("/api/providers", providerRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  
  // Ensure CORS headers are present even in error responses
  const origin = req.headers.origin;
  if (origin && origins.includes(origin.replace(/\/$/, ""))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.status(500).json({ message: "Internal server error", error: err.message });
});

export default app;