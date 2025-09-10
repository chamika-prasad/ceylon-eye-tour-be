import express from "express";
import bookingController from "../controllers/booking.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

router.get("/get-all", bookingController.getAllBookings);
router.get("/customer/:customerId", bookingController.getBookingsByCustomerId);
router.put("/:bookingId/status",tokenMiddleware.authorizeAdmin, bookingController.updateBookingStatus);
router.post(
  "/add",
  tokenMiddleware.verifyToken,
  bookingController.createBooking
);
router.delete("/:bookingId", bookingController.deleteBooking);

export default router;
