import express from "express";
import Unit from "../../Model/UnitModel/UnitModel.js";

export const unitRouter = express.Router();

unitRouter.post("/units", async (req, res) => {
  const reqBody = req?.body;

  try {
    const unit = new Unit(reqBody);

    await unit.save();

    res.status(201).json({
      success: true,
      message: "Unit added successfully!",
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
unitRouter.get("/units", async (req, res) => {
  try {
    // const units = await Unit.find().populate("owner", "ownerName ownerPhone");
    const unit = await Unit.find();

    res.status(200).json({
      success: true,
      message: "Get all Unit  successfully ..!",
      data: unit,
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
unitRouter.get("/units/:unitId", async (req, res) => {
  const id = req.params.unitId;
  try {
    const unit = await Unit.findById(id);

    res.status(200).json({
      success: true,
      message: "Get a single Unit  successfully ..!",
      data: unit,
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

// Update a single Unit
unitRouter.put("/units/:unitId", async (req, res) => {
  const id = req.params.unitId;
  const updateBody = req.body;
  try {
    const unit = await Unit.findByIdAndUpdate(id, updateBody, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Update a single Unit  successfully ..!",
      data: unit,
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

// Delete a single Unit
unitRouter.delete("/units/:unitId", async (req, res) => {
  const id = req.params.unitId;

  try {
    await Unit.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Delete a single Unit  successfully ..!",
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

//
// Get add item sub cetegory
unitRouter.get(
  "/units/:mainCategoryId/:subCategoryId/:productCategoryId",
  async (req, res) => {
    const { mainCategoryId, subCategoryId, productCategoryId } = req.params;
    try {
      const subCategories = await Unit.find(
        {
          subCategory: subCategoryId,
          mainCategory: mainCategoryId,
          productCategory: productCategoryId,
        },
        {
          name: 1,
          _id: 1,
        }
      );

      res.status(201).json({
        success: true,
        message: "Unit get successfully!",
        data: subCategories,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to add Unit",
        error: error.message,
      });
    }
  }
);
