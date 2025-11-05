import { Payment } from "../models/index.js";

const createPayment = async (data) => {
  try {
    return await Payment.create(data);
  } catch (error) {
    throw new Error(`Error creating payment: ${error.message}`);
  }
};

// const getAllPayments = async () => {
//   try {
//     return await Payment.findAll();
//   } catch (error) {
//     throw new Error(`Error fetching payments: ${error.message}`);
//   }
// };

// const getPaymentById = async (id) => {
//   try {
//     return await Payment.findByPk(id);
//   } catch (error) {
//     throw new Error(`Error fetching payment by ID: ${error.message}`);
//   }
// };

const updatePayment = async (id, data) => {
  try {
    const [updated] = await Payment.update(data, { where: { id } });
    return updated > 0;
  } catch (error) {
    throw new Error(`Error updating payment: ${error.message}`);
  }
};

const getPaymentById = async (id) => {
  return await Payment.findByPk(id);
};

export default {
  createPayment,
  //   getAllPayments,
  //   getPaymentById,
  updatePayment,
  getPaymentById,
};
