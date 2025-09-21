import express from "express";
import { Product } from "../../Model/ProductModel/ProductModel.js";
export const productRouter = express.Router();

productRouter.post("/product", async (req, res) => {
  console.log("======>", req.body);
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
