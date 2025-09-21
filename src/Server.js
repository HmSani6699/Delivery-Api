import mongoose from "mongoose";
import app from "./App.js";

const PORT = 3000;

async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://sadiq:devsadiq6699@cluster0.2wuqxlq.mongodb.net/DeliveryApi?retryWrites=true&w=majority"
    );
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

main();
