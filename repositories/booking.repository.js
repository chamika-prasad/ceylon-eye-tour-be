import dotenv from "dotenv";
import {
  Booking,
  User,
  Package,
  Payment,
  Review,
  CustomizePackage,
} from "../models/index.js";
import { Op } from "sequelize";

dotenv.config();

const limit = process.env.PAGINATION_LIMIT || 10;

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
        attributes: ["name", "email", "passport", "country"], // Include customer name and email
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
        attributes: ["name", "email", , "passport", "country"], // Include customer name and email
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

const getAllBookingsWithSearchAndPagination = async (
  page = 1,
  searchTerm = ""
) => {
  const offset = (page - 1) * limit;

  // Build where clause for searching across related tables
  const whereClause = searchTerm
    ? {
        [Op.or]: [
          // Search in User name
          { "$User.name$": { [Op.like]: `%${searchTerm}%` } },
          // Search in Package title
          { "$Package.title$": { [Op.like]: `%${searchTerm}%` } },
          // Search in CustomPackage message
          { "$CustomPackage.message$": { [Op.like]: `%${searchTerm}%` } },
        ],
      }
    : {};

  const { count, rows } = await Booking.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: Package,
        as: "Package",
        attributes: ["title", "price", "duration"],
      },
      {
        model: CustomizePackage,
        as: "CustomPackage",
        attributes: ["message", "price", "required_day_count"],
      },
      {
        model: User,
        as: "User",
        attributes: ["name", "email", "passport", "country"],
      },
      {
        model: Review,
        as: "Review",
        attributes: ["rating", "review"],
      },
      {
        model: Payment,
        as: "Payment",
        attributes: ["id", "payment_id", "amount", "status"],
      },
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    distinct: true, // Important: prevents count from being affected by joins
    order: [["created_at", "DESC"]],
  });

  return {
    bookings: rows,
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
  };
};

const getBookingsByCustomerIdWithSearchAndPagination = async (
  customerId,
  page = 1,
  searchTerm = ""
) => {
  const offset = (page - 1) * limit;

  // Build where clause combining customer filter with search
  const whereClause = {
    customer_id: customerId,
    is_deleted: false,
    ...(searchTerm && {
      [Op.or]: [
        // Search in Package title
        { "$Package.title$": { [Op.like]: `%${searchTerm}%` } },
        // Search in CustomPackage message
        { "$CustomPackage.message$": { [Op.like]: `%${searchTerm}%` } },
      ],
    }),
  };

  const { count, rows } = await Booking.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: Package,
        as: "Package",
        attributes: ["title", "price", "duration"],
      },
      {
        model: Review,
        as: "Review",
        attributes: ["rating", "review"],
      },
      {
        model: CustomizePackage,
        as: "CustomPackage",
        attributes: ["message", "price", "required_day_count"],
      },
      {
        model: Payment,
        as: "Payment",
        attributes: ["id", "payment_id", "amount", "status"],
      },
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    distinct: true, // Prevents count from being affected by joins
    order: [["created_at", "DESC"]],
  });

  return {
    bookings: rows,
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
  };
};

export default {
  getAllBookings,
  getBookingsByCustomerId,
  getAllBookingsWithSearchAndPagination,
  getBookingsByCustomerIdWithSearchAndPagination,
  updateBookingStatus,
  createBooking,
  deleteBooking,
  getBookingById,
  updateBooking,
};
