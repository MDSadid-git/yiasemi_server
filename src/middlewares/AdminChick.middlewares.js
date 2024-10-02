import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyAdmin = asyncHandler(async (req, _, next) => {
  try {
    const adminEmail = req.user.roll;

    // const adminUser = await User.findOne({ email: adminEmail.user });

    const isAdmin = adminEmail === "Admin";
    if (!isAdmin) {
      return res.status(401).json(new ApiResponse(401, "User is Not Admin"));
    }
    next();
  } catch (error) {
    throw new ApiError(403, "Invalid Admin Sorry");
  }
});
