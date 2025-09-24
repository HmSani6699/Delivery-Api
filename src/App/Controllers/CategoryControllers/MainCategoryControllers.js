import express from "express";
import MainCategory from "../../Model/CategoryModel/MainCategoryModel.js";

export const mainCategoryRouter = express.Router();

// Create main category
mainCategoryRouter.post("/mainCategoryes", async (req, res) => {
  const reqBody = req?.body;

  try {
    const category = new MainCategory(reqBody);

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
});

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
    const category = await MainCategory.findByIdAndDelete(id);

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
