import dotenv from "dotenv";
import paymentService from "./../services/payment.service.js";
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
    const { bookingId, paymentId, amount, status } = req.body;

    if (!bookingId || !paymentId || !amount) {
      return res.status(400).json({
        success: false,
        message: "bookingId, paymentId, and amount are required",
      });
    }

    const newPayment = await paymentService.createPayment({
      booking_id: bookingId,
      payment_id: paymentId,
      amount,
      status: status || "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: newPayment,
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
// const updatePayment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { paymentId, amount, status } = req.body;

//     const updated = await paymentService.updatePayment(id, {
//       payment_id: paymentId,
//       amount,
//       status,
//     });

//     if (!updated) {
//       return res.status(404).json({
//         success: false,
//         message: "Payment not found or not updated",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Payment updated successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error updating payment",
//       error: error.message,
//     });
//   }
// };

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

export default {
  hashPaymentDetails,
  createPayment,
  // getAllPayments,
  // getPaymentById,
  // updatePayment,
  // deletePayment,
};
