import { SecondPayment } from "../models/index.js";

const createSecondPayment = async (data) => {
  try {
    return await SecondPayment.create(data);
  } catch (error) {
    throw new Error(`Error creating second payment: ${error.message}`);
  }
};

const updateSecondPayment = async (id, data) => {
  try {
    const [updated] = await SecondPayment.update(data, { where: { id } });
    return updated > 0;
  } catch (error) {
    throw new Error(`Error updating second payment: ${error.message}`);
  }
};

const getSecondPaymentById = async (id) => {
  try {
    return await SecondPayment.findByPk(id);
  } catch (error) {
    throw new Error(`Error fetching second payment by ID: ${error.message}`);
  }
};

const getSecondPaymentsByBookingId = async (bookingId) => {
  try {
    return await SecondPayment.findAll({ where: { booking_id: bookingId } });
  } catch (error) {
    throw new Error(
      `Error fetching second payments for booking ${bookingId}: ${error.message}`
    );
  }
};

const deleteSecondPayment = async (id) => {
  try {
    const deleted = await SecondPayment.destroy({ where: { id } });
    return deleted > 0;
  } catch (error) {
    throw new Error(`Error deleting second payment: ${error.message}`);
  }
};

export default {
  createSecondPayment,
  updateSecondPayment,
  getSecondPaymentById,
  getSecondPaymentsByBookingId,
  deleteSecondPayment,
};
