import express from "express";
import cors from "cors";
import { productRouter } from "./App/Controllers/ProductController/ProductController.js";
import { userRouter } from "./App/Controllers/UserControllers/UserControllers.js";
import { shopRouter } from "./App/Controllers/ShopControllers/ShopControllers.js";
import { mainCategoryRouter } from "./App/Controllers/CategoryControllers/MainCategoryControllers.js";
import { subCategoryRouter } from "./App/Controllers/CategoryControllers/SubCategoryControllers.js";
import { productCategoryRouter } from "./App/Controllers/CategoryControllers/ProductCategoryControllers.js";
import { unitRouter } from "./App/Controllers/UnitControllers/UnitControllers.js";
const app = express();

app.use(express.json());

app.use(cors());

app.use("/api", productRouter);
app.use("/api", userRouter);
app.use("/api", shopRouter);
app.use("/api", mainCategoryRouter);
app.use("/api", subCategoryRouter);
app.use("/api", productCategoryRouter);
app.use("/api", unitRouter);

// এইটা কাজ করবে: http://localhost:3000/
app.get("/", (req, res) => {
  res.send("Hello World from root!");
});

export default app;
