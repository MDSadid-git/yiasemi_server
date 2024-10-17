import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewars.js";
import { addReviewsUser } from "../controllers/review.controller.js";

const router = Router();

router.route("/add-reviews").post(verifyJWT, addReviewsUser);

export default router;
