import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiRespose.js";
import jwt from "jsonwebtoken";

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
    return res
      .status(400)
      .json(new ApiResponse(400, `All fields are requied`, "Faild"));
  }

  // check if user already exists? userName, email
  const existedUser = await User.findOne({
    $or: [{ email }, { userName }],
  });
  if (existedUser?.userName == userName && existedUser?.email == email) {
    return res
      .status(401)
      .json(
        new ApiResponse(
          401,
          `${existedUser?.userName} ${existedUser?.email} alrady existed`,
          "Faild"
        )
      );
  } else {
    if (existedUser?.userName == userName) {
      return res
        .status(401)
        .json(
          new ApiResponse(
            401,
            `${existedUser?.userName} alrady existed`,
            "Faild"
          )
        );
    }
    if (existedUser?.email == email) {
      return res
        .status(401)
        .json(
          new ApiResponse(401, `${existedUser.email} alrady existed`, "Faild")
        );
    }
  }

  // upload them to cloudinary, avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  if (!avatarLocalPath) {
    return res
      .status(400)
      .json(new ApiResponse(400, `Avatar file are requied`, "Faild"));
  }

  const avatarImage = await uploadOnCloudinary(avatarLocalPath);
  if (!avatarImage) {
    return res
      .status(400)
      .json(new ApiResponse(400, `Avatar is requied`, "Faild"));
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
    return res
      .status(500)
      .json(
        new ApiResponse(500, `Sorry somethig wrong on register User`, "Faild")
      );
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
  // sent referesh & access token done
  // sent cookies done

  // req body
  const { email, password } = req.body;
  //user email
  if (!email) {
    // throw new ApiError(400, "Email is required")
    return res
      .status(400)
      .json(new ApiResponse(400, "Email is required", "Unsuccessfull"));
  }

  // find the user
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "User does not exist!!!");
  }

  // password check
  const passwordValid = await user.isPasswordCorrect(password);
  if (!passwordValid) {
    // throw new ApiError(402, "Invalid user Password");
    return res
      .status(402)
      .json(new ApiResponse(402, "Invalid user Password", "Unsuccessfull"));
  }

  // accessToken & refreshToken
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
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
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    throw new ApiError(502, "Sever Problem can't logout");
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // get user incomingRefreshToken done
  // validation - not empty done
  // decodedToken done
  // CheckToken used or expired done
  // return respons done

  const incomingRefreshToke = req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToke) {
    throw new ApiError(401, "unanthorized request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToke,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(402, "Invalid refresh token");
    }

    if (incomingRefreshToke !== user?.refreshToken) {
      throw new ApiError(403, "Refresh Token is Used or Expired");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", newRefreshToken)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  // get data form frontend done
  // validation - not empty done
  // user find auth.middlewars done
  // check if user already exists? userName, email done
  // upload them to cloudinary, avatar done
  // create user object - create entry in db done
  // remove password and refresh token field from response done
  // check for user creation done
  // return respons done

  const { oldPassword, newPassword, comfirmPassword } = req.body;
  if (!(newPassword === comfirmPassword)) {
    throw new ApiError(402, "new password & old password not same!!!");
  }
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "User password incorrent give me right password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password change successfully!!!"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const accountDetailsUpdate = asyncHandler(async (req, res) => {
  const { userName } = req.body;

  if (!userName) {
    throw new ApiError(404, "UserName area is required");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        userName,
      },
    },
    { new: true }
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User update successfully!!!"));
});

const userAvatarUpdate = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file not found!!!");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Error upload file avatar");
  }
  const userUpdateAvatar = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");
  return res
    .status(200)
    .json(
      new ApiResponse(200, userAvatarUpdate, "Avatar update successfully!!!")
    );
});

export {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  accountDetailsUpdate,
  userAvatarUpdate,
};
