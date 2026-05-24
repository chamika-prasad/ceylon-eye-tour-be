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
    const { bookingId, currency, amount } = req.body;

    if (!bookingId || !currency || !amount) {
      return res.status(400).json({
        success: false,
        message: "bookingId, currency, and amount are required",
      });
    }

    const booking = await bookingService.getBookingById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // const amount = booking.Package?.price || booking.CustomPackage?.price;

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
        status: "success",
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
        status: "success",
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

    if (response && response.status && response.status == 1) {
      const updated = await paymentService.updatePayment(pyament_record_id, {
        status: "refund",
      });

      if (!updated) {
        return res.status(400).json({
          success: false,
          message: "Refound success but database update faild updated",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: response?.error || response?.msg || "Something went wrong",
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


    if (response && response.status && response.status == 1) {
      const updated = await secondPaymentService.updateSecondPayment(pyament_record_id, {
        status: "refund",
      });

      if (!updated) {
        return res.status(400).json({
          success: false,
          message: "Refund success but database update faild updated",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: response?.error || response?.msg || "Something went wrong",
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

// Update payment record status by type
const updatePaymentRecordStatus = async (req, res) => {
  try {
    const { type, id } = req.body;

    // Validation
    if (!type || !id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: type and id are required",
      });
    }

    // Validate type
    if (type !== 1 && type !== 2) {
      return res.status(400).json({
        success: false,
        message: "Invalid type. Type must be 1 (Payment) or 2 (SecondPayment)",
      });
    }

    var status = "success";

    if (type === 1) {
      // Update Payment table
      const payment = await paymentService.getPaymentById(id);
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment record not found",
        });
      }

      const updated = await paymentService.updatePayment(id, { status });
      if (!updated) {
        return res.status(400).json({
          success: false,
          message: "Failed to update payment record",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Payment record status updated successfully",
        data: { id, type: "Payment", status },
      });
    } else if (type === 2) {
      // Update SecondPayment table
      const secondPayment = await secondPaymentService.getSecondPaymentById(id);
      if (!secondPayment) {
        return res.status(404).json({
          success: false,
          message: "Second payment record not found",
        });
      }

      const updated = await secondPaymentService.updateSecondPayment(id, { status });
      if (!updated) {
        return res.status(400).json({
          success: false,
          message: "Failed to update second payment record",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Second payment record status updated successfully",
        data: { id, type: "SecondPayment", status },
      });
    }
  } catch (error) {
    console.error("Error updating payment record status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const refundBothPayments = async (req, res) => {
  try {
    const {
      first_payment_id,
      first_pyament_record_id,
      second_payment_id,
      second_pyament_record_id,
      description,
    } = req.body;

    if (!first_payment_id || !first_pyament_record_id || !second_payment_id || !second_pyament_record_id || !description) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const firstPaymentRecord = await paymentService.getPaymentById(
      first_pyament_record_id
    );

    if (!firstPaymentRecord) {
      return res
        .status(404)
        .json({ success: false, message: "First payment record not found" });
    }

    const secondPaymentRecord = await secondPaymentService.getSecondPaymentById(
      second_pyament_record_id
    );

    if (!secondPaymentRecord) {
      return res
        .status(404)
        .json({ success: false, message: "Second payment record not found" });
    }

    const token = await paymentService.getAccessToken();

    let errorMessage = "";

    const PAYHERE_REFUND_URL =
      process.env.PAYHERE_MODE === "live"
        ? "https://www.payhere.lk/merchant/v1/payment/refund"
        : "https://sandbox.payhere.lk/merchant/v1/payment/refund";

    const firstResponse = await axios.post(
      PAYHERE_REFUND_URL,
      { payment_id: first_payment_id, description },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );


    if (firstResponse && firstResponse.status && firstResponse.status == 1) {
      const firstUpdated = await paymentService.updateSecondPayment(first_pyament_record_id, {
        status: "refund",
      });

      if (!firstUpdated) {
        errorMessage = "First payment refund success but database update failed";
      }

      const secondResponse = await axios.post(
        PAYHERE_REFUND_URL,
        { payment_id: second_payment_id, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (secondResponse && secondResponse.status && secondResponse.status == 1) {
        const secondUpdated = await secondPaymentService.updateSecondPayment(second_pyament_record_id, {
          status: "refund",
        });

        if (!secondUpdated) {
          errorMessage = errorMessage + "," + "Second payment refund success but database update failed";
        }
      } else {
        errorMessage = errorMessage + "," + (secondResponse?.error || secondResponse?.msg || "Something went wrong in second payment refund");
      }
    } else {
      errorMessage = firstResponse?.error || firstResponse?.msg || "Something went wrong in first payment refund";
    }

    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    return res.json({
      success: true,
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
  refundBothPayments,
  updatePaymentRecordStatus,
};
