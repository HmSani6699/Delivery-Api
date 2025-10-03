import { model, Schema } from "mongoose";

// Order item schema
const OrderItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: { type: String, required: true },
    img: { type: String, required: true },
    variantId: {
      type: Schema.Types.ObjectId,
      ref: "Variant",
    },
    variantName: { type: String, default: "" },
    quantity: { type: Number, required: true, min: 1 },
    pricePerUnit: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  { _id: false }
);

const ShopOrderSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    items: { type: [OrderItemSchema], required: true },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const ShopOrder = model("ShopOrder", ShopOrderSchema);
export default ShopOrder;
