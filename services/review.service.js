import reviewRepository from "../repositories/review.repository.js";
import customReviewRepository from "../repositories/customReview.repository.js";

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

const getAllReviewsWithSearchAndPagination = async (search, page, limit) => {
  const reviews = await reviewRepository.getAllReviews();
  let filteredReviews = reviews;
  if (search) {
    const lowerSearch = search.toLowerCase();
    filteredReviews = reviews.filter((review) =>
      review.User.name.toLowerCase().includes(lowerSearch)
    );
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

const getAllReviewsAndCustomReviewsWithSearchAndPagination = async (search, page, limit) => {
  const reviews = await reviewRepository.getAllReviews();
  const customReviews = await customReviewRepository.getAllCustomReviews();

  // Format custom reviews to match review structure
  const formattedCustomReviews = customReviews.map((review) => ({
    id: review.id,
    rating: review.rating,
    review: review.review,
    description: review.description,
    User: {
      name: `${review.first_name || ""} ${review.last_name || ""}`.trim(),
      profile_image: null,
    },
    type: "custom", // to distinguish
  }));

  // Add type to regular reviews
  const formattedReviews = reviews.map((review) => ({
    ...review.toJSON(),
    type: "regular",
  }));

  // Combine all reviews
  let combinedReviews = [...formattedReviews, ...formattedCustomReviews];

  // Apply search
  if (search) {
    const lowerSearch = search.toLowerCase();
    combinedReviews = combinedReviews.filter((review) => {
      const name = (review.User.name || "").toLowerCase();
      const reviewText = (review.review || "").toLowerCase();
      const description = (review.description || "").toLowerCase();
      return (
        name.includes(lowerSearch) ||
        reviewText.includes(lowerSearch) ||
        description.includes(lowerSearch)
      );
    });
  }

  // Pagination
  const totalItems = combinedReviews.length;
  const totalPages = Math.ceil(totalItems / limit);
  const offset = (page - 1) * limit;
  const paginatedReviews = combinedReviews.slice(
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
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getAllReviewsWithSearchAndPagination,
  getAllReviewsAndCustomReviewsWithSearchAndPagination,
};
