import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);
