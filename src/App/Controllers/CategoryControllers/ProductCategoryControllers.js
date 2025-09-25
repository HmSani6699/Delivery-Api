import express from "express";
import ProductCategory from "../../Model/CategoryModel/ProductCategoryModel.js";

export const productCategoryRouter = express.Router();

// Create main category
productCategoryRouter.post("/productCategoryes", async (req, res) => {
  const reqBody = req?.body;

  try {
    const category = new ProductCategory(reqBody);

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
productCategoryRouter.put("/productCategoryes/:id", async (req, res) => {
  const { id } = req.params;
  const updateBody = req.body;

  try {
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
});

// Delete main category
productCategoryRouter.delete("/productCategoryes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const category = await ProductCategory.findByIdAndDelete(id);

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
