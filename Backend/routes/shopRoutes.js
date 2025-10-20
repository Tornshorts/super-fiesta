import express from "express";
import Shop from "../models/Shop.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// GET the current owner's shop
router.get("/my-shop", verifyToken, async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });
    if (!shop) {
      return res
        .status(404)
        .json({ message: "Shop not found for this owner." });
    }
    res.json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create or update shop
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { name, description, location } = req.body;
    let shop = await Shop.findOne({ owner: req.user.id });

    if (shop) {
      shop.name = name || shop.name;
      shop.description = description || shop.description;
      shop.location = location || shop.location;
      await shop.save();
    } else {
      shop = await Shop.create({
        name,
        description,
        location,
        owner: req.user.id,
      });
    }

    res.json({ message: "Shop saved successfully", shopId: shop._id, shop });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
