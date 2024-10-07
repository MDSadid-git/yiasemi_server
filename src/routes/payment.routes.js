import { Router } from "express";
import {
  userPayment,
  userPaymentHistory,
  userPaymentList,
} from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewars.js";

const router = Router();

router.route("/userpaymenthistory").get(verifyJWT, userPaymentHistory);
router.route("/create-payment-intent").post(userPayment);
router.route("/userpayment").post(userPaymentList);
export default router;
