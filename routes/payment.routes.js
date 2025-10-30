import express from "express";
import paymentController from "../controllers/payment.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

// Route to hash payment details
router.post(
  "/hash-payment",
  tokenMiddleware.verifyToken,
  paymentController.hashPaymentDetails
);

// ✅ Create a new payment
router.post("/add", paymentController.createPayment);

// // ✅ Get all payments
// router.get("/", paymentController.getAllPayments);

// // ✅ Get payment by ID
// router.get("/:id", paymentController.getPaymentById);

// ✅ Update payment by ID
router.post("/update", paymentController.updatePayment);

router.post(
  "/refund",
//   tokenMiddleware.verifyToken,
//   tokenMiddleware.authorizeAdmin,
  paymentController.refundPayment
);

// // ✅ Delete payment by ID
// router.delete("/:id", paymentController.deletePayment);

export default router;
