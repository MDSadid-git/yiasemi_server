import { asyncHandler } from "../utils/asyncHandler.js";
import { Menu } from "../models/menu.model.js";

const allMenuData = asyncHandler(async (req, res) => {
  const allMenu = await Menu.find({});

  return res.status(200).json({ allMenu });
});
export { allMenuData };
