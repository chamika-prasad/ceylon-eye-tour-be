import express from "express";
import paymentController from "../controllers/payment.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Route to hash payment details
router.post(
  "/hash-payment",
  tokenMiddleware.verifyToken,
  paymentController.hashPaymentDetails
);

// ✅ Create a new payment
router.post("/add", paymentController.createPayment);

// Transfer payment (requires document upload)
router.post(
  "/transfer",
  upload.single("document"),
  tokenMiddleware.verifyToken,
  paymentController.transferPayment
);

// Cash payment
router.post("/cash", tokenMiddleware.verifyToken, tokenMiddleware.authorizeAdmin, paymentController.cashPayment);

// // ✅ Get all payments
// router.get("/", paymentController.getAllPayments);

// // ✅ Get payment by ID
// router.get("/:id", paymentController.getPaymentById);

// ✅ Update payment by ID
router.post("/update", paymentController.updatePayment);

router.post(
  "/refund",
  tokenMiddleware.verifyToken, tokenMiddleware.authorizeAdmin,
  paymentController.refundPayment
);

// // ✅ Delete payment by ID
// router.delete("/:id", paymentController.deletePayment);

router.post(
  "/refund-second-payment",
  tokenMiddleware.verifyToken, tokenMiddleware.authorizeAdmin,
  paymentController.refundSecondPayment
);

router.post(
  "/refund-both",
  tokenMiddleware.verifyToken, tokenMiddleware.authorizeAdmin,
  paymentController.refundBothPayments
);

// Update payment record status by type (1=Payment, 2=SecondPayment)
router.post(
  "/update-record-status",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  paymentController.updatePaymentRecordStatus
);

export default router;
