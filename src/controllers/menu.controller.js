import { asyncHandler } from "../utils/asyncHandler.js";
import { Menu } from "../models/menu.model.js";
import { ApiResponse } from "../utils/ApiRespose.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const allMenuData = asyncHandler(async (req, res) => {
  const allMenu = await Menu.find({});

  return res
    .status(200)
    .json(new ApiResponse(200, allMenu, "Menu data get successfully"));
});

const addItems = asyncHandler(async (req, res) => {
  //get all data

  const { name, price, recipe, category } = req.body;

  // validation - check if fields are empty or not properly formatted
  if (
    [name, recipe, category].some(
      (field) => typeof field !== "string" || field.trim() === ""
    ) ||
    price == null ||
    isNaN(price) ||
    category === "default"
  ) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          `All fields are required and must be valid`,
          "Failed"
        )
      );
  }

  // find name is existe
  const existeItem = await Menu.findOne({
    $or: [{ name }],
  });
  if (existeItem?.name == name) {
    return res
      .status(401)
      .json(
        new ApiResponse(401, `${existeItem?.name} Alrady existed`, "Faild")
      );
  }

  // upload them to cloudinary image

  const imageLocalPath = req.file?.path;

  if (!imageLocalPath) {
    return res
      .status(402)
      .json(new ApiResponse(402, "Image File are required", "faild"));
  }
  const recipeImage = await uploadOnCloudinary(imageLocalPath);
  if (!recipeImage) {
    return res
      .status(403)
      .json(new ApiResponse(403, "Image is requied", "Faild"));
  }

  // add item
  const item = await Menu.create({
    name,
    price,
    recipe,
    category,
    image: recipeImage.url,
  });
  if (!item) {
    return res.status(500).json(new ApiResponse(500, "Sorry Item not add"));
  }

  // response return
  return res
    .status(200)
    .json(new ApiResponse(200, item, "Item add succussfully"));
});
const deleteItem = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const adminDeleteItem = await Menu.deleteOne({
    _id: new mongoose.Types.ObjectId(id),
  });
  return res
    .status(200)
    .json(new ApiResponse(200, adminDeleteItem, "Item Delete Successfully"));
});
const singleMenuData = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const resultMenu = await Menu.findById({
    _id: new mongoose.Types.ObjectId(id),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, resultMenu, "Item successfull"));
});
const updateItem = asyncHandler(async (req, res) => {
  const { name, price, recipe, category, _id } = req.body;

  // upload Cloudinery
  const imageLocalPath = req.file?.path;

  if (!imageLocalPath) {
    return res
      .status(402)
      .json(new ApiResponse(402, "Image File are required", "faild"));
  }
  const recipeImage = await uploadOnCloudinary(imageLocalPath);
  if (!recipeImage) {
    return res
      .status(403)
      .json(new ApiResponse(403, "Image is requied", "Faild"));
  }

  const newUpdateItem = await Menu.findByIdAndUpdate(
    _id,
    {
      $set: {
        name,
        price,
        category,
        recipe,
        image: recipeImage.url,
      },
    },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, newUpdateItem, "Item Update Successfully"));
});
export { allMenuData, addItems, deleteItem, singleMenuData, updateItem };
