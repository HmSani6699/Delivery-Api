import express from "express";
import cors from "cors";
import { productRouter } from "./App/Controllers/ProductController/ProductController.js";
import { userRouter } from "./App/Controllers/UserControllers/UserControllers.js";
import { shopRouter } from "./App/Controllers/ShopControllers/ShopControllers.js";
const app = express();

app.use(express.json());

app.use(cors());

app.use("/api", productRouter);
app.use("/api", userRouter);
app.use("/api", shopRouter);

// এইটা কাজ করবে: http://localhost:3000/
app.get("/", (req, res) => {
  res.send("Hello World from root!");
});

export default app;
