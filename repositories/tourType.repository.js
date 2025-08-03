import { TourType } from "../models/index.js";

const getAllTourTypes = async () => {
  return await TourType.findAll({
    attributes: ["id", "name", "description", "image_url"],
  });
};

const createTourType = async ({ name, description, image_url }) => {
  return await TourType.create({ name, description, image_url });
};

const updateTourType = async (id, data) => {
  const tourType = await TourType.findByPk(id);
  if (!tourType) return null;
  await tourType.update(data);
  return tourType;
};

const deleteTourType = async (id) => {
  const deleted = await TourType.destroy({ where: { id } });
  return deleted > 0;
};

const getTourTypeById = async (id) => {
  return await TourType.findByPk(id, {
    attributes: ["id", "name", "description", "image_url"],
  });
};

export default {
  getAllTourTypes,
  createTourType,
  updateTourType,
  deleteTourType,
  getTourTypeById,
};
