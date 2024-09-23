import mongoose from "mongoose";
import { Cart } from "../models/cart.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiRespose.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addCart = asyncHandler(async (req, res) => {
  const cartItem = req.body;
  const addCartResult = await Cart.create(cartItem);
  return res
    .status(200)
    .json(new ApiResponse(200, addCartResult, "Add cart successfully"));
});

const userOrderFoodItems = asyncHandler(async (req, res) => {
  // get Current User order information
  const userEmail = req.query.email;

  const userFoodItems = await User.aggregate([
    {
      $match: {
        email: userEmail,
      },
    },
    {
      $lookup: {
        from: "carts",
        localField: "email",
        foreignField: "email",
        as: "userFoods",
      },
    },
    {
      $project: {
        userName: 1,
        email: 1,

        "userFoods.menuId": 1,
        "userFoods._id": 1,
        "userFoods.email": 1,
        "userFoods.name": 1,
        "userFoods.image": 1,
        "userFoods.price": 1,
        "userFoods.createdAt": 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, userFoodItems, "Current user fetched successfully")
    );
});

const cartItemDelete = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const cartDelete = await Cart.deleteOne({
    _id: new mongoose.Types.ObjectId(id),
  });
  return res
    .status(200)
    .json(new ApiResponse(200, cartDelete, "Cart Delete successfully"));
});

export { addCart, userOrderFoodItems, cartItemDelete };
