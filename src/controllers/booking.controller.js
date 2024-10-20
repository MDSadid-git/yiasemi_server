import { Booking } from "../models/booking.model.js";
import { ApiResponse } from "../utils/ApiRespose.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const userBookingList = asyncHandler(async (req, res) => {
  const email = req.user.email;

  const result = await Booking.find({ email });

  if (!result) {
    return res
      .status(500)
      .json(new ApiResponse(500, "User set no Booking", "No Booking"));
  }
  return res.status(200).json(new ApiResponse(200, result, "Successfull"));
});

const userAddBooking = asyncHandler(async (req, res) => {
  const {
    customerName,
    email,
    phoneNumber,
    bookingDate,
    bookingTime,
    numberOfGuests,
    specialRequests,
  } = req.body;
  const formattedBookingDate = new Date(bookingDate)
    .toISOString()
    .split("T")[0];
  if (
    [
      customerName,
      email,
      phoneNumber,
      bookingDate,
      bookingTime,
      numberOfGuests,
    ].some((field) => field?.trim() === "")
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All File are requied", "Faild"));
  }

  const existedBooking = await Booking.findOne({
    $or: [{ bookingDate: new Date(formattedBookingDate) }, { bookingTime }],
  });

  if (
    // existedBooking?.bookingDate == bookingDate &&
    existedBooking?.bookingTime == bookingTime
  ) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          `Sorry ${bookingDate} ${bookingTime} are not free`,
          "Faild"
        )
      );
  }

  const result = await Booking.create({
    customerName,
    email,
    phoneNumber,
    bookingDate: new Date(formattedBookingDate),
    bookingTime,
    numberOfGuests,
    specialRequests,
  });
  return res.status(200).json(new ApiResponse(200, result, "Successfull"));
});
export { userAddBooking, userBookingList };
