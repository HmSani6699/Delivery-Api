import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true }, // পণ্যের নাম
    category: {
      type: Schema.Types.ObjectId,
      ref: "MainCategory",
      required: true,
    }, // e.g. Food, Grocery
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    }, // optional
    productCategory: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
    },
    defaultUnit: { type: String, required: true }, // e.g. piece, plate, kg
    variants: [
      {
        label: String, // e.g. 1 প্লেট, 500 gm
        unit: String, // e.g. plate, gm
        price: Number,
        cutPrice: Number,
        discount: Number,
        qty_step: Number,
        stock: Number,
      },
    ],
    img: { type: String }, // image URL
    shop: {
      // কোন shop এর product
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Product = model("Product", productSchema);

export default Product;
