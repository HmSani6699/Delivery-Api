import mongoose from "mongoose";

import { Schema, model } from "mongoose";

// Order item schema
const OrderItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    variantId: {
      type: Schema.Types.ObjectId,
      ref: "Variant",
      required: false,
    },
    variantName: {
      type: String,
      default: "",
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    pricePerUnit: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

//  Delevey info schema
const DeliveryInfoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    elaka: {
      type: String,
      required: true,
    },
    gram: {
      type: String,
      required: true,
    },
    area: String,
    city: String,
  },
  { _id: false }
);

// payment schema
const PaymentInfoSchema = new Schema(
  {
    method: {
      type: String,
      enum: ["cash", "bkash", "nagad", "card"],
      required: true,
    },
    status: {
      type: String,
      enum: ["unpaid", "paid", "failed", "refunded"],
      default: "unpaid",
    },
    paymentNumber: {
      type: String,
      default: null,
    },
    transactionId: {
      type: String,
      default: null,
    },
    paidAt: {
      type: Date,
    },
  },
  { _id: false }
);

// final order schema
const OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "preparing",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ],
    default: "pending",
  },
  items: {
    type: [OrderItemSchema],
    required: true,
    validate: [(arr) => arr.length > 0, "At least one item is required"],
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  deliveryFee: {
    type: Number,
    default: 0,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  deliveryType: {
    type: String,
    enum: ["home", "pickup"],
    default: "home",
  },
  deliveryInfo: DeliveryInfoSchema,
  payment: PaymentInfoSchema,
  notes: {
    type: String,
    default: "",
  },
});

const Order = model("Order", OrderSchema);

export default Order;
