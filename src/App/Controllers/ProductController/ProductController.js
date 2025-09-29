import express from "express";
import Product from "../../Model/ProductModel/ProductModel.js";
import Shop from "../../Model/ShopModel/ShopModel.js";
import User from "../../Model/UserModel/UserModel.js";
import MainCategory from "../../Model/CategoryModel/MainCategoryModel.js";
import { upload } from "../../../middleware/upload.js";
import fs from "fs";
import path from "path";
import SubCategory from "../../Model/CategoryModel/SubCategoryModel.js";
import mongoose from "mongoose";

export const productRouter = express.Router();

// Add Product
productRouter.post("/products", upload.single("img"), async (req, res) => {
  const {
    name,
    category,
    subCategory,
    productCategory,
    defaultUnit,
    variants,
    phone,
  } = req.body;

  const img = req.file ? req.file.filename : null;

  const formData = {
    name,
    category,
    subCategory,
    productCategory,
    defaultUnit,
    variants,
    phone,
    img,
  };

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
      ...formData,
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
// productRouter.put(
//   "/products/:productId",
//   upload.single("img"),
//   async (req, res) => {
//     const id = req.params.productId;
//     const {
//       name,
//       category,
//       subCategory,
//       productCategory,
//       defaultUnit,
//       variants,
//       phone,
//     } = req.body;

//     const img = req.file ? req.file.filename : null;

//     try {
//       // Step 2: User এর shop খুঁজো

//       // const getShop = await Shop.findOne({ owner: getUser._id });
//       // if (!getShop) {
//       //   return res.status(404).json({
//       //     success: false,
//       //     message: "Shop not found for this user",
//       //   });
//       // }

//       // 1. পুরানো product খুঁজে বের করো
//       const oldProduct = await Product.findById(id);
//       if (!oldProduct) {
//         return res
//           .status(404)
//           .json({ success: false, message: "Product not found" });
//       }

//       // 2. নতুন image থাকলে পুরানো image delete করো
//       if (img && oldProduct.img) {
//         const oldPath = path.join(process.cwd(), "uploads", oldProduct.img);
//         if (fs.existsSync(oldPath)) {
//           fs.unlinkSync(oldPath); // পুরানো ফাইল delete
//         }
//       }

//       const formData = {
//         name,
//         category,
//         subCategory,
//         productCategory,
//         defaultUnit,
//         variants,
//         phone,
//         img,
//         // shop: getShop._id,
//       };

//       // const product = await Product.findByIdAndUpdate(id, formData, {
//       //   new: true,
//       // });

//       console.log(formData);

//       res.status(200).json({
//         success: true,
//         message: "Update a single product  successfully ..!",
//         product: product,
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(400).json({
//         success: false,
//         message: "Product not Found!",
//         error: error.errors,
//       });
//     }
//   }
// );

productRouter.put(
  "/products/:productId",
  upload.single("img"),
  async (req, res) => {
    const id = req.params.productId;
    const {
      name,
      category,
      subCategory,
      productCategory,
      defaultUnit,
      variants,
      phone,
      status,
    } = req.body;

    // যদি নতুন image থাকে
    const newImage = req.file ? req.file.filename : null;

    try {
      // 1. পুরানো product খুঁজে বের করো
      const oldProduct = await Product.findById(id);
      if (!oldProduct) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      let finalImage = oldProduct.img;

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

      // 3. formData বানাও
      const formData = {
        name,
        category,
        subCategory,
        productCategory,
        defaultUnit,
        variants,
        phone,
        status,
        img: finalImage, // ✅ পুরানো বা নতুন যেটা valid
      };

      // 4. update query চালাও
      const product = await Product.findByIdAndUpdate(id, formData, {
        new: true,
      });

      res.status(200).json({
        success: true,
        message: "Product updated successfully!",
        product,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        success: false,
        message: "Failed to update product",
        error: error.message,
      });
    }
  }
);

// Delete a single Product
productRouter.delete("/products/:productId", async (req, res) => {
  const id = req.params.productId;

  try {
    // 1. Product খুঁজে বের করো
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 2. যদি image থাকে তবে delete করো
    if (product.img) {
      const oldPath = path.join(process.cwd(), "uploads", product.img);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath); // পুরানো image delete
      }
    }

    // 3. Database থেকে product delete
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product and its image deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Something went wrong!",
      error: error.message,
    });
  }
});

// Get All populer items
productRouter.get("/allPopulerItems", async (req, res) => {
  try {
    // Step 1: Find "Restaurant" main category
    const mainCategory = await MainCategory.findOne({
      name: "রেস্তোরাঁর খাবার",
    });
    if (!mainCategory) {
      return res.status(404).json({
        success: false,
        message: "Restaurant main category not found",
      });
    }

    let filter = {
      category: mainCategory._id,
      status: "active",
    };

    const products = await Product.aggregate([
      { $match: filter }, // তোমার filter condition
      {
        $lookup: {
          from: "shops", // Shop collection নাম (schema তে model নাম ছোট হাতের plural হয়)
          localField: "shop",
          foreignField: "_id",
          as: "shop",
        },
      },
      { $unwind: "$shop" },
      {
        $group: {
          _id: "$shop._id",
          shopName: { $first: "$shop.name" },
          totalProducts: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          shopName: 1,
          totalProducts: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Get all products successfully!",
      data: products,
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

// Get Restaurant item
productRouter.get("/populerItems", async (req, res) => {
  const { name, search } = req.query;

  try {
    // Step 1: Find "Restaurant" main category
    const mainCategory = await MainCategory.findOne({
      name: "রেস্তোরাঁর খাবার",
    });
    if (!mainCategory) {
      return res.status(404).json({
        success: false,
        message: "Restaurant main category not found",
      });
    }

    console.log("get main ctegory", mainCategory?._id);

    // base filter
    let filter = {
      category: new mongoose.Types.ObjectId(mainCategory._id),
      status: "active",
    };

    // name দিয়ে filter
    if (name) {
      filter.name = name;
    }

    // search দিয়ে filter (partial match)
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter).populate("shop", "name logo");

    res.status(200).json({
      success: true,
      message: "Get all products successfully!",
      data: products,
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

// Get grocery item
productRouter.get("/allGroceryItems", async (req, res) => {
  const { name } = req.query;

  try {
    // Step 1: Find "Restaurant" main category
    const subCategory = await SubCategory.findOne({
      name: name,
    });
    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "Restaurant sub category not found",
      });
    }

    // base filter
    let filter = {
      subCategory: subCategory._id,
      status: "active",
    };

    const products = await Product.find(filter)
      .select("name productCategory") // শুধু Product এর name আর productCategory আসবে
      .populate("productCategory", "name icon"); // শুধু ProductCategory এর name আসবে

    // total count
    const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Get all products successfully!",
      totalProducts: totalProducts,
      data: products,
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

// Get grocery item
productRouter.get("/filterGroceryItems", async (req, res) => {
  const { categoryName, itemName } = req.query;

  try {
    // Step 1: Find "Restaurant" main category
    const subCategory = await SubCategory.findOne({
      name: categoryName,
    });
    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "Restaurant sub category not found",
      });
    }

    // base filter
    let filter = {
      subCategory: subCategory._id,
      name: { $regex: itemName, $options: "i" },
      status: "active",
    };

    const products = await Product.find(filter); // শুধু ProductCategory এর name আসবে

    // total count
    const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Get all products successfully!",
      totalProducts: totalProducts,
      data: products,
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
