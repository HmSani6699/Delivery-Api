import { model, Schema } from "mongoose";

const mainCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    icon: {
      type: String, // Optional icon/image for the category
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const MainCategory = model("MainCategory", mainCategorySchema);

export default MainCategory;
