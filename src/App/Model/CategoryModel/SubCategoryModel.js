import { model, Schema } from "mongoose";

const SubCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mainCategory: {
      type: Schema.Types.ObjectId,
      ref: "MainCategory",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const SubCategory = model("SubCategory", SubCategorySchema);

export default SubCategory;
