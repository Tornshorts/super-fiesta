import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
});

export default mongoose.model("Product", productSchema);
