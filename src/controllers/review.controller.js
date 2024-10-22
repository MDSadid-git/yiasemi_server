import { Review } from "../models/review.model.js";
import { ApiResponse } from "../utils/ApiRespose.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const allReviews = asyncHandler(async (_, res) => {
  const reviews = await Review.find({});
  return res.status(200).json(new ApiResponse(200, reviews, "Successfull"));
});

const userReviewsList = asyncHandler(async (req, res) => {
  const name = req.user.userName;
  const result = await Review.find({ name });

  if (!result) {
    return res
      .status(500)
      .json(new ApiResponse(500, "This user add on comment", "Faild"));
  }
  return res.status(200).json(new ApiResponse(200, result, "Successfull"));
});

const addReviewsUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, details, rating } = req.body;
  if ([name, details].some((field) => field?.trim() === "")) {
    return res
      .status(400)
      .json(new ApiResponse(400, `All fields are requied`, "Faild"));
  }
  if (rating == 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, `All fields are requied`, "Faild"));
  }
  const addReview = await Review.create({
    name,
    details,
    rating,
  });
  return res.status(200).json(new ApiResponse(200, addReview, "Successfull"));
});

export { addReviewsUser, allReviews, userReviewsList };
