import {
  Booking,
  User,
  Package,
  Payment,
  SecondPayment,
  Review,
  CustomizePackage,
} from "../models/index.js";
import { Op } from "sequelize";

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
        attributes: [
          "id",
          "payment_id",
          "amount",
          "status",
          "paymentType",
          "remainBalance",
          "secondPaymentRequired",
          "sourceUrl",
        ], // Include payment details
        where: { is_current: true },
        required: false, // IMPORTANT: keeps bookings even if no payment exists
        include: [
          {
            model: SecondPayment,
            as: "SecondPayment",
            attributes: [
              "id",
              "payment_id",
              "amount",
              "currency",
              "method",
              "status",
              "status_message",
              "random_order_id",
              "paymentType",
              "sourceUrl",
            ],
            required: false,
          },
        ],
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
        attributes: ["name", "email", "passport", "country"], // Include customer name and email
      },
      {
        model: Payment,
        as: "Payment",
        attributes: [
          "id",
          "payment_id",
          "amount",
          "status",
          "paymentType",
          "remainBalance",
          "secondPaymentRequired",
          "sourceUrl",
        ],
        where: { is_current: true },
        required: false, // IMPORTANT: keeps bookings even if no payment exists
        include: [
          {
            model: SecondPayment,
            as: "SecondPayment",
            attributes: [
              "id",
              "payment_id",
              "amount",
              "currency",
              "method",
              "status",
              "status_message",
              "random_order_id",
              "paymentType",
              "sourceUrl",
            ],
            required: false,
          },
        ],
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
        attributes: [
          "id",
          "payment_id",
          "amount",
          "status",
          "paymentType",
          "remainBalance",
          "secondPaymentRequired",
          "sourceUrl",
        ], // Include payment details
        where: { is_current: true },
        required: false, // IMPORTANT: keeps bookings even if no payment exists
        include: [
          {
            model: SecondPayment,
            as: "SecondPayment",
            attributes: [
              "id",
              "payment_id",
              "amount",
              "currency",
              "method",
              "status",
              "status_message",
              "random_order_id",
              "paymentType",
              "sourceUrl",
            ],
            required: false,
          },
        ],
      },
      {
        model: User,
        as: "User",
        attributes: ["email"], // Include customer name and email
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
  searchTerm = "",
  limit = 10,
  year = null,
  month = null,
  date = null,
  status = "all"
) => {
  const offset = (page - 1) * limit;

  // Build where clause for searching across related tables
  const whereClause = {};

  if (status !== "all") {
    whereClause.status = status;
  }

  // Add search conditions
  if (searchTerm) {
    whereClause[Op.or] = [
      // Search in User name
      { "$User.name$": { [Op.like]: `%${searchTerm}%` } },
      // Search in Package title
      { "$Package.title$": { [Op.like]: `%${searchTerm}%` } },
      // Search in CustomPackage message
      { "$CustomPackage.message$": { [Op.like]: `%${searchTerm}%` } },
    ];
  }

  // Add date filters
  if (year) {
    if (month) {
      if (date) {
        // Filter by specific date (year/month/date)
        const specificDate = `${year}-${String(month).padStart(
          2,
          "0"
        )}-${String(date).padStart(2, "0")}`;
        whereClause.start_date = specificDate;
      } else {
        // Filter by year and month (year/month)
        const startOfMonth = `${year}-${String(month).padStart(2, "0")}-01`;
        const endOfMonth = new Date(year, month, 0).getDate();
        const endOfMonthDate = `${year}-${String(month).padStart(
          2,
          "0"
        )}-${String(endOfMonth).padStart(2, "0")}`;
        whereClause.start_date = {
          [Op.between]: [startOfMonth, endOfMonthDate],
        };
      }
    } else {
      // Filter by year only
      const startOfYear = `${year}-01-01`;
      const endOfYear = `${year}-12-31`;
      whereClause.start_date = {
        [Op.between]: [startOfYear, endOfYear],
      };
    }
  }

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
        attributes: [
          "id",
          "payment_id",
          "amount",
          "status",
          "paymentType",
          "remainBalance",
          "secondPaymentRequired",
          "sourceUrl",
        ],
        where: { is_current: true },
        required: false, // IMPORTANT: keeps bookings even if no payment exists
        include: [
          {
            model: SecondPayment,
            as: "SecondPayment",
            attributes: [
              "id",
              "payment_id",
              "amount",
              "currency",
              "method",
              "status",
              "status_message",
              "random_order_id",
              "paymentType",
              "sourceUrl",
            ],
            required: false,
          },
        ],
      },
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    distinct: true,
    subQuery: false, // Important for $ notation in where clause
    order: [["created_at", "DESC"]],
  });

  return {
    bookings: rows,
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    pageSize: parseInt(limit),
  };
};

