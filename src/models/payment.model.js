import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    cartIds: {
      type: Array,
      required: true,
    },
    menuItemIds: {
      type: Array,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.model("Payment", paymentSchema);
