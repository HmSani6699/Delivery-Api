import express from "express";
import User from "../../Model/UserModel/UserModel.js";
import bcrypt from "bcryptjs";
import Shop from "../../Model/ShopModel/ShopModel.js";
import Product from "../../Model/ProductModel/ProductModel.js";

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
userRouter.get("/users", async (req, res) => {
  try {
    const user = await User.find();

    res.status(200).json({
      sussecc: true,
      message: "Get all user  successfully ..!",
      data: user,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      success: false,
      message: "users not Found!",
      error: error.errors,
    });
  }
});

// Get a single User
userRouter.get("/users/:userId", async (req, res) => {
  const id = req.params.userId;
  try {
    const user = await User.findById(id);

    res.status(200).json({
      sussecc: true,
      message: "Get a single User  successfully ..!",
      data: user,
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

// Update a single users
userRouter.put("/users/:userId", async (req, res) => {
  const id = req.params.userId;
  const updateBody = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, updateBody, {
      new: true,
    });

    res.status(200).json({
      sussecc: true,
      message: "Update a single user  successfully ..!",
      user: user,
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

// Delete a single users
userRouter.delete("/users/:userId", async (req, res) => {
  const id = req.params.userId;

  try {
    // 1. user আছে কিনা চেক করো
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found 444" });
    }

    // 2. user's shops খুঁজে delete করো
    const shops = await Shop.find({ owner: id });
    for (const shop of shops) {
      // প্রতিটা shop এর products delete
      await Product.deleteMany({ shop: shop._id });
    }

    // shops delete
    await Shop.deleteMany({ owner: id });

    // 3. user delete
    await User.findByIdAndDelete(id);

    res.json({ success: true, message: "User and all related data deleted!" });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "user not Found!  22",
      error: error.errors,
    });
  }
});
