import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewars.js";
import {
  userAddBooking,
  userBookingList,
} from "../controllers/booking.controller.js";

const router = Router();

router.route("/all-booking").get(verifyJWT, userBookingList);
router.route("/add-booking").post(verifyJWT, userAddBooking);

export default router;
