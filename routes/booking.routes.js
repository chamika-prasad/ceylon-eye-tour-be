import express from "express";
import bookingController from "../controllers/booking.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

router.get(
  "/get-all",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  bookingController.getAllBookings
);
router.get("/customer/:customerId", bookingController.getBookingsByCustomerId);
router.put(
  "/:bookingId/status",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  bookingController.updateBookingStatus
);
router.put(
  "/update/:id",
  tokenMiddleware.verifyToken,
  bookingController.updateBooking
);
router.post(
  "/add",
  tokenMiddleware.verifyToken,
  bookingController.createBooking
);
router.delete("/:bookingId", bookingController.deleteBooking);

export default router;
