import reviewService from "../services/review.service.js";
import packageService from "../services/package.service.js";

// ✅ Add new review
const createReview = async (req, res) => {
  try {
    const { bookingId, packageId, rating, review, description } = req.body;
    const { userId } = req.user;

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: "Customer ID and rating are required",
      });
    }

    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a number between 1 and 5",
      });
    }

    const newReview = await reviewService.createReview({
      customer_id: userId,
      booking_id: bookingId,
      rating: Number(rating),
      review,
      description,
    });

    const result = await packageService.getPackageById(packageId);

    if (result) {
      console.log(result.user_count);
      console.log(result.rating);

      const updatedRatingPackage = await packageService.updatePackageRating(
        packageId,
        {
          rating: Number(result.rating) + Number(rating),
          user_count: Number(result.user_count) + 1,
        }
      );
    }

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: newReview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating review",
      error: error.message,
    });
  }
};

// ✅ Get all reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getAllReviews();
    return res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      data: reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving reviews",
      error: error.message,
    });
  }
};

// ✅ Get review by ID
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await reviewService.getReviewById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review retrieved successfully",
      data: review,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving review",
      error: error.message,
    });
  }
};

// ✅ Update review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review, description } = req.body;

    if (!rating && !review && !description) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }

    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a number between 1 and 5",
      });
    }

    const existingReview = await reviewService.getReviewById(id);

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const updatedData = {
      ...(rating && { rating: Number(rating) }),
      ...(description && { description }),
      ...(review && { review }),
    };

    const updated = await reviewService.updateReview(id, {
      rating,
      review,
      description,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Review not updated",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating review",
      error: error.message,
    });
  }
};

// ✅ Delete review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await reviewService.deleteReview(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error.message,
    });
  }
};

export default {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
