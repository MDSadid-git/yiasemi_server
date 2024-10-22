import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewars.js";
import {
  addReviewsUser,
  allReviews,
  userReviewsList,
} from "../controllers/review.controller.js";

const router = Router();

router.route("/all-reviews").get(allReviews);
router.route("/user-all-reviews").get(verifyJWT, userReviewsList);
router.route("/add-reviews").post(verifyJWT, addReviewsUser);

export default router;
