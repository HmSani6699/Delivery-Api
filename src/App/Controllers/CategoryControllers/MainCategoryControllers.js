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
// mainCategoryRouter.put(
//   "/mainCategoryes/:id",
//   upload.single("icon"),
//   async (req, res) => {
//     const { id } = req.params;
//      const { name } = req.body;
//      const image = req.file ? req.file.filename : null;

//     try {
//       const category = await MainCategory.findByIdAndUpdate(id, updateBody);

//       res.status(201).json({
//         success: true,
//         message: "Category update successfully!",
//         data: category,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to add Category",
//         error: error.message,
//       });
//     }
//   }
// );

mainCategoryRouter.put(
  "/mainCategoryes/:id",
  upload.single("icon"),
  async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    // যদি নতুন image থাকে
    const newImage = req.file ? req.file.filename : null;

    try {
      // 1. পুরানো category খুঁজে বের করো
      const oldCategory = await MainCategory.findById(id);
      if (!oldCategory) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }

      let finalImage = oldCategory.icon;

      // 2. যদি নতুন image থাকে, পুরানো delete করে নতুন set করো
      if (newImage) {
        if (oldProduct.img) {
          const oldPath = path.join(process.cwd(), "uploads", oldProduct.img);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath); // পুরানো ফাইল delete
          }
        }
        finalImage = newImage;
      }

      // 3. Update body তৈরি করো
      const updateBody = {
        name: name || oldCategory.name,
        icon: finalImage || oldCategory.icon, // যদি নতুন image না আসে তাহলে পুরানোটাই রাখবে
      };

      // 4. Database এ update করো
      const category = await MainCategory.findByIdAndUpdate(id, updateBody, {
        new: true,
      });

      res.status(200).json({
        success: true,
        message: "Category updated successfully!",
        data: category,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to update Category",
        error: error.message,
      });
    }
  }
);

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
