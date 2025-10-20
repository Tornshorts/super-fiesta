import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String }, // will store URL or filename
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    stock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
