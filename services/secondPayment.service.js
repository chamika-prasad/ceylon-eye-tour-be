import dotenv from "dotenv";
import pkg from "crypto-js";
import crypto from "crypto";
import secondPaymentRepository from "../repositories/secondPayment.repository.js";
const { MD5 } = pkg;
dotenv.config();

const hashPaymentDetails = async (orderId, amount, currency = "USD") => {
  let merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
  let merchantId = process.env.PAYHERE_MERCHANT_ID;

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

const createSecondPayment = async (data) => {
  return await secondPaymentRepository.createSecondPayment(data);
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

const updateSecondPayment = async (id, data) => {
  return await secondPaymentRepository.updateSecondPayment(id, data);
};

const getSecondPaymentById = async (id) => {
  return await secondPaymentRepository.getSecondPaymentById(id);
};

const getSecondPaymentsByBookingId = async (bookingId) => {
  return await secondPaymentRepository.getSecondPaymentsByBookingId(bookingId);
};

const combineUuidWithRandom = async (uuid) => {
  // Generate random string (16 hex characters)
  let randomString = crypto.randomBytes(8).toString("hex");

  // Safe separator (UUID never contains :)
  let combinedValue = `${uuid}:${randomString}`;

  return combinedValue;
};

const separateUuidAndRandom = async (combinedValue) => {
  let [uuid, randomString] = combinedValue.split(":");

  return {
    uuid,
    randomString,
  };
};

const deleteSecondPayment = async (id) => {
  return await secondPaymentRepository.deleteSecondPayment(id);
};

export default {
  hashPaymentDetails,
  createSecondPayment,
  getPaymentStatusString,
  getSecondPaymentById,
  updateSecondPayment,
  deleteSecondPayment,
  combineUuidWithRandom,
  separateUuidAndRandom,
  getSecondPaymentsByBookingId,
};
