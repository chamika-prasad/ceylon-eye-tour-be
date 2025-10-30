import dotenv from "dotenv";
import pkg from "crypto-js";
import axios from "axios";
import paymentRepository from "../repositories/payment.repository.js";
const { MD5 } = pkg;
dotenv.config();

let accessToken = null;
let tokenExpiry = null;

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

// Map PayHere numeric status to string
const getPaymentStatusString = (statusCode) => {
  const statusMap = {
    2: "success",
    0: "pending",
    "-1": "canceled",
    "-2": "failed",
    "-3": "chargedback",
  };

  return statusMap[statusCode] || "unknown";
};

// const getAllPayments = async () => {
//   return await paymentRepository.getAllPayments();
// };

// const getPaymentById = async (id) => {
//   return await paymentRepository.getPaymentById(id);
// };

const updatePayment = async (id, data) => {
  return await paymentRepository.updatePayment(id, data);
};

// const deletePayment = async (id) => {
//   return await paymentRepository.deletePayment(id);
// };
const getAccessToken = async () => {
  // If token still valid, reuse it
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const AUTH_CODE = btoa(process.env.PAYHERE_APP_ID+":"+process.env.PAYHERE_APP_SECRET);
  console.log(AUTH_CODE);
  
  const PAYHERE_TOKEN_URL =
    process.env.PAYHERE_MODE === "live"
      ? "https://www.payhere.lk/merchant/v1/oauth/token"
      : "https://sandbox.payhere.lk/merchant/v1/oauth/token";

  const headers = {
    Authorization: `Basic ${AUTH_CODE}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  const response = await axios.post(PAYHERE_TOKEN_URL, params, { headers });

  accessToken = response.data.access_token;
  tokenExpiry = Date.now() + (response.data.expires_in - 10) * 1000;

  return accessToken;
};

export default {
  hashPaymentDetails,
  createPayment,
  getPaymentStatusString,
  // getAllPayments,
  // getPaymentById,
  updatePayment,
  getAccessToken,
  // deletePayment,
};
