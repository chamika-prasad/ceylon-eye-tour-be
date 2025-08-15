import placeRepository from "../repositories/place.repository.js";

const createPlace = async (data) => {
  return await placeRepository.createPlace(data);
};

const getAllPlaces = async () => {
  return await placeRepository.getAllPlaces();
};

const getPlaceById = async (id) => {
  return await placeRepository.getPlaceById(id);
};

const deletePlace = async (id) => {
  return await placeRepository.deletePlace(id);
};

const getAllPlacesWithHotelCount = async () => {
  return await placeRepository.getAllPlacesWithHotelCount();
};

const getPlaceByUrlPrefix = async (urlPrefix) => {
  return await placeRepository.getPlaceByUrlPrefix(urlPrefix);
};

export default {
  createPlace,
  getAllPlaces,
  getPlaceById,
  deletePlace,
  getAllPlacesWithHotelCount,
  getPlaceByUrlPrefix
};
