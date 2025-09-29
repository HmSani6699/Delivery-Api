import express from "express";
import SubCategory from "../../Model/CategoryModel/SubCategoryModel.js";
import { upload } from "../../../middleware/upload.js";
import fs from "fs";
import path from "path";
import Product from "../../Model/ProductModel/ProductModel.js";
import MainCategory from "../../Model/CategoryModel/MainCategoryModel.js";
export const subCategoryRouter = express.Router();

// Create main category
subCategoryRouter.post(
  "/subCategoryes",
  upload.single("icon"),
  async (req, res) => {
    const { name, mainCategory } = req.body;
    const icon = req.file ? req.file.filename : null;

    const formData = {
      name,
      icon,
      mainCategory,
    };

    try {
      const category = new SubCategory(formData);

      await category.save();

      res.status(201).json({
        success: true,
        message: "Category added successfully!",
        // data: product,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to add Category",
        error: error.message,
      });
    }
  }
);

// Get main category
subCategoryRouter.get("/subCategoryes", async (req, res) => {
  try {
    const category = await SubCategory.find().populate("mainCategory", "name");

    res.status(201).json({
      success: true,
      message: "Category get successfully!",
      data: category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add Category",
      error: error.message,
    });
  }
});

// Get single main category
subCategoryRouter.get("/subCategoryes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const category = await SubCategory.findById(id);

    res.status(201).json({
      success: true,
      message: "Category get successfully!",
      data: category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add Category",
      error: error.message,
    });
  }
});

// update main category
subCategoryRouter.put(
  "/subCategoryes/:id",
  upload.single("icon"),
  async (req, res) => {
    const { id } = req.params;
    const { name, mainCategory } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
      // 1. পুরানো category খুঁজে বের করো
      const oldCategory = await SubCategory.findById(id);
      if (!oldCategory) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }

      // 2. নতুন image থাকলে পুরানো image delete করো
      if (image && oldCategory.icon) {
        const oldPath = path.join(process.cwd(), "uploads", oldCategory.icon);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath); // পুরানো ফাইল delete
        }
      }

      // 3. Update body তৈরি করো
      const updateBody = {
        name: name || oldCategory.name,
        icon: image || oldCategory.icon, // যদি নতুন image না আসে তাহলে পুরানোটাই রাখবে
        mainCategory: mainCategory || oldCategory?.mainCategory,
      };

      const category = await SubCategory.findByIdAndUpdate(id, updateBody);

      res.status(201).json({
        success: true,
        message: "Category update successfully!",
        data: category,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to add Category",
        error: error.message,
      });
    }
  }
);

// Delete main category
subCategoryRouter.delete("/subCategoryes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // 1. DB থেকে category খুঁজে আনো
    const category = await SubCategory.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // 2. Image path বের করো
    const imagePath = path.join(process.cwd(), "uploads", category?.icon);

    // 3. ফাইল আছে কিনা check করে delete করো
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await SubCategory.findByIdAndDelete(id);

    res.status(201).json({
      success: true,
      message: "Category delete successfully!",
      data: category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add Category",
      error: error.message,
    });
  }
});

// Get add item sub cetegory
subCategoryRouter.get(
  "/subCategoryesByMainCategoryId/:mainCategoryId",
  async (req, res) => {
    const { mainCategoryId } = req.params;
    try {
      const subCategories = await SubCategory.find(
        { mainCategory: mainCategoryId },
        {
          name: 1,
          _id: 1,
        }
      );

      res.status(201).json({
        success: true,
        message: "Category get successfully!",
        data: subCategories,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to add Category",
        error: error.message,
      });
    }
  }
);

// Get subcategory name with total products count
subCategoryRouter.get("/subcategoryProductsCount", async (req, res) => {
  try {
    // ১. MainCategory থেকে id বের করা
    const mainCat = await MainCategory.findOne({ name: "বাজার আইটেম" });
    if (!mainCat) {
      return res
        .status(404)
        .json({ success: false, message: "Main category not found" });
    }

    const mainCatId = mainCat._id;

    // ২. SubCategory aggregation
    const result = await SubCategory.aggregate([
      {
        $match: { mainCategory: mainCatId }, // ObjectId match
      },
      {
        $lookup: {
          from: "products",
          localField: "_id", // SubCategory _id
          foreignField: "subCategory", // Product.subCategory (should be ObjectId)
          as: "products",
        },
      },
      {
        $addFields: {
          totalItems: { $size: "$products" },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          icon: 1,
          totalItems: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
