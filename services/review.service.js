import reviewRepository from "../repositories/review.repository.js";

const createReview = async (data) => {
  return await reviewRepository.createReview(data);
};

const getAllReviews = async () => {
  return await reviewRepository.getAllReviews();
};

const getReviewById = async (id) => {
  return await reviewRepository.getReviewById(id);
};

const updateReview = async (id, data) => {
  return await reviewRepository.updateReview(id, data);
};

const deleteReview = async (id) => {
  return await reviewRepository.deleteReview(id);
};

export default {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
