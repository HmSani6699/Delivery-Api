import express from "express";
import User from "../../Model/UserModel/UserModel.js";
import bcrypt from "bcryptjs";

export const userRouter = express.Router();

// Sign UP user
userRouter.post("/signup", async (req, res) => {
  const { name, phone, password, role } = req.body;

  const existingUser = await User.findOne({ phone });
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  // Password bcrypt
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  const userBody = {
    name,
    phone,
    password: passwordHash,
    role: role ? role : "customer",
  };

  try {
    const user = new User(userBody);

    await user.save();
    res.status(200).json({
      sussecc: true,
      message: "user create successfully ..!",
      data: { name, phone, role: userBody.role },
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      success: false,
      message: "User not created",
      error: error.errors,
    });
  }
});

// Login user
userRouter.post("/login", async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({ msg: "User does not exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    res.status(200).json({
      sussecc: true,
      message: "User login  successfully ..!",
      data: {
        name: user?.name,
        phone: user?.phone,
        role: user?.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "User not Found!",
      error: error.errors,
    });
  }
});

// Get all Products
userRouter.get("/products", async (req, res) => {
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
userRouter.get("/products/:productId", async (req, res) => {
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
userRouter.put("/products/:productId", async (req, res) => {
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
userRouter.delete("/products/:productId", async (req, res) => {
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
