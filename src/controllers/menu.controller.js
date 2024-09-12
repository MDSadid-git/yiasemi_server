import { asyncHandler } from "../utils/asyncHandler.js";
import { Menu } from "../models/menu.model.js";
import { ApiResponse } from "../utils/ApiRespose.js";

const allMenuData = asyncHandler(async (req, res) => {
  const allMenu = await Menu.find({});

  return res
    .status(200)
    .json(new ApiResponse(200, allMenu, "Menu data get successfully"));
});
export { allMenuData };
