import express from "express";
import { productRouter } from "./App/Controllers/ProductController/ProductController.js";
const app = express();

app.use(express.json());

app.use("/api", productRouter);

// এইটা কাজ করবে: http://localhost:3000/
app.get("/", (req, res) => {
  res.send("Hello World from root!");
});

export default app;
