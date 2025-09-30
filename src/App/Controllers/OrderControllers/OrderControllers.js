import Order from "../../Model/OrderModel/OrderModel.js";
import express from "express";
import User from "../../Model/UserModel/UserModel.js";

export const orderRouter = express.Router();

// Add Product
orderRouter.post("/orders", async (req, res) => {
  const formData = req.body;

  const user = await User.findOne({ phone: formData?.userId });

  const payload = {
    ...formData,
    userId: user?._id,
  };

  try {
    const order = new Order(payload);

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order added successfully!",
      data: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add order",
      error: error.message,
    });
  }
});
