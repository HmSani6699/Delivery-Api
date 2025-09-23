import express from "express";
import Shop from "../../Model/ShopModel/ShopModel.js";
import User from "../../Model/UserModel/UserModel.js";
import bcrypt from "bcryptjs";

export const shopRouter = express.Router();

shopRouter.post("/shops", async (req, res) => {
  const {
    ownerName,
    ownerPhone,
    ownerPassword,
    name,
    phone,
    address,
    logo,
    coverImage,
    shopType,
    status,
    description,
    sharePricing,
  } = req.body;

  try {
    // Password bcrypt
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(ownerPassword, salt);

    // Create user
    const user = new User({
      name: ownerName,
      phone: ownerPhone,
      password: passwordHash,
      role: "seller",
    });
    await user.save();

    // owner অবশ্যই seller হতে হবে
    const seller = await User.findOne({ phone: ownerPhone });

    if (!seller || seller.role !== "seller") {
      return res.status(400).json({
        success: false,
        message: "Only sellers can own a shop",
      });
    }

    const shop = new Shop({
      name,
      owner: seller?._id,
      phone,
      address,
      logo,
      coverImage,
      shopType,
      status,
      description,
      sharePricing,
    });
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
    // const shops = await Shop.find().populate("owner", "ownerName ownerPhone");
    const shops = await Shop.find().populate("owner", "name");

    res.status(200).json({
      sussecc: true,
      message: "Get all shop  successfully ..!",
      data: shops,
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
