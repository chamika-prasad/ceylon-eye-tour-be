import dotenv from "dotenv";
import axios from "axios";
import paymentService from "./../services/payment.service.js";
import bookingService from "../services/booking.service.js";
dotenv.config();

const hashPaymentDetails = async (req, res) => {
  try {
    const { orderId, amount, currency = "LKR" } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const hash = await paymentService.hashPaymentDetails(
      orderId,
      amount,
      currency
    );

    return res.status(200).json({
      success: true,
      message: "Payment hash generated successfully",
      data: { hash },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error generating payment hash",
      error: error.message,
    });
  }
};

// ✅ Create a new payment
const createPayment = async (req, res) => {
  try {
    const { bookingId, currency } = req.body;

    if (!bookingId || !currency) {
      return res.status(400).json({
        success: false,
        message: "bookingId and currency are required",
      });
    }

    const booking = await bookingService.getBookingById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const amount = booking.Package?.price || booking.CustomPackage?.price;

    const newPayment = await paymentService.createPayment({
      booking_id: bookingId,
      amount,
      currency,
    });

    const hash = await paymentService.hashPaymentDetails(
      newPayment.id,
      amount,
      currency
    );

    return res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: {
        hash,
        amount: amount,
        paymentId: newPayment.id,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating payment",
      error: error.message,
    });
  }
};

// // ✅ Get all payments
// const getAllPayments = async (req, res) => {
//   try {
//     const payments = await paymentService.getAllPayments();
//     return res.status(200).json({
//       success: true,
//       message: "Payments retrieved successfully",
//       data: payments,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error retrieving payments",
//       error: error.message,
//     });
//   }
// };

// // ✅ Get payment by ID
// const getPaymentById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const payment = await paymentService.getPaymentById(id);

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: "Payment not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Payment retrieved successfully",
//       data: payment,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error retrieving payment",
//       error: error.message,
//     });
//   }
// };

// // ✅ Update payment
const updatePayment = async (req, res) => {
  try {
    const {
      merchant_id,
      order_id,
      payment_id,
      status_code,
      md5sig,
      method,
      status_message,
    } = req.body;

    const status = paymentService.getPaymentStatusString(status_code);

    const updated = await paymentService.updatePayment(order_id, {
      payment_id: payment_id,
      method,
      status_message,
      status,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Payment not found or not updated",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating payment",
      error: error.message,
    });
  }
};

// // ✅ Delete payment
// const deletePayment = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deleted = await paymentService.deletePayment(id);

//     if (!deleted) {
//       return res.status(404).json({
//         success: false,
//         message: "Payment not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Payment deleted successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error deleting payment",
//       error: error.message,
//     });
//   }
// };

// Get access token from PayHere

// Refund Payment
const refundPayment = async (req, res) => {
  try {
    const { payment_id, description } = req.body;
    if (!payment_id || !description) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const token = await paymentService.getAccessToken();
    const PAYHERE_REFUND_URL =
      process.env.PAYHERE_MODE === "live"
        ? "https://www.payhere.lk/merchant/v1/payment/refund"
        : "https://sandbox.payhere.lk/merchant/v1/payment/refund";

    const response = await axios.post(
      PAYHERE_REFUND_URL,
      { payment_id, description },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.json({ success: true, data: response.data });
  } catch (err) {
    console.error("Refund Error:", err.response?.data || err.message);
    
    return res.status(err.status || 500).json({
      success: false,
      message: "Refund failed",
      error: err.response?.data || err.message,
    });
  }
};

export default {
  hashPaymentDetails,
  createPayment,
  refundPayment,
  // getAllPayments,
  // getPaymentById,
  updatePayment,
  // deletePayment,
};
