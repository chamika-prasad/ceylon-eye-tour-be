import { Booking, User, Package, Payment, Review } from "../models/index.js";

const getAllBookings = async () => {
  return await Booking.findAll({
    include: [
      {
        model: Package,
        as: "Package",
        attributes: ["title"], // Include package title only
      },
      {
        model: User,
        as: "User",
        attributes: ["name", "email"], // Include customer name and email
      },
      {
        model: Review,
        as: "Review",
        attributes: ["rating", "review"], // Include review rating and comment
      },
      {
        model: Payment,
        as: "Payment",
        attributes: ["id","payment_id", "amount", "status"], // Include payment details
      },
    ],
  });
};

const getBookingsByCustomerId = async (customerId) => {
  return await Booking.findAll({
    where: { customer_id: customerId },
    include: [
      {
        model: Package,
        as: "Package",
        attributes: ["title"], // Include package title only
      },
      {
        model: Review,
        as: "Review",
        attributes: ["rating", "review"], // Include review rating and comment
      },
    ],
  });
};

const updateBookingStatus = async (bookingId, newStatus) => {
  const booking = await Booking.findByPk(bookingId);
  if (!booking) return null;

  booking.status = newStatus;
  await booking.save();
  return booking;
};

const createBooking = async (data) => {
  return await Booking.create(data);
};

const deleteBooking = async (bookingId) => {
  const booking = await Booking.findByPk(bookingId);
  if (!booking) return null;

  await booking.destroy();
  return true;
};

export default {
  getAllBookings,
  getBookingsByCustomerId,
  updateBookingStatus,
  createBooking,
  deleteBooking,
};
