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

const setPaymentsAsNotCurrentByBookingId = async (bookingId) => {
  try {
    const [updatedCount] = await Payment.update(
      { is_current: false },
      { where: { booking_id: bookingId } }
    );

    return updatedCount > 0;
  } catch (error) {
    throw new Error(
      `Error updating payments for booking ${bookingId}: ${error.message}`
    );
  }
};

const getPaymentById = async (id) => {
  return await Payment.findByPk(id);
};

const deletePayment = async (id) => {
  const deleted = await Payment.destroy({ where: { id } });
  return deleted > 0;
};

export default {
  createPayment,
  //   getAllPayments,
  //   getPaymentById,
  updatePayment,
  getPaymentById,
  setPaymentsAsNotCurrentByBookingId,
  deletePayment,
};