const getBookingsByCustomerIdWithSearchAndPagination = async (
  customerId,
  page = 1,
  searchTerm = "",
  limit = 10,
  year = null,
  month = null,
  date = null,
  status = "all"
) => {
  const offset = (page - 1) * limit;

  // Build where clause combining customer filter with search
  const whereClause = {
    customer_id: customerId,
    is_deleted: false,
  };

  if (status !== "all") {
    whereClause.status = status;
  }

  // Add search conditions
  if (searchTerm) {
    whereClause[Op.or] = [
      // Search in Package title
      { "$Package.title$": { [Op.like]: `%${searchTerm}%` } },
      // Search in CustomPackage message
      { "$CustomPackage.message$": { [Op.like]: `%${searchTerm}%` } },
    ];
  }

  // Add date filters
  if (year) {
    if (month) {
      if (date) {
        // Filter by specific date (year/month/date)
        const specificDate = `${year}-${String(month).padStart(
          2,
          "0"
        )}-${String(date).padStart(2, "0")}`;
        whereClause.start_date = specificDate;
      } else {
        // Filter by year and month (year/month)
        const startOfMonth = `${year}-${String(month).padStart(2, "0")}-01`;
        const endOfMonth = new Date(year, month, 0).getDate();
        const endOfMonthDate = `${year}-${String(month).padStart(
          2,
          "0"
        )}-${String(endOfMonth).padStart(2, "0")}`;
        whereClause.start_date = {
          [Op.between]: [startOfMonth, endOfMonthDate],
        };
      }
    } else {
      // Filter by year only
      const startOfYear = `${year}-01-01`;
      const endOfYear = `${year}-12-31`;
      whereClause.start_date = {
        [Op.between]: [startOfYear, endOfYear],
      };
    }
  }

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
        attributes: [
          "id",
          "payment_id",
          "amount",
          "status",
          "paymentType",
          "remainBalance",
          "secondPaymentRequired",
          "sourceUrl",
        ],
        where: { is_current: true },
        required: false, // IMPORTANT: keeps bookings even if no payment exists
        include: [
          {
            model: SecondPayment,
            as: "SecondPayment",
            attributes: [
              "id",
              "payment_id",
              "amount",
              "currency",
              "method",
              "status",
              "status_message",
              "random_order_id",
              "paymentType",
              "sourceUrl",
            ],
            required: false,
          },
        ],
      },
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    distinct: true,
    subQuery: false,
    order: [["created_at", "DESC"]],
  });

  return {
    bookings: rows,
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    pageSize: parseInt(limit),
  };
};

const getAllBookingsForCalender = async (year = null, month = null) => {
  // Build where clause for searching across related tables
  const whereClause = {};

  // Add date filters
  if (year) {
    if (month) {
      const startOfMonth = `${year}-${String(month).padStart(2, "0")}-01`;
      const endOfMonth = new Date(year, month, 0).getDate();
      const endOfMonthDate = `${year}-${String(month).padStart(
        2,
        "0"
      )}-${String(endOfMonth).padStart(2, "0")}`;
      whereClause.start_date = {
        [Op.between]: [startOfMonth, endOfMonthDate],
      };
    }
  }

  return await Booking.findAll({
    where: whereClause,
    attributes: {
      exclude: [
        "adult_count",
        "child_count",
        "message",
        "is_deleted",
        "updated_at",
        "package_id",
        "custom_package_id",
        "customer_id",
        "created_at",
      ],
    },
    include: [
      {
        model: Package,
        as: "Package",
        attributes: ["title"],
      },
      {
        model: CustomizePackage,
        as: "CustomPackage",
        attributes: ["message"],
      },
      {
        model: User,
        as: "User",
        attributes: ["name", "country"],
      },
    ],
    distinct: true,
    subQuery: false, // Important for $ notation in where clause
    order: [["created_at", "DESC"]],
  });
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
  getAllBookingsForCalender,
};
