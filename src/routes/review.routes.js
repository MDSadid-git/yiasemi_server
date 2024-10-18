import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewars.js";
import {
  addReviewsUser,
  allReviews,
} from "../controllers/review.controller.js";

const router = Router();

router.route("/all-reviews").get(allReviews);
router.route("/add-reviews").post(verifyJWT, addReviewsUser);

export default router;
