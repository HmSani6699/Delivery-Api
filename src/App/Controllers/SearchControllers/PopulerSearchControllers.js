import express from "express";
import PopulerSearch from "../../Model/SearchModel/PopulerSearchModel.js";

export const populerSearchRouter = express.Router();

populerSearchRouter.post("/populerSearch", async (req, res) => {
  const reqBody = req?.body;

  try {
    const populerSearch = new PopulerSearch(reqBody);

    await populerSearch.save();

    res.status(201).json({
      success: true,
      message: "populerSearch added successfully!",
      // data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message,
      error: error.errors,
    });
  }
});

// Get all Unit
populerSearchRouter.get("/populerSearch", async (req, res) => {
  try {
    const populerSearch = await PopulerSearch.find();

    res.status(200).json({
      success: true,
      message: "Get all populerSearch  successfully ..!",
      data: populerSearch,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      success: false,
      message: "Unit not Found!",
      error: error.errors,
    });
  }
});

// Get a single Unit
populerSearchRouter.get("/populerSearch/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const populerSearch = await PopulerSearch.findById(id);

    res.status(200).json({
      success: true,
      message: "Get a single populerSearch  successfully ..!",
      data: populerSearch,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Populer Search not Found!",
      error: error.errors,
    });
  }
});

// Update a single Unit
populerSearchRouter.put("/populerSearch/:id", async (req, res) => {
  const id = req.params.id;
  const updateBody = req.body;
  try {
    const populerSearch = await PopulerSearch.findByIdAndUpdate(
      id,
      updateBody,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Update a single populerSearch  successfully ..!",
      data: populerSearch,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "populerSearch not Found!",
      error: error.errors,
    });
  }
});

// Delete a single Unit
populerSearchRouter.delete("/populerSearch/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await PopulerSearch.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Delete a single Populer Search  successfully ..!",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Populer Search not Found!",
      error: error.errors,
    });
  }
});
