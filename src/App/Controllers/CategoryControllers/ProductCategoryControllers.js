import express from "express";
import ProductCategory from "../../Model/CategoryModel/ProductCategoryModel.js";
import { upload } from "../../../middleware/upload.js";
import fs from "fs";
import path from "path";

export const productCategoryRouter = express.Router();

// Create main category
productCategoryRouter.post(
  "/productCategoryes",
  upload.single("icon"),
  async (req, res) => {
    const { name, mainCategory, subCategory } = req.body;
    const icon = req.file ? req.file.filename : null;

    const formData = {
      name,
      icon,
      mainCategory,
      subCategory,
    };

    try {
      const category = new ProductCategory(formData);

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
productCategoryRouter.get("/productCategoryes", async (req, res) => {
  try {
    const category = await ProductCategory.find();

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
productCategoryRouter.get("/productCategoryes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const category = await ProductCategory.findById(id);

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
productCategoryRouter.put(
  "/productCategoryes/:id",
  upload.single("icon"),
  async (req, res) => {
    const { id } = req.params;
    const { name, mainCategory, subCategory } = req.body;
    const icon = req.file ? req.file.filename : null;

    try {
      // 1. পুরানো category খুঁজে বের করো
      const oldCategory = await ProductCategory.findById(id);
      if (!oldCategory) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }

      // 2. নতুন image থাকলে পুরানো image delete করো
      if (icon && oldCategory.icon) {
        const oldPath = path.join(process.cwd(), "uploads", oldCategory.icon);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath); // পুরানো ফাইল delete
        }
      }

      // 3. Update body তৈরি করো
      const updateBody = {
        name: name || oldCategory.name,
        icon: icon || oldCategory.icon, // যদি নতুন image না আসে তাহলে পুরানোটাই রাখবে
        mainCategory: mainCategory || oldCategory?.mainCategory,
        subCategory: subCategory || oldCategory?.subCategory,
      };

      // console.log(updateBody);

      const category = await ProductCategory.findByIdAndUpdate(id, updateBody);

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
productCategoryRouter.delete("/productCategoryes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // 1. DB থেকে category খুঁজে আনো
    const category = await ProductCategory.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // 2. Image path বের করো
    const imagePath = path.join(process.cwd(), "uploads", category?.icon);

    // 3. ফাইল আছে কিনা check করে delete করো
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await ProductCategory.findByIdAndDelete(id);

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
productCategoryRouter.get(
  "/productCategoryesByMainCategoryIdSubcategoryId/:mainCategoryId/:subCategoryId",
  async (req, res) => {
    const { mainCategoryId, subCategoryId } = req.params;
    try {
      const subCategories = await ProductCategory.find(
        { subCategory: subCategoryId, mainCategory: mainCategoryId },
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
