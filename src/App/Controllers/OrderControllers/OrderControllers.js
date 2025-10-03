// import Order from "../../Model/OrderModel/OrderModel.js";
// import express from "express";
// import User from "../../Model/UserModel/UserModel.js";

// export const orderRouter = express.Router();

// // Add Product
// orderRouter.post("/orders", async (req, res) => {
//   const formData = req.body;

//   const user = await User.findOne({ phone: formData?.userId });

//   const payload = {
//     ...formData,
//     userId: user?._id,
//   };

//   try {
//     const order = new Order(payload);

//     await order.save();

//     res.status(201).json({
//       success: true,
//       message: "Order added successfully!",
//       data: order,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to add order",
//       error: error.message,
//     });
//   }
// });

import express from "express";
import User from "../../Model/UserModel/UserModel.js";
import Order from "../../Model/OrderModel/OrderModel.js";
import ShopOrder from "../../Model/OrderModel/ShopOrderSchema.js";
import mongoose from "mongoose";

// import Order from "../models/Order.js";
// import ShopOrder from "../models/ShopOrder.js";

export const orderRouter = express.Router();

// create new order
orderRouter.post("/orders", async (req, res) => {
  try {
    const payload = req.body;

    const user = await User.findOne({ phone: payload?.userId }).select("_id");

    // Step 1: Create Main Order (without shopOrders for now)
    const newOrder = await Order.create({
      userId: user._id,
      orderNumber: payload.orderNumber,
      status: "pending",
      subtotal: payload.subtotal,
      deliveryFee: payload.deliveryFee,
      discount: payload.discount,
      totalAmount: payload.totalAmount,
      deliveryType: payload.deliveryType,
      deliveryInfo: payload.deliveryInfo,
      payment: payload.payment,
      notes: payload.notes,
    });

    // Step 2: Group items by shopId
    const itemsByShop = {};
    for (let item of payload.items) {
      if (!itemsByShop[item.shopId]) {
        itemsByShop[item.shopId] = [];
      }
      itemsByShop[item.shopId].push(item);
    }

    // console.log(80, itemsByShop);

    // Step 3: Create ShopOrders
    const shopOrders = [];
    for (let shopId in itemsByShop) {
      const shopOrder = await ShopOrder.create({
        orderId: newOrder._id,
        shopId: new mongoose.Types.ObjectId(shopId), // ✅ string → ObjectId
        items: itemsByShop[shopId],
        status: "pending",
      });
      shopOrders.push(shopOrder._id);
    }

    // Step 4: Update Main Order with shopOrders
    newOrder.shopOrders = shopOrders;
    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Order failed", error });
  }
});
