import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    bookingTime: {
      type: String,
      required: true,
    },
    numberOfGuests: {
      type: Number,
      required: true,
      min: 1,
    },
    specialRequests: {
      type: String,
      trim: true,
    },
    tableNumber: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
