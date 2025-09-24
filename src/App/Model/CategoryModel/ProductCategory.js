// models/MainCategoryModel.js

import { model, Schema } from "mongoose";

const ProductCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    mainCategory: {
      type: Schema.Types.ObjectId,
      ref: "MainCategory",
      required: true,
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const ProductCategory = model("ProductCategory", ProductCategorySchema);

export default ProductCategory;
