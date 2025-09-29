import express from "express";
import Shop from "../../Model/ShopModel/ShopModel.js";
import User from "../../Model/UserModel/UserModel.js";
import bcrypt from "bcryptjs";
import { upload } from "../../../middleware/upload.js";
import fs from "fs";
import path from "path";
import Product from "../../Model/ProductModel/ProductModel.js";
import mongoose from "mongoose";

export const shopRouter = express.Router();

shopRouter.post(
  "/shops",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  async (req, res) => {
    const {
      ownerName,
      ownerPhone,
      ownerPassword,
      name,
      phone,
      address,
      shopType,
      status,
      description,
      sharePricing,
    } = req.body;

    const logo = req.files["logo"] ? req.files["logo"][0].filename : null;
    const coverImage = req.files["coverImage"]
      ? req.files["coverImage"][0].filename
      : null;

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

      const formData = {
        name,
        owner: seller?._id,
        phone,
        address,
        logo,
        coverImage,
        shopType,
        status,
        description,
        sharePricing: {
          ...sharePricing,
        },
      };

      const shop = new Shop(formData);

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
  }
);

// Get all Shop
shopRouter.get("/shops", async (req, res) => {
  try {
    // const shops = await Shop.find().populate("owner", "ownerName ownerPhone");
    const shops = await Shop.find().populate("owner", "name phone");

    res.status(200).json({
      success: true,
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

shopRouter.get("/allShops", async (req, res) => {
  try {
    // 1. সব Shop আনো ও owner populate করো
    const shops = await Shop.find().select("logo name");

    // 2. প্রতিটা Shop এর জন্য product count বের করো
    const shopsWithProductCount = await Promise.all(
      shops.map(async (shop) => {
        const productCount = await Product.countDocuments({ shop: shop._id });

        // Shop object এর সঙ্গে productCount যোগ করো
        return {
          ...shop.toObject(), // Mongoose Document → Plain Object
          productCount,
        };
      })
    );

    // 3. Response পাঠাও
    res.status(200).json({
      success: true,
      message: "Shops fetched successfully with product count.",
      data: shopsWithProductCount,
    });
  } catch (error) {
    console.error("Error fetching shops:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch shops",
      error: error?.message || error,
    });
  }
});

// Get a single Shop
shopRouter.get("/shops/:shopId", async (req, res) => {
  const id = req.params.shopId;
  try {
    const shop = await Shop.findById(id).select("name logo coverImage");

    res.status(200).json({
      success: true,
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
// Get a single Shop tab button value
shopRouter.get("/shopTabButton/:shopId", async (req, res) => {
  const id = req.params.shopId;

  // Optional: Validate ObjectId first
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Shop ID",
    });
  }

  try {
    // 1. Shop খুঁজে বের করো
    const shop = await Shop.findById(id).select("name logo coverImage");

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // 2. ওই Shop-এর প্রোডাক্ট আনো
    const shopTab = await Product.find({
      shop: shop._id,
    }).select("name");

    // 3. Response পাঠাও
    res.status(200).json({
      success: true,
      message: "Shop and its products fetched successfully!",
      data: {
        products: shopTab,
      },
    });
  } catch (error) {
    console.error("Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error?.message || error,
    });
  }
});

// Update a single Shop
shopRouter.put(
  "/shops/:shopId",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  async (req, res) => {
    const id = req.params.shopId;
    const updateBody = req.body;

    const newLogo = req.files["logo"] ? req.files["logo"][0].filename : null;
    const newCoverImage = req.files["coverImage"]
      ? req.files["coverImage"][0].filename
      : null;

    try {
      // 1. পুরানো Shop খুঁজে বের করো
      const oldShop = await Shop.findById(id);
      if (!oldShop) {
        return res
          .status(404)
          .json({ success: false, message: "Shop not found" });
      }

      let logo = oldShop.logo;
      let coverImage = oldShop.coverImage;

      // 2. যদি নতুন logo থাকে, পুরানো delete করে নতুন set করো
      if (newLogo) {
        const oldLogoPath = path.join(process.cwd(), "uploads", oldShop.logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath); // পুরানো logo delete
        }
        logo = newLogo;
      }

      // 3. যদি নতুন coverImage থাকে, পুরানো delete করে নতুন set করো
      if (newCoverImage) {
        const oldCoverPath = path.join(
          process.cwd(),
          "uploads",
          oldShop.coverImage
        );
        if (fs.existsSync(oldCoverPath)) {
          fs.unlinkSync(oldCoverPath); // পুরানো cover image delete
        }
        coverImage = newCoverImage;
      }

      // 4. Update shop
      const updatedShop = await Shop.findByIdAndUpdate(
        id,
        {
          ...updateBody,
          logo,
          coverImage,
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Shop updated successfully!",
        data: updatedShop,
      });
    } catch (error) {
      console.error("Update error:", error);
      res.status(400).json({
        success: false,
        message: "Failed to update shop!",
        error: error?.message || error,
      });
    }
  }
);

// Delete a single Shop
shopRouter.delete("/shops/:shopId", async (req, res) => {
  const id = req.params.shopId;

  try {
    // 1. পুরাতন Shop খুঁজে বের করো
    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // 2. পুরাতন logo ফাইল ডিলিট করো (যদি থাকে)
    if (shop.logo) {
      const logoPath = path.join(process.cwd(), "uploads", shop.logo);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }

    // 3. পুরাতন coverImage ফাইল ডিলিট করো (যদি থাকে)
    if (shop.coverImage) {
      const coverImagePath = path.join(
        process.cwd(),
        "uploads",
        shop.coverImage
      );
      if (fs.existsSync(coverImagePath)) {
        fs.unlinkSync(coverImagePath);
      }
    }

    // 4. Shop ডাটাবেজ থেকে ডিলিট করো
    await Shop.findByIdAndDelete(id);

    // 5. Success response পাঠাও
    res.status(200).json({
      success: true,
      message: "Shop deleted successfully!",
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(400).json({
      success: false,
      message: "Failed to delete shop",
      error: error?.message || error,
    });
  }
});
