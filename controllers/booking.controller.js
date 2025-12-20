import bookingService from "../services/booking.service.js";
import emailTemplateService from "../services/emailTemplate.service.js";
import authService from "../services/auth.service.js";
import packageService from "../services/package.service.js";
import emailService from "../services/email.service.js";
import dotenv from "dotenv";

dotenv.config();

const limit = process.env.PAGINATION_LIMIT || 10;

const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings();
    return res.json({
      success: true,
      message: "Bookings retrieved successfully.",
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings.",
      error: error.message,
    });
  }
};

const getBookingsByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;
    const bookings = await bookingService.getBookingsByCustomerId(customerId);
    return res.json({
      success: true,
      message: `Bookings for customer ID ${customerId} retrieved successfully.`,
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to retrieve bookings for customer ID ${customerId}.`,
      error: error.message,
    });
  }
};

const updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const { status } = req.body;
    const existingBooking = await bookingService.getBookingById(bookingId);
    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const updatedBooking = await bookingService.updateBookingStatus(
      bookingId,
      status
    );
    const customer = await authService.getUserById(
      existingBooking?.customer_id
    );

    let packageName =
      existingBooking?.Package?.dataValues?.title || "Custom Package";
    let customerName = customer?.name || "Customer";
    let customerEmail = customer?.email || "Customer";
    let date = existingBooking?.start_date
      ? new Date(existingBooking?.start_date)
      : new Date();
    let bookingNumber = existingBooking?.booking_no || "N/A";
    const template = emailTemplateService.generateInformBookingStatusTemplate(
      customerName,
      packageName,
      status,
      date,
      bookingNumber
    );

    await emailService.sendEmail({
      to: customerEmail,
      subject: "Booking Updated - Jwing Tours",
      html: template,
    });

    return res.json({
      success: true,
      message: `Booking ${status} for booking ID ${bookingNumber}.`,
      data: updatedBooking,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Failed to update booking status for booking ID ${bookingId}.`,
      error: error.message,
    });
  }
};

