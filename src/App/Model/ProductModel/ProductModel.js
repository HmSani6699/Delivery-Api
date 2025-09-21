import mongoose from "mongoose";

const { Schema, model } = mongoose;

const variantSchema = new Schema(
  {
    label: { type: String, required: true },
    unit: { type: String, required: true },
    price: { type: Number, required: true },
    cutPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    qty_step: { type: Number, default: 1 },
    stock: { type: Number, default: 0 },
  },
  { _id: false } // আলাদা _id generate না করার জন্য
);

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true }, // তুমি Number দিয়েছিলে, কিন্তু example এ String আছে
    subCategory: { type: String, default: "" },
    defaultUnit: { type: String, required: true },
    variants: [variantSchema],
    img: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Product = model("Product", productSchema);

export default Product;
