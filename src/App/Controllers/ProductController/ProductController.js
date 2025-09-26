import express from "express";
import Product from "../../Model/ProductModel/ProductModel.js";
import Shop from "../../Model/ShopModel/ShopModel.js";
import User from "../../Model/UserModel/UserModel.js";
import MainCategory from "../../Model/CategoryModel/MainCategoryModel.js";

export const productRouter = express.Router();

// Add Product
productRouter.post("/products", async (req, res) => {
  const {
    name,
    category,
    subCategory,
    productCategory,
    defaultUnit,
    variants,
    phone,
    img,
  } = req.body;

  try {
    // Step 1: User খুঁজে বের করো
    const getUser = await User.findOne({ phone: phone });
    if (!getUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Step 2: User এর shop খুঁজো
    const getShop = await Shop.findOne({ owner: getUser._id });
    if (!getShop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found for this user",
      });
    }

    // Step 3: Product বানাও (shop reference সহ)
    const product = new Product({
      name,
      category,
      subCategory,
      productCategory,
      defaultUnit,
      variants,
      img,
      shop: getShop._id,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully!",
      // data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
});

// Get all Products
productRouter.get("/products", async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      sussecc: true,
      message: "Get all products  successfully ..!",
      data: products,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      success: false,
      message: "Product not Found!",
      error: error.errors,
    });
  }
});

// Get all Products by seller
productRouter.get("/products/seller/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Step 1: User খুঁজে বের করো
    const getUser = await User.findOne({ phone: id });
    if (!getUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Step 2: User এর shop খুঁজো
    const getShop = await Shop.findOne({ owner: getUser._id });
    if (!getShop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found for this user",
      });
    }

    const products = await Product.find({ shop: getShop._id });

    res.status(200).json({
      sussecc: true,
      message: "Get all products  successfully ..!",
      data: products,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      success: false,
      message: "Product not Found!",
      error: error.errors,
    });
  }
});

// Get a single Products
productRouter.get("/products/:productId", async (req, res) => {
  const id = req.params.productId;
  try {
    const product = await Product.findById(id);

    res.status(200).json({
      sussecc: true,
      message: "Get a single product  successfully ..!",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Product not Found!",
      error: error.errors,
    });
  }
});

// Update a single Products
productRouter.put("/products/:productId", async (req, res) => {
  const id = req.params.productId;
  const updateBody = req.body;
  try {
    const product = await Product.findByIdAndUpdate(id, updateBody, {
      new: true,
    });

    res.status(200).json({
      sussecc: true,
      message: "Update a single product  successfully ..!",
      product: product,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Product not Found!",
      error: error.errors,
    });
  }
});

// Delete a single Products
productRouter.delete("/products/:productId", async (req, res) => {
  const id = req.params.productId;

  try {
    await Product.findByIdAndDelete(id, {
      new: true,
    });

    res.status(200).json({
      sussecc: true,
      message: "Delete a single product  successfully ..!",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Product not Found!",
      error: error.errors,
    });
  }
});

// Get Restaurant item
productRouter.get("/restaurantsItems", async (req, res) => {
  try {
    const { productCategory } = req.query;

    // Step 1: Find "Restaurant" main category
    const mainCategory = await MainCategory.findOne({ name: "Restaurant" });
    if (!mainCategory) {
      return res.status(404).json({
        success: false,
        message: "Restaurant main category not found",
      });
    }

    // Step 2: Build filter
    const filter = {
      category: mainCategory._id,
      status: "active",
    };

    if (productCategory) {
      filter.productCategory = productCategory; // filter by productCategory name
    }

    // Step 3: Get products
    const products = await Product.find(filter).populate("shop", "name logo");

    // Step 4: Get used productCategory list from Product model
    const usedCategories = await Product.distinct("productCategory", {
      category: mainCategory._id,
      status: "active",
    });

    res.status(200).json({
      success: true,
      message: "Get all products successfully!",
      data: products,
      usedProductCategories: usedCategories, // ⬅️ This is your needed tab list
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      success: false,
      message: "Product not Found!",
      error: error.message,
    });
  }
});
