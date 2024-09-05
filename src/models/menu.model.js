import mongoose, { Schema } from "mongoose";

const menuSchema = new Schema(
  {
    menuName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    recipeName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: true,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
export const Menu = mongoose.model("Menu", menuSchema);
