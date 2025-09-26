import express from "express";
import MainCategory from "../../Model/CategoryModel/MainCategoryModel.js";
import { upload } from "../../../middleware/upload.js";
import fs from "fs";
import path from "path";

export const mainCategoryRouter = express.Router();

// Create main category
mainCategoryRouter.post(
  "/mainCategoryes",
  upload.single("icon"), // ekhane attach korben
  async (req, res) => {
    const { name } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
      const category = new MainCategory({
        name,
        icon: image,
      });

      await category.save();

      res.status(201).json({
        success: true,
        message: "Category added successfully!",
        // data: product,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        success: false,
        message: error.message,
        error: error.errors,
      });
    }
  }
);

// Get main category
mainCategoryRouter.get("/mainCategoryes", async (req, res) => {
  try {
    const category = await MainCategory.find();

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
mainCategoryRouter.get("/mainCategoryes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const category = await MainCategory.findById(id);

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
mainCategoryRouter.put("/mainCategoryes/:id", async (req, res) => {
  const { id } = req.params;
  const updateBody = req.body;

  try {
    const category = await MainCategory.findByIdAndUpdate(id, updateBody);

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
});

// Delete main category
mainCategoryRouter.delete("/mainCategoryes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // 1. DB থেকে category খুঁজে আনো
    const category = await MainCategory.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // 2. Image path বের করো
    const imagePath = path.join(process.cwd(), "uploads", category?.icon);

    // 3. ফাইল আছে কিনা check করে delete করো
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // 4. DB থেকে category delete করো
    await MainCategory.findByIdAndDelete(id);

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
