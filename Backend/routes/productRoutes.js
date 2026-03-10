import express from "express";
import multer from "multer";
import Product from "../models/Product.js";
import Shop from "../models/Shop.js";
import { verifyToken } from "../middleware/auth.js";
import imagekit from "../utils/imagekit.js";

const router = express.Router();

// Use memory storage — files stay in buffer, no local writes
const upload = multer({ storage: multer.memoryStorage() });

// Helper: upload image buffer to ImageKit
async function uploadToImageKit(file) {
  const base64File = file.buffer.toString("base64");
  const result = await imagekit.upload({
    file: base64File,
    fileName: Date.now() + "-" + file.originalname,
    folder: "/super-fiesta/products",
  });
  return result.url;
}

// Add product
router.post("/add", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, stock } = req.body;
    const shop = await Shop.findOne({ owner: req.user.id });
    if (!shop)
      return res.status(404).json({ message: "No shop found for this user" });

    let imageUrl = null;
    if (req.file) {
      console.log("📷 [Product] File received:", req.file.originalname, req.file.size, "bytes");
      imageUrl = await uploadToImageKit(req.file);
      console.log("✅ [Product] ImageKit URL:", imageUrl);
    } else {
      console.log("⚠️ [Product] No file received in request");
    }

    const product = await Product.create({
      name,
      price,
      description,
      stock: stock || 0,
      image: imageUrl,
      shop: shop._id,
     
    });
    res.json({ message: "Product added", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
