import { Router } from "express";
import {
  accountDetailsUpdate,
  adminSetUserRoll,
  allUser,
  changeCurrentPassword,
  getCurrentUser,
  isAdminCheck,
  loginUser,
  logOutUser,
  refreshAccessToken,
  registerUser,
  userAvatarUpdate,
  userDeleteByAddmin,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewars.js";

const router = Router();

// all user Router
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/users").get(verifyJWT, allUser);
router.route("/users/:id").delete(userDeleteByAddmin);
router.route("/admin/:id").patch(adminSetUserRoll);
router.route("/update-account").patch(verifyJWT, accountDetailsUpdate);
router.route("/admin/admin/:id").get(verifyJWT, isAdminCheck);
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), userAvatarUpdate);
export default router;
