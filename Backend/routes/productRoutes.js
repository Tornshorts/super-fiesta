import express from "express";
import Product from "../models/Product.js";
import Shop from "../models/Shop.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Add product
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const shop = await Shop.findOne({ owner: req.user.id });
    if (!shop)
      return res.status(404).json({ message: "No shop found for this user" });

    const product = await Product.create({
      name,
      price,
      description,
      shop: shop._id,
    });
    res.json({ message: "Product added", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
