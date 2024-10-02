import { asyncHandler } from "../utils/asyncHandler.js";
import { Menu } from "../models/menu.model.js";
import { ApiResponse } from "../utils/ApiRespose.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
export { allMenuData, addItems };
