import { Schema, model } from "mongoose";

const shopSchema = new Schema(
  {
    name: { type: String, required: true }, // দোকান / রেস্টুরেন্টের নাম
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // যিনি owner (seller user)
    phone: { type: String },
    address: { type: String },

    // Future expandable fields
    description: { type: String },
    logo: { type: String }, // shop logo / image URL
    coverImage: { type: String }, // banner
    status: {
      type: String,
      enum: ["pending", "approved", "blocked"],
      default: "approved",
    }, // super admin shop verify করতে পারবে
  },
  { timestamps: true }
);

const Shop = model("Shop", shopSchema);

export default Shop;
