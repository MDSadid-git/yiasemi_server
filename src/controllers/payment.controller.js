import { ApiResponse } from "../utils/ApiRespose.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Stripe from "stripe";
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

export { userPayment };
