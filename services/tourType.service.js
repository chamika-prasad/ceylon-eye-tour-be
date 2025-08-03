import tourTypeRepository from "../repositories/tourType.repository.js";

const getAllTourTypes = async () => {
  return await tourTypeRepository.getAllTourTypes();
};

const createTourType = async ({ name, description, image_url }) => {
  return await tourTypeRepository.createTourType({
    name,
    description,
    image_url,
  });
};

const updateTourType = async (id, data) => {
  return await tourTypeRepository.updateTourType(id, data);
};

const deleteTourType = async (id) => {
  return await tourTypeRepository.deleteTourType(id);
};

const getTourTypeById = async (id) => {
  return await tourTypeRepository.getTourTypeById(id);
};

export default {
  getAllTourTypes,
  createTourType,
  updateTourType,
  deleteTourType,
  getTourTypeById,
};
