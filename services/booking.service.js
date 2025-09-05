import bookingRepository from "../repositories/booking.repository.js";

const getAllBookings = async () => {
  return await bookingRepository.getAllBookings();
};

const getBookingsByCustomerId = async (customerId) => {
  return await bookingRepository.getBookingsByCustomerId(customerId);
};

const updateBookingStatus = async (bookingId, newStatus) => {
  const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
  if (!validStatuses.includes(newStatus)) {
    throw new Error("Invalid status value");
  }

  const booking = await bookingRepository.updateBookingStatus(
    bookingId,
    newStatus
  );
  if (!booking) {
    throw new Error("Booking not found");
  }

  return booking;
};

const createBooking = async (data) => {

  return await bookingRepository.createBooking(data);
};

const deleteBooking = async (bookingId) => {
  const deleted = await bookingRepository.deleteBooking(bookingId);
  if (!deleted) {
    throw new Error("Booking not found");
  }
  return deleted;
};

export default {
  getAllBookings,
  getBookingsByCustomerId,
  updateBookingStatus,
  createBooking,
  deleteBooking,
};
