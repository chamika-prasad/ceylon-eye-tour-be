import * as customReviewRepository from "../repositories/customReview.repository.js";

const createCustomReview = async (data) => {
  return await customReviewRepository.createCustomReview(data);
};

const updateCustomReview = async (id, data) => {
  return await customReviewRepository.updateCustomReview(id, data);
};

const deleteCustomReview = async (id) => {
  return await customReviewRepository.deleteCustomReview(id);
};

const getAllCustomReviews = async () => {
  return await customReviewRepository.getAllCustomReviews();
};

const getCustomReviewById = async (id) => {
  return await customReviewRepository.getCustomReviewById(id);
};

export default {
  createCustomReview,
  updateCustomReview,
  deleteCustomReview,
  getAllCustomReviews,
  getCustomReviewById,
};