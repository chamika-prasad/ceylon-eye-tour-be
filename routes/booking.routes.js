import express from "express";
import bookingController from "../controllers/booking.controller.js";

const router = express.Router();

router.get("/get-all", bookingController.getAllBookings);
router.get("/customer/:customerId", bookingController.getBookingsByCustomerId);
router.put("/:bookingId/status", bookingController.updateBookingStatus);
router.post("/add", bookingController.createBooking);
router.delete("/:bookingId", bookingController.deleteBooking);

export default router;