import customReviewService from "../services/customReview.service.js";

const createCustomReview = async (req, res) => {
  try {
    const { first_name, last_name, email, rating, review, description } = req.body;

    if (rating === undefined || rating === null) {
      return res.status(400).json({
        success: false,
        message: "Rating is required",
      });
    }

    if (!review) {
      return res.status(400).json({
        success: false,
        message: "Review is required",
      });
    }

    const customReview = await customReviewService.createCustomReview({
      first_name,
      last_name,
      email,
      rating,
      review,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Custom review created successfully",
      data: customReview,
    });
  } catch (error) {
    console.error("Error creating custom review:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllCustomReviews = async (req, res) => {
  try {
    const customReviews = await customReviewService.getAllCustomReviews();

    const formattedReviews = customReviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      review: review.review,
      description: review.description,
      User: {
        name: `${review.first_name || ""} ${review.last_name || ""}`.trim(),
        profile_image: null,
      },
    }));

    res.status(200).json({
      success: true,
      message: "Custom reviews retrieved successfully",
      data: formattedReviews,
    });
  } catch (error) {
    console.error("Error retrieving custom reviews:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getCustomReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const customReview = await customReviewService.getCustomReviewById(id);

    if (!customReview) {
      return res.status(404).json({
        success: false,
        message: "Custom review not found",
      });
    }

    const formattedReview = {
      id: customReview.id,
      rating: customReview.rating,
      review: customReview.review,
      description: customReview.description,
      User: {
        name: `${customReview.first_name || ""} ${customReview.last_name || ""}`.trim(),
        profile_image: null,
      },
    };

    res.status(200).json({
      success: true,
      message: "Custom review retrieved successfully",
      data: formattedReview,
    });
  } catch (error) {
    console.error("Error retrieving custom review:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateCustomReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, rating, review, description } = req.body;

    const [updatedRowsCount] = await customReviewService.updateCustomReview(id, {
      first_name,
      last_name,
      email,
      rating,
      review,
      description,
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Custom review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Custom review updated successfully",
    });
  } catch (error) {
    console.error("Error updating custom review:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteCustomReview = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRowsCount = await customReviewService.deleteCustomReview(id);

    if (deletedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Custom review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Custom review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting custom review:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllCustomReviewsWithSearchAndPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const searchTerm = req.query.search || "";
    const pageSize =
      parseInt(req.query.size) || parseInt(process.env.PAGINATION_LIMIT) || 10;

    const result = await customReviewService.getAllCustomReviewsWithSearchAndPagination(
      searchTerm,
      page,
      pageSize
    );

    const formattedReviews = result.reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      review: review.review,
      description: review.description,
      User: {
        name: `${review.first_name || ""} ${review.last_name || ""}`.trim(),
        profile_image: null,
      },
    }));

    res.status(200).json({
      success: true,
      message: "Custom reviews retrieved successfully",
      data: formattedReviews,
      pagination: {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
      },
    });
  } catch (error) {
    console.error("Error retrieving custom reviews:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default {
  createCustomReview,
  getAllCustomReviews,
  getCustomReviewById,
  updateCustomReview,
  deleteCustomReview,
  getAllCustomReviewsWithSearchAndPagination,
};