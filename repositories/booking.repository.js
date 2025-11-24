import {
  Booking,
  User,
  Package,
  Payment,
  Review,
  CustomizePackage,
} from "../models/index.js";

const getAllBookings = async () => {
  return await Booking.findAll({
    include: [
      {
        model: Package,
        as: "Package",
        attributes: ["title", "price", "duration"], // Include package title only
      },
      {
        model: CustomizePackage,
        as: "CustomPackage",
        attributes: ["message", "price", "required_day_count"], // Include package title only
      },
      {
        model: User,
        as: "User",
        attributes: ["name", "email","passport","country"], // Include customer name and email
      },
      {
        model: Review,
        as: "Review",
        attributes: ["rating", "review"], // Include review rating and comment
      },
      {
        model: Payment,
        as: "Payment",
        attributes: ["id", "payment_id", "amount", "status"], // Include payment details
      },
    ],
  });
};

const getBookingById = async (id) => {
  return await Booking.findByPk(id, {
    include: [
      {
        model: Package,
        as: "Package",
        attributes: ["title", "price", "duration"], // Include package title only
      },
      {
        model: CustomizePackage,
        as: "CustomPackage",
        attributes: ["message", "price", "required_day_count"], // Include package title only
      },
      {
        model: User,
        as: "User",
        attributes: ["name", "email",,"passport","country"], // Include customer name and email
      },
    ],
  });
};

const getBookingsByCustomerId = async (customerId) => {
  return await Booking.findAll({
    where: { customer_id: customerId, is_deleted: false },
    include: [
      {
        model: Package,
        as: "Package",
        attributes: ["title", "price", "duration"], // Include package title only
      },
      {
        model: Review,
        as: "Review",
        attributes: ["rating", "review"], // Include review rating and comment
      },
      {
        model: CustomizePackage,
        as: "CustomPackage",
        attributes: ["message", "price", "required_day_count"], // Include custom package title and price only
      },
      {
        model: Payment,
        as: "Payment",
        attributes: ["id", "payment_id", "amount", "status"], // Include payment details
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

const updateBooking = async (id, data) => {
  return await Booking.update(data, {
    where: { id },
  });
};

const deleteBooking = async (bookingId) => {
  // const booking = await Booking.findByPk(bookingId);
  // if (!booking) return null;

  // await booking.is_deleted = 1;
  // await booking.save();
  // return true;
  return await Booking.update(
    { is_deleted: true, status: "cancelled" },
    {
      where: { id: bookingId },
    }
  );
};

export default {
  getAllBookings,
  getBookingsByCustomerId,
  updateBookingStatus,
  createBooking,
  deleteBooking,
  getBookingById,
  updateBooking,
};
