import { model, Schema, version } from "mongoose";

const productSchema = new Schema(
  {
    name: String,
    category: Number,
    defaultUnit: String,
    variants: [
      {
        label: String,
        unit: String,
        price: Number,
        qty_step: Number,
        stock: Number,
      },
    ],
    img: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Product = model("products", productSchema);
