import express from "express";
import Product from "../../Model/ProductModel/ProductModel.js";

export const productRouter = express.Router();

// Create a Product
productRouter.post("/products", async (req, res) => {
  const productBody = req.body;

  try {
    const product = new Product(productBody);

    await product.save();

    res.status(200).json({
      sussecc: true,
      message: "Product Added successfully ..!",
      product: productBody,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      success: false,
      message: "Product not created",
      error: error.errors,
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
