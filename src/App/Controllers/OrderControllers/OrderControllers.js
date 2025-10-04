import express from "express";
import User from "../../Model/UserModel/UserModel.js";
import Order from "../../Model/OrderModel/OrderModel.js";
import ShopOrder from "../../Model/OrderModel/ShopOrderSchema.js";
import mongoose from "mongoose";

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

// GET all orders
orderRouter.get("/orders", async (req, res) => {
  try {
    const { date, status } = req.query;

    let filter;

    // যদি date না থাকে, default আজকের date
    const today = new Date();
    const selectedDate = date
      ? new Date(`${date}T00:00:00.000Z`)
      : new Date(today.toISOString().split("T")[0] + "T00:00:00.000Z");

    const startOfDay = new Date(selectedDate);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    if (date && status) {
      // date + specific status
      filter = {
        status: status,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      };
    } else if (date && !status) {
      // শুধু তারিখ অনুযায়ী সব status
      filter = {
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      };
    } else {
      // default pending + আজকের তারিখ
      filter = {
        status: "pending",
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      };
    }

    // Find orders for any of these shops
    // const shopOrders = await Order.find(filter)
    //   .sort({ createdAt: -1 })
    //   .populate("shopOrders");
    const shopOrders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: "shopOrders",
        populate: [
          {
            path: "shopId", // 🟢 Populate shop data
            select: "name phone address logo area city", // choose only the needed fields
          },
        ],
      });

    res.json({
      success: true,
      orders: shopOrders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch shop orders",
      error: err.message,
    });
  }
});

// GEt order by single user
orderRouter.get("/orders/user/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findOne({ phone: id }).select("_id");

    const userOrder = await Order.find({ userId: user?._id })
      .sort({ createdAt: -1 })
      .populate("shopOrders");

    res.status(201).json({
      success: true,
      message: "Get user order successfully",
      order: userOrder,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Get Order failed", error });
  }
});