const createBooking = async (req, res) => {
  try {
    const {
      adultCount,
      childCount,
      startDate,
      packageId,
      customPackageId,
      message,
    } = req.body;

    const { userId } = req.user;

    if (packageId && customPackageId) {
      return res.status(400).json({
        success: false,
        message: "Provide either packageId or customPackageId, not both.",
      });
    }

    if (!startDate) {
      return res.status(400).json({
        success: false,
        message: "Start date is required",
      });
    }

    // Base booking data
    const bookingData = {
      adult_count: adultCount,
      child_count: childCount,
      start_date: startDate,
      customer_id: userId,
      message,
    };

    // Add package_id OR custom_package_id
    if (packageId) {
      bookingData.package_id = packageId;
    } else if (customPackageId) {
      bookingData.custom_package_id = customPackageId;
    } else {
      return res.status(400).json({
        success: false,
        message: "Either packageId or customPackageId is required.",
      });
    }

    const newBooking = await bookingService.createBooking(bookingData);
    // Send booking inform email
    const customer = await authService.getUserById(userId);
    let packageName = "Custom Package";

    if (packageId) {
      const pkg = await packageService.getPackageById(packageId);
      packageName = pkg?.package?.title || "Unknown Package";
    }

    const template = emailTemplateService.generateBookingInformTemplate(
      customer.name,
      packageName,
      new Date(newBooking.start_date),
      newBooking.booking_no
    );

    await emailService.sendEmail({
      to: process.env.EMAIL_USER,
      subject: "New Booking Created - Jwing Tours",
      html: template,
    });

    return res.status(201).json({
      success: true,
      data: newBooking,
      message: "Booking created successfully",
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Booking faild", error: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { adultCount, childCount, startDate, message } = req.body;

    if (!adultCount && !childCount && !message && !startDate) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }

    const existingBooking = await bookingService.getBookingById(id);
    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (
      existingBooking.status === "completed" ||
      existingBooking.status === "cancelled" ||
      existingBooking.status === "confirmed"
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot update a ${existingBooking.status} booking.`,
      });
    }

    // Update booking data
    const bookingUpdateData = {
      ...(adultCount && { adult_count: adultCount }),
      ...(childCount && { child_count: childCount }),
      ...(startDate && { start_date: startDate }),
      ...(message && { message }),
    };

    await bookingService.updateBooking(id, bookingUpdateData);

    return res
      .status(200)
      .json({ success: true, message: "Booking updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Booking faild", error: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const existingBooking = await bookingService.getBookingById(bookingId);
    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    if (
      existingBooking.status === "completed" ||
      existingBooking.status === "confirmed"
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete a ${existingBooking.status} booking.`,
      });
    }
    await bookingService.deleteBooking(bookingId);
    return res.json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// const getAllBookingsWithSearchAndPagination = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const searchTerm = req.query.search || "";
//     const pageLimit = parseInt(req.query.size) || limit;

//     // Validation
//     if (page < 1) {
//       return res.status(400).json({
//         success: false,
//         message: "Page must be greater than 0",
//       });
//     }

//     const result = await bookingService.getAllBookingsWithSearchAndPagination(
//       page,
//       searchTerm,
//       pageLimit
//     );

//     return res.status(200).json({
//       success: true,
//       data: result.bookings,
//       pagination: {
//         currentPage: result.currentPage,
//         totalPages: result.totalPages,
//         totalItems: result.totalItems,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching bookings:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// const getBookingsByCustomerIdWithSearchAndPagination = async (req, res) => {
//   try {
//     const customerId = req.params.customerId || req.user.id; // Adjust based on your auth setup
//     const page = parseInt(req.query.page) || 1;
//     const searchTerm = req.query.search || "";
//     const pageLimit = parseInt(req.query.size) || limit;

//     // Validation
//     if (page < 1) {
//       return res.status(400).json({
//         success: false,
//         message: "Page must be greater than 0",
//       });
//     }

//     if (!customerId) {
//       return res.status(400).json({
//         success: false,
//         message: "Customer ID is required",
//       });
//     }

//     const result =
//       await bookingService.getBookingsByCustomerIdWithSearchAndPagination(
//         customerId,
//         page,
//         searchTerm,
//         pageLimit
//       );

//     return res.status(200).json({
//       success: true,
//       data: result.bookings,
//       pagination: {
//         currentPage: result.currentPage,
//         totalPages: result.totalPages,
//         totalItems: result.totalItems,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching customer bookings:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

const getAllBookingsWithSearchAndPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const searchTerm = req.query.search || "";
    const pageSize =
      parseInt(req.query.size) || parseInt(process.env.PAGINATION_LIMIT) || 10;
    const year = req.query.year ? parseInt(req.query.year) : null;
    const month = req.query.month ? parseInt(req.query.month) : null;
    const date = req.query.date ? parseInt(req.query.date) : null;

    const status = parseInt(req.query.status) || 0;

    if (status < 0 || status > 4) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const validStatuses = [
      "all",
      "pending",
      "confirmed",
      "cancelled",
      "completed",
    ];
    var statusValue = validStatuses[status];

    // Validation
    if (page < 1) {
      return res.status(400).json({
        success: false,
        message: "Page must be greater than 0",
      });
    }

    // Validate year
    if (year && (year < 1900 || year > 2100)) {
      return res.status(400).json({
        success: false,
        message: "Year must be between 1900 and 2100",
      });
    }

    // Validate month
    if (month && (month < 1 || month > 12)) {
      return res.status(400).json({
        success: false,
        message: "Month must be between 1 and 12",
      });
    }

    // Validate date
    if (date && (date < 1 || date > 31)) {
      return res.status(400).json({
        success: false,
        message: "Date must be between 1 and 31",
      });
    }

    // Validate date dependencies
    if (month && !year) {
      return res.status(400).json({
        success: false,
        message: "Year is required when filtering by month",
      });
    }

    if (date && (!year || !month)) {
      return res.status(400).json({
        success: false,
        message: "Year and month are required when filtering by date",
      });
    }

    const result = await bookingService.getAllBookingsWithSearchAndPagination(
      page,
      searchTerm,
      pageSize,
      year,
      month,
      date,
      statusValue
    );

    return res.status(200).json({
      success: true,
      data: result.bookings,
      pagination: {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        pageSize: result.pageSize,
      },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getBookingsByCustomerIdWithSearchAndPagination = async (req, res) => {
  try {
    const customerId = req.params.customerId || req.user.id;
    const page = parseInt(req.query.page) || 1;
    const searchTerm = req.query.search || "";
    const pageSize =
      parseInt(req.query.size) || parseInt(process.env.PAGINATION_LIMIT) || 10;
    const year = req.query.year ? parseInt(req.query.year) : null;
    const month = req.query.month ? parseInt(req.query.month) : null;
    const date = req.query.date ? parseInt(req.query.date) : null;

    const status = parseInt(req.query.status) || 0;

    if (status < 0 || status > 4) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const validStatuses = [
      "all",
      "pending",
      "confirmed",
      "cancelled",
      "completed",
    ];
    var statusValue = validStatuses[status];

    // Validation
    if (page < 1) {
      return res.status(400).json({
        success: false,
        message: "Page must be greater than 0",
      });
    }

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required",
      });
    }

    // Validate year
    if (year && (year < 1900 || year > 2100)) {
      return res.status(400).json({
        success: false,
        message: "Year must be between 1900 and 2100",
      });
    }

    // Validate month
    if (month && (month < 1 || month > 12)) {
      return res.status(400).json({
        success: false,
        message: "Month must be between 1 and 12",
      });
    }

    // Validate date
    if (date && (date < 1 || date > 31)) {
      return res.status(400).json({
        success: false,
        message: "Date must be between 1 and 31",
      });
    }

    // Validate date dependencies
    if (month && !year) {
      return res.status(400).json({
        success: false,
        message: "Year is required when filtering by month",
      });
    }

    if (date && (!year || !month)) {
      return res.status(400).json({
        success: false,
        message: "Year and month are required when filtering by date",
      });
    }

    const result =
      await bookingService.getBookingsByCustomerIdWithSearchAndPagination(
        customerId,
        page,
        searchTerm,
        pageSize,
        year,
        month,
        date,
        statusValue
      );

    return res.status(200).json({
      success: true,
      data: result.bookings,
      pagination: {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        pageSize: result.pageSize,
      },
    });
  } catch (error) {
    console.error("Error fetching customer bookings:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllBookingsForCalendar = async (req, res) => {
  try {
    const year = req.query.year ? parseInt(req.query.year) : null;
    const month = req.query.month ? parseInt(req.query.month) : null;

    // Validate month and year
    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Year and month are required",
      });
    }

    // Validate year
    if (year && (year < 1900 || year > 2100)) {
      return res.status(400).json({
        success: false,
        message: "Year must be between 1900 and 2100",
      });
    }

    // Validate month
    if (month && (month < 1 || month > 12)) {
      return res.status(400).json({
        success: false,
        message: "Month must be between 1 and 12",
      });
    }

    const bookings = await bookingService.getAllBookingsForCalendar(
      year,
      month
    );

    return res.status(200).json({
      success: true,
      message: "Bookings for calendar retrieved successfully",
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings for calendar:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default {
  getAllBookings,
  getBookingsByCustomerId,
  updateBookingStatus,
  createBooking,
  deleteBooking,
  updateBooking,
  getBookingsByCustomerIdWithSearchAndPagination,
  getAllBookingsWithSearchAndPagination,
  getAllBookingsForCalendar,
};
