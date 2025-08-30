import { Review, User } from "../models/index.js";

const createReview = async (data) => {
  try {
    return await Review.create(data);
  } catch (error) {
    throw new Error(`Error creating review: ${error.message}`);
  }
};

const getAllReviews = async () => {
  try {
    return await Review.findAll({
      include: [
        {
          model: User,
          as: "User",
          attributes: ["name", "profile_image"], // Include customer details
        },
      ],
    });
  } catch (error) {
    throw new Error(`Error fetching reviews: ${error.message}`);
  }
};

const getReviewById = async (id) => {
  try {
    return await Review.findByPk(id);
  } catch (error) {
    throw new Error(`Error fetching review by ID: ${error.message}`);
  }
};

const updateReview = async (id, data) => {
  try {
    const [updated] = await Review.update(data, { where: { id } });
    return updated > 0;
  } catch (error) {
    throw new Error(`Error updating review: ${error.message}`);
  }
};

const deleteReview = async (id) => {
  try {
    const deleted = await Review.destroy({ where: { id } });
    return deleted > 0;
  } catch (error) {
    throw new Error(`Error deleting review: ${error.message}`);
  }
};

export default {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
