import express from "express";
import multer from "multer";
import Item from "../models/Item.js";
import Shop from "../models/Shop.js";
import authMiddleware from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();

// configure image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// GET ALL ITEMS FOR CUSTOMER BROWZING (PUBLIC)
router.get("/", async (req, res) => {
  try {
    // Find all items, populate the 'shop' field with the shop's name and location,
    // and sort by creation date to show the newest items first.
    const items = await Item.find({})
      .populate("shop", "name location")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch items." });
  }
});

// ADD ITEM
router.post(
  "/:shopId",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const { shopId } = req.params;
      // Log the incoming shopId for debugging

      const { name, price, description, stock } = req.body;

      // 1. Validate the incoming shopId
      if (!shopId || !mongoose.Types.ObjectId.isValid(shopId)) {
        return res.status(400).json({ message: "Invalid or missing shopId" });
      }

      // 2. Find the shop
      const shop = await Shop.findById(shopId);
      if (!shop) return res.status(404).json({ message: "Shop not found" });

      // 3. **Security Check**: Verify that the logged-in user owns this shop
      if (shop.owner.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Forbidden: You do not own this shop" });
      }

      // 4. Create and save the new item
      const newItem = new Item({
        name,
        price,
        description,
        stock: stock || 0,
        image: req.file ? `/uploads/${req.file.filename}` : null,
        shop: shopId, // Assign the validated shopId
      });
      await newItem.save();

      res.json({ message: "Item added successfully", item: newItem });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// EDIT ITEM
router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("shop");
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Security Check: Ensure the user owns the shop this item belongs to
    if (item.shop.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not own this item" });
    }

    const updates = { ...req.body };
    if (req.file) updates.image = `/uploads/${req.file.filename}`;

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    res.json({ message: "Item updated successfully", item: updatedItem });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE ITEM
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("shop");
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Security Check: Ensure the user owns the shop this item belongs to
    if (item.shop.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not own this item" });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all items for a specific shop
// GET all items for a specific shop
router.get("/shop/:shopId", async (req, res) => {
  try {
    const { shopId } = req.params;

    if (!shopId || !mongoose.Types.ObjectId.isValid(shopId)) {
      return res.status(400).json({ message: "Invalid or missing shopId" });
    }

    const items = await Item.find({ shop: shopId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
