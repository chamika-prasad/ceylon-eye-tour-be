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

const getAllCustomReviewsWithSearchAndPagination = async (search, page, limit) => {
  const customReviews = await customReviewRepository.getAllCustomReviews();
  let filteredReviews = customReviews;

  if (search) {
    const lowerSearch = search.toLowerCase();
    filteredReviews = customReviews.filter((review) => {
      const fullName = `${review.first_name || ""} ${review.last_name || ""}`.toLowerCase();
      const reviewText = (review.review || "").toLowerCase();
      const email = (review.email || "").toLowerCase();

      return (
        fullName.includes(lowerSearch) ||
        reviewText.includes(lowerSearch) ||
        email.includes(lowerSearch)
      );
    });
  }

  // Pagination
  const totalItems = filteredReviews.length;
  const totalPages = Math.ceil(totalItems / limit);
  const offset = (page - 1) * limit;
  const paginatedReviews = filteredReviews.slice(
    offset,
    offset + parseInt(limit)
  );

  return {
    reviews: paginatedReviews,
    totalItems: totalItems,
    totalPages: totalPages,
    currentPage: parseInt(page),
  };
};

export default {
  createCustomReview,
  updateCustomReview,
  deleteCustomReview,
  getAllCustomReviews,
  getCustomReviewById,
  getAllCustomReviewsWithSearchAndPagination,
};