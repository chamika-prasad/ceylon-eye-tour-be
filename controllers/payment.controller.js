import dotenv from "dotenv";
import axios from "axios";
import paymentService from "./../services/payment.service.js";
import secondPaymentService from "./../services/secondPayment.service.js";
import bookingService from "../services/booking.service.js";
import packageService from "../services/package.service.js";
import emailService from "../services/email.service.js";
import emailTemplateService from "../services/emailTemplate.service.js";
import path from "path";
import fileUploadService from "../services/fileUpload.service.js";
dotenv.config();

const hashPaymentDetails = async (req, res) => {
  try {
    const { orderId, amount, currency = "USD" } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }
    let forignCurrency = "USD";
    const hash = await paymentService.hashPaymentDetails(
      orderId,
      amount,
      // currency
      forignCurrency
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

    // const newPayment = await paymentService.createPayment({
    //   booking_id: bookingId,
    //   amount,
    //   currency,
    // });

    let forignCurrency = "USD";
    const paymentId = await paymentService.combineUuidWithRandom(bookingId);
    const hash = await paymentService.hashPaymentDetails(
      // newPayment.id,
      paymentId,
      amount,
      // currency
      forignCurrency
    );

    // return res.status(201).json({
    return res.status(200).json({
      success: true,
      // message: "Payment created successfully",
      message: "Payment hashed successfully",
      data: {
        hash,
        amount: amount,
        // paymentId: newPayment.id,
        paymentId: paymentId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      // message: "Error creating payment",
      message: "Error hashing payment",
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
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      method,
      status_message,
    } = req.body;

    const status = paymentService.getPaymentStatusString(status_code);
    const { uuid, randomString } = await paymentService.separateUuidAndRandom(
      order_id
    );
    // const updated = await paymentService.updatePayment(order_id, {
    //   payment_id: payment_id,
    //   method,
    //   status_message,
    //   status,
    // });

    const booking = await bookingService.getBookingById(uuid);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const bookingAmount = parseFloat(
      booking.Package?.price || booking.CustomPackage?.price || 0
    );
    const payhereAmount = parseFloat(payhere_amount);

    let amount = bookingAmount;
    let remainBalance = 0;
    let secondPaymentRequired = false;

    if (!Number.isNaN(payhereAmount) && payhereAmount < bookingAmount) {
      amount = payhereAmount;
      remainBalance = bookingAmount - payhereAmount;
      secondPaymentRequired = true;
    }

    // Check if booking already has a payment and secondPaymentRequired is true
    let newPayment;
    let isSecondPayment = false;
    if (booking.Payment && booking.Payment.id && booking.Payment.secondPaymentRequired) {
      // Create second payment record if first payment exists and second payment is required
      newPayment = await secondPaymentService.createSecondPayment({
        booking_id: uuid,
        first_payment_id: booking.Payment.id,
        payment_id: payment_id,
        amount,
        currency: payhere_currency || "USD",
        method,
        status,
        status_message,
        random_order_id: order_id,
      });
      isSecondPayment = true;
    } else {
      // Create regular payment record
      await paymentService.setPaymentsAsNotCurrentByBookingId(uuid);
      newPayment = await paymentService.createPayment({
        booking_id: uuid,
        payment_id: payment_id,
        amount,
        currency: payhere_currency || "USD",
        method,
        status,
        status_message,
        random_order_id: order_id,
        remainBalance,
        secondPaymentRequired,
      });
      isSecondPayment = false;
    }

    // if (!updated) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Payment not found or not updated",
    //   });
    // }

    // Retrieve the correct payment record based on type
    let paymentRecord;
    if (isSecondPayment) {
      paymentRecord = await secondPaymentService.getSecondPaymentById(newPayment.id);
    } else {
      paymentRecord = await paymentService.getPaymentById(newPayment.id);
    }

    const bookingRecord = await bookingService.getBookingById(
      paymentRecord.booking_id
    );

    if (bookingRecord) {
      const template = emailTemplateService.generateInvoiceTemplate(
        bookingRecord.Package?.title || "Custom Package",
        bookingRecord.User.name,
        paymentRecord.amount,
        paymentRecord.status,
        paymentRecord.updated_at,
        bookingRecord.booking_no
      );

      await emailService.sendEmail({
        to: bookingRecord.User.email,
        subject: "Payment Invoice - Jwing Tours",
        html: template,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment successfull",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating payment",
      error: error.message,
    });
  }
};

  // Transfer payment (requires uploaded document)
  const transferPayment = async (req, res) => {
    try {
      const { bookingId, amount } = req.body;

      if (!bookingId || !amount) {
        return res.status(400).json({
          success: false,
          message: "bookingId and amount are required",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Transfer document is required",
        });
      }

      const booking = await bookingService.getBookingById(bookingId);
      if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }

      const bookingAmount = parseFloat(
        booking.Package?.price || booking.CustomPackage?.price || 0
      );
      const payAmount = parseFloat(amount);

      let remainBalance = 0;
      let secondPaymentRequired = false;
      if (!Number.isNaN(payAmount) && payAmount < bookingAmount) {
        remainBalance = bookingAmount - payAmount;
        secondPaymentRequired = true;
      }

      // Save uploaded file to uploads/payments using fileUploadService
      const uploadDir = path.join("uploads", "payments");
      const filename = await fileUploadService.uploadFile(uploadDir, req.file);
      const sourceUrl = `/uploads/payments/${filename}`;

      // Determine whether to create second payment
      let newPayment;
      let isSecondPayment = false;
      if (booking.Payment && booking.Payment.id && booking.Payment.secondPaymentRequired) {
        newPayment = await secondPaymentService.createSecondPayment({
          booking_id: bookingId,
          first_payment_id: booking.Payment.id,
          payment_id: null,
          amount: payAmount,
          currency: "USD",
          method: "transfer",
          status: "pending",
          status_message: null,
          random_order_id: null,
          sourceUrl,
          paymentType: 1,
        });
        isSecondPayment = true;
      } else {
        await paymentService.setPaymentsAsNotCurrentByBookingId(bookingId);
        newPayment = await paymentService.createPayment({
          booking_id: bookingId,
          payment_id: null,
          amount: payAmount,
          currency: "USD",
          method: "transfer",
          status: "pending",
          status_message: null,
          random_order_id: null,
          remainBalance,
          secondPaymentRequired,
          sourceUrl,
          paymentType: 1,
        });
        isSecondPayment = false;
      }

      // Fetch payment record for email
      let paymentRecord = isSecondPayment
        ? await secondPaymentService.getSecondPaymentById(newPayment.id)
        : await paymentService.getPaymentById(newPayment.id);

      const bookingRecord = await bookingService.getBookingById(paymentRecord.booking_id);
      if (bookingRecord) {
        const template = emailTemplateService.generateInvoiceTemplate(
          bookingRecord.Package?.title || "Custom Package",
          bookingRecord.User.name,
          paymentRecord.amount,
          paymentRecord.status,
          paymentRecord.updated_at,
          bookingRecord.booking_no
        );

        await emailService.sendEmail({
          to: bookingRecord.User.email,
          subject: "Payment Invoice - Jwing Tours",
          html: template,
        });
      }

      return res.status(200).json({ success: true, message: "Transfer recorded" });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Error recording transfer", error: err.message });
    }
  };

  // Cash payment (no document required)
  const cashPayment = async (req, res) => {
    try {
      const { bookingId, amount } = req.body;

      if (!bookingId || !amount) {
        return res.status(400).json({
          success: false,
          message: "bookingId and amount are required",
        });
      }

      const booking = await bookingService.getBookingById(bookingId);
      if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }

      const bookingAmount = parseFloat(
        booking.Package?.price || booking.CustomPackage?.price || 0
      );
      const payAmount = parseFloat(amount);

      let remainBalance = 0;
      let secondPaymentRequired = false;
      if (!Number.isNaN(payAmount) && payAmount < bookingAmount) {
        remainBalance = bookingAmount - payAmount;
        secondPaymentRequired = true;
      }

      let newPayment;
      let isSecondPayment = false;
      if (booking.Payment && booking.Payment.id && booking.Payment.secondPaymentRequired) {
        newPayment = await secondPaymentService.createSecondPayment({
          booking_id: bookingId,
          first_payment_id: booking.Payment.id,
          payment_id: null,
          amount: payAmount,
          currency: "USD",
          method: "cash",
          status: "pending",
          status_message: null,
          random_order_id: null,
          paymentType: 2,
        });
        isSecondPayment = true;
      } else {
        await paymentService.setPaymentsAsNotCurrentByBookingId(bookingId);
        newPayment = await paymentService.createPayment({
          booking_id: bookingId,
          payment_id: null,
          amount: payAmount,
          currency: "USD",
          method: "cash",
          status: "pending",
          status_message: null,
          random_order_id: null,
          remainBalance,
          secondPaymentRequired,
          paymentType: 2,
        });
        isSecondPayment = false;
      }

      let paymentRecord = isSecondPayment
        ? await secondPaymentService.getSecondPaymentById(newPayment.id)
        : await paymentService.getPaymentById(newPayment.id);

      const bookingRecord = await bookingService.getBookingById(paymentRecord.booking_id);
      if (bookingRecord) {
        const template = emailTemplateService.generateInvoiceTemplate(
          bookingRecord.Package?.title || "Custom Package",
          bookingRecord.User.name,
          paymentRecord.amount,
          paymentRecord.status,
          paymentRecord.updated_at,
          bookingRecord.booking_no
        );

        await emailService.sendEmail({
          to: bookingRecord.User.email,
          subject: "Payment Invoice - Jwing Tours",
          html: template,
        });
      }

      return res.status(200).json({ success: true, message: "Cash payment recorded" });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Error recording cash payment", error: err.message });
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
    const { payment_id, description, pyament_record_id } = req.body;
    if (!payment_id || !description || !pyament_record_id) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const paymentRecord = await paymentService.getPaymentById(
      pyament_record_id
    );
    if (!paymentRecord) {
      return res
        .status(404)
        .json({ success: false, message: "Payment record not found" });
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

    const updated = await paymentService.updatePayment(pyament_record_id, {
      status: "chargedback",
    });

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: "Refound success but database update faild updated",
      });
    }

    return res.json({
      success: true,
      data: response.data,
      message: "Refund successful",
    });
  } catch (err) {
    console.error("Refund Error:", err.response?.data || err.message);

    return res.status(err.status || 500).json({
      success: false,
      message: "Refund failed",
      error: err.response?.data || err.message,
    });
  }
};

const refundSecondPayment = async (req, res) => {
  try {
    const { payment_id, description, pyament_record_id } = req.body;
    if (!payment_id || !description || !pyament_record_id) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const paymentRecord = await secondPaymentService.getSecondPaymentById(
      pyament_record_id
    );
    if (!paymentRecord) {
      return res
        .status(404)
        .json({ success: false, message: "Payment record not found" });
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

    const updated = await secondPaymentService.updateSecondPayment(pyament_record_id, {
      status: "chargedback",
    });

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: "Refound success but database update faild updated",
      });
    }

    return res.json({
      success: true,
      data: response.data,
      message: "Refund successful",
    });
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
  transferPayment,
  cashPayment,
  refundPayment,
  // getAllPayments,
  // getPaymentById,
  updatePayment,
  // deletePayment,
  refundSecondPayment,
};
