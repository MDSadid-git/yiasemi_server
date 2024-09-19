import mongoose, { Schema } from "mongoose";

const cartSchma = new Schema(
  {
    menuId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowecase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
export const Cart = mongoose.model("Cart", cartSchma);
