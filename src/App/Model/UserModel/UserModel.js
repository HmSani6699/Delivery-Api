import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "rider", "seller", "admin"],
      default: "customer",
    },
    status: {
      type: String,
      enum: ["active", "Inactive"],
      default: "active",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const User = model("User", userSchema);

export default User;
