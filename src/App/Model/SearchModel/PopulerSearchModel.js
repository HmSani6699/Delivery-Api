import { Schema, model } from "mongoose";

const populerSearchSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const PopulerSearch = model("PopulerSearch", populerSearchSchema);

export default PopulerSearch;
