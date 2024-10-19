import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewars.js";

const router = Router();

router.route("/all-booking").get();
router.route("/add-booking").post(verifyJWT);

export default router;
