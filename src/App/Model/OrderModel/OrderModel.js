import mongoose from "mongoose";

import { Schema, model } from "mongoose";

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
const OrderSchema = new Schema(
  {
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
        "pending", // যখন order place হলো
        "partially_accepted", // কিছু shop accept করলো, কিছু করলো না
        "confirmed", // সব shop accept করলো
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
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

    // important: প্রতিটা shop order এর সাথে relation রাখছি
    shopOrders: [{ type: Schema.Types.ObjectId, ref: "ShopOrder" }],

    notes: {
      type: String,
      default: "",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Order = model("Order", OrderSchema);

export default Order;
