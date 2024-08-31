import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiRespose.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Sorry something is wrong to generate Access & Referesh Tokens Try!!!"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details form frontend done
  // validation - not empty done
  // check if user already exists? userName, email done
  // upload them to cloudinary, avatar done
  // create user object - create entry in db done
  // remove password and refresh token field from response done
  // check for user creation done
  // return respons done

  // get user details form frontend
  const { userName, email, password, avatar } = req.body;

  // validation - not empty
  if (
    [userName, email, password, avatar].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are requied");
  }

  // check if user already exists? userName, email
  const existedUser = await User.findOne({
    $or: [{ email }, { userName }],
  });
  if (existedUser) {
    throw new ApiError(410, "User with email or username already exists!!!");
  }

  // upload them to cloudinary, avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatarImage = await uploadOnCloudinary(avatarLocalPath);
  if (!avatarImage) {
    throw new ApiError(400, "Avatar is requied");
  }

  // create user object - create entry in db
  const user = await User.create({
    userName,
    email,
    password,
    avatar: avatarImage.url,
  });

  // remove password and refresh token field from response
  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // check for user creation
  if (!createUser) {
    throw new ApiError(500, "Sorry something wrong on register User");
  }

  // return respons
  return res
    .status(201)
    .json(new ApiResponse(200, createUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body from => data done
  // user email done
  // find the user done
  // password check done
  // sent referesh & access token
  // sent cookies

  // req body
  const { email, password } = req.body;
  //user email
  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  // find the user
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "User does not exist!!!");
  }

  // password check
  const passwordValid = await user.isPasswordCorrect(password);
  if (!passwordValid) {
    throw new ApiError(402, "Invalid user Password");
  }

  // accessToken & refreshToken
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const logInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // const { _id, avatar, userName } = user;
  // const logInUser = {
  //   _id,
  //   avatar,
  //   email,
  //   userName,
  // };

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: logInUser,
        accessToken,
        refreshToken,
      }),
      "User log in successfully"
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },

    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logOut Successfully"));
});

export { registerUser, loginUser, logOutUser };
