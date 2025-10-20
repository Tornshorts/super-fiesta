import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  location: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("Shop", shopSchema);
