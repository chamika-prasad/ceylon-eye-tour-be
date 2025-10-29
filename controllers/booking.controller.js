import bookingService from "../services/booking.service.js";

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
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const updatedBooking = await bookingService.updateBookingStatus(
      bookingId,
      status
    );
    return res.json({
      success: true,
      message: `Booking status updated successfully for booking ID ${bookingId}.`,
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

export default {
  getAllBookings,
  getBookingsByCustomerId,
  updateBookingStatus,
  createBooking,
  deleteBooking,
  updateBooking,
};
