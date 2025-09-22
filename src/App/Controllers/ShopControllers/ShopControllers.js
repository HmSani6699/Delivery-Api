import express from "express";
import Shop from "../../Model/ShopModel/ShopModel.js";
import User from "../../Model/UserModel/UserModel.js";

export const shopRouter = express.Router();

shopRouter.post("/shops", async (req, res) => {
  const { name, owner, phone, address } = req.body;

  try {
    // owner অবশ্যই seller হতে হবে
    const seller = await User.findById(owner);

    if (!seller || seller.role !== "seller") {
      return res.status(400).json({
        success: false,
        message: "Only sellers can own a shop",
      });
    }

    const shop = new Shop({ name, owner, phone, address });
    await shop.save();

    res.status(201).json({
      success: true,
      message: "Shop created successfully!",
      data: shop,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create shop",
      error: error.message,
    });
  }
});

// Get all Shop
shopRouter.get("/shops", async (req, res) => {
  try {
    const shop = await Shop.find();

    res.status(200).json({
      sussecc: true,
      message: "Get all shop  successfully ..!",
      data: shop,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      success: false,
      message: "Shop not Found!",
      error: error.errors,
    });
  }
});

// Get a single Shop
shopRouter.get("/shops/:shopId", async (req, res) => {
  const id = req.params.shopId;
  try {
    const shop = await Shop.findById(id);

    res.status(200).json({
      sussecc: true,
      message: "Get a single shop  successfully ..!",
      data: shop,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Shop not Found!",
      error: error.errors,
    });
  }
});

// Update a single Shop
shopRouter.put("/shops/:shopId", async (req, res) => {
  const id = req.params.shopId;
  const updateBody = req.body;
  try {
    const shop = await Shop.findByIdAndUpdate(id, updateBody, {
      new: true,
    });

    res.status(200).json({
      sussecc: true,
      message: "Update a single shop  successfully ..!",
      data: shop,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Shop not Found!",
      error: error.errors,
    });
  }
});

// Delete a single Shop
shopRouter.delete("/shops/:shopId", async (req, res) => {
  const id = req.params.shopId;

  try {
    await Shop.findByIdAndDelete(id);

    res.status(200).json({
      sussecc: true,
      message: "Delete a single shop  successfully ..!",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Shop not Found!",
      error: error.errors,
    });
  }
});
