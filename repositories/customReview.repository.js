import { CustomReview } from "./../models/index.js";

const createCustomReview = async (data) => {
  return await CustomReview.create(data);
};

const updateCustomReview = async (id, data) => {
  return await CustomReview.update(data, {
    where: { id },
  });
};

const deleteCustomReview = async (id) => {
  return await CustomReview.destroy({
    where: { id },
  });
};

const getAllCustomReviews = async () => {
  return await CustomReview.findAll();
};

const getCustomReviewById = async (id) => {
  return await CustomReview.findByPk(id);
};

export default {
  createCustomReview,
  updateCustomReview,
  deleteCustomReview,
  getAllCustomReviews,
  getCustomReviewById,
};