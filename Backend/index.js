import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/products", productRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);

// Start server

app.listen(process.env.PORT || 5000, () =>
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
);
