import { Schema, model } from "mongoose";

const shopSchema = new Schema(
  {
    name: { type: String, required: true }, // দোকান / রেস্টুরেন্টের নাম
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // owner user এর ObjectId

    phone: { type: String, required: true }, // দোকানের ফোন নম্বর
    address: { type: String, required: true },

    description: { type: String },

    logo: { type: String }, // shop logo image url/path
    coverImage: { type: String }, // banner image url/path

    // তুমি ১, ২ দিয়ে পাঠাচ্ছো কিন্তু schema-তে String রেখেছো তাই আমরা enum দিয়ে বানাবো
    shopType: {
      type: String,
      enum: ["Restaurant", "Grocery"], // 1 = Restaurant, 2 = Grocery (যেমন তুমি পাঠাচ্ছো)
      required: true,
    },

    status: {
      type: String,
      enum: ["approved", "pending", "blocked"], // 1 = pending, 2 = approved, 3 = blocked
      default: "approved",
      required: true,
    },

    sharePricing: {
      type: Map,
      of: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Shop = model("Shop", shopSchema);

export default Shop;
