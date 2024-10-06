import { Router } from "express";
import { userPayment } from "../controllers/payment.controller.js";

const router = Router();

router.route("/create-payment-intent").post(userPayment);
export default router;
