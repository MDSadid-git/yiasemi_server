import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details form frontend
  // validation - not empty
  // check if user already exists? userName, email
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return respons

  const { userName, email, password, avatar } = req.body;
  if (
    [userName, email, password, avatar].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are requied");
  }
});

export { registerUser };
