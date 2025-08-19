import pkg from "crypto-js";
const { MD5 } = pkg;

import paymentRepository from "../repositories/payment.repository.js";

const hashPaymentDetails = async (orderId, amount) => {
  let merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
  let merchantId = process.env.PAYHERE_MERCHANT_ID;
  let currency = "LKR";

  let hashedSecret = MD5(merchantSecret).toString().toUpperCase();
  let amountFormated = parseFloat(amount)
    .toLocaleString("en-us", { minimumFractionDigits: 2 })
    .replaceAll(",", "");

  let hash = MD5(
    merchantId + orderId + amountFormated + currency + hashedSecret
  )
    .toString()
    .toUpperCase();

  return hash;
};

const createPayment = async (data) => {
  return await paymentRepository.createPayment(data);
};

// const getAllPayments = async () => {
//   return await paymentRepository.getAllPayments();
// };

// const getPaymentById = async (id) => {
//   return await paymentRepository.getPaymentById(id);
// };

// const updatePayment = async (id, data) => {
//   return await paymentRepository.updatePayment(id, data);
// };

// const deletePayment = async (id) => {
//   return await paymentRepository.deletePayment(id);
// };

export default {
  hashPaymentDetails,
  createPayment,
  // getAllPayments,
  // getPaymentById,
  // updatePayment,
  // deletePayment,
};
