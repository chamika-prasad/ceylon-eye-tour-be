import { Review, User } from "../models/index.js";

const createReview = async (data) => {
  return await Review.create(data);
};

const getAllReviews = async () => {
  return await Review.findAll({
    include: [
      {
        model: User,
        as: "User",
        attributes: ["name", "profile_image"], // Include customer details
      },
    ],
    attributes: ["id", "rating", "review", "description"],
  });
};

const getReviewById = async (id) => {
  return await Review.findByPk(id);
};

const updateReview = async (id, data) => {
  const [updated] = await Review.update(data, { where: { id } });
  return updated > 0;
};

const deleteReview = async (id) => {
  const deleted = await Review.destroy({ where: { id } });
  return deleted > 0;
};

export default {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
