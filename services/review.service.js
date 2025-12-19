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

export default {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getAllReviewsWithSearchAndPagination,
};
