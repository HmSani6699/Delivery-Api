import express from "express";
import SubCategory from "../../Model/CategoryModel/SubCategoryModel.js";

export const subCategoryRouter = express.Router();

// Create main category
subCategoryRouter.post("/subCategoryes", async (req, res) => {
  const reqBody = req?.body;

  try {
    const category = new SubCategory(reqBody);

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
});

// Get main category
subCategoryRouter.get("/subCategoryes", async (req, res) => {
  try {
    const category = await SubCategory.find();

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
subCategoryRouter.put("/subCategoryes/:id", async (req, res) => {
  const { id } = req.params;
  const updateBody = req.body;

  try {
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
});

// Delete main category
subCategoryRouter.delete("/subCategoryes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const category = await SubCategory.findByIdAndDelete(id);

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
