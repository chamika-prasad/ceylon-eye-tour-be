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
      message,
    } = req.body;

    const { userId } = req.user;
    
    const newBooking = await bookingService.createBooking({
      adult_count: adultCount,
      child_count: childCount,
      start_date: startDate,
      package_id: packageId,
      customer_id: userId,
      message,
    });

    return res.status(201).json({ success: true, data: newBooking });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    await bookingService.deleteBooking(bookingId);
    return res.json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

export default {
  getAllBookings,
  getBookingsByCustomerId,
  updateBookingStatus,
  createBooking,
  deleteBooking,
};
