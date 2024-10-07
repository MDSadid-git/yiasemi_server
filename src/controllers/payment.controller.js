import mongoose from "mongoose";
import { Payment } from "../models/payment.model.js";
import { ApiResponse } from "../utils/ApiRespose.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Stripe from "stripe";
import { Cart } from "../models/cart.model.js";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const userPayment = asyncHandler(async (req, res) => {
  const { price } = req.body;
  if (isNaN(price)) {
    return res.status(400).json(new ApiResponse(400, price, "Faild"));
  }

  const amount = Math.round(price * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types: ["card"],
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { clientSecret: paymentIntent.client_secret },
        "Successful!!!"
      )
    );
});
const userPaymentList = asyncHandler(async (req, res) => {
  const payment = req.body;
  const paymentResult = await Payment.create(payment);
  const query = {
    _id: {
      $in: payment.cartIds.map((id) => new mongoose.Types.ObjectId(id)),
    },
  };
  const deleteResult = await Cart.deleteMany(query);
  console.log(deleteResult);
  return res
    .status(200)
    .json(new ApiResponse(200, { paymentResult, deleteResult }, "Successfull"));
});
const userPaymentHistory = asyncHandler(async (req, res) => {
  const email = req.user.email;

  const historyResult = await Payment.find({ email });
  return res
    .status(200)
    .json(new ApiResponse(200, historyResult, "Successfull"));
});

export { userPayment, userPaymentList, userPaymentHistory };
