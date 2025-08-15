import hotelTypeRepository from "../repositories/hotelType.repository.js";

const createHotelType = async (data) => {
  return await hotelTypeRepository.createHotelType(data);
};

const getAllHotelTypes = async () => {
  return await hotelTypeRepository.getAllHotelTypes();
};

const getHotelTypeById = async (id) => {
  return await hotelTypeRepository.getHotelTypeById(id);
};

const updateHotelType = async (id, data) => {
  return await hotelTypeRepository.updateHotelType(id, data);
};

const deleteHotelType = async (id) => {
  return await hotelTypeRepository.deleteHotelType(id);
};

const getAllHotelTypesWithHotelCount = async () => {
  return await hotelTypeRepository.getAllHotelTypesWithHotelCount();
};

const getHotelTypeByUrlPrefix = async (urlPrefix) => {
  return await hotelTypeRepository.getHotelTypeByUrlPrefix(urlPrefix);
};

export default {
  createHotelType,
  getAllHotelTypes,
  getHotelTypeById,
  updateHotelType,
  deleteHotelType,
  getAllHotelTypesWithHotelCount,
  getHotelTypeByUrlPrefix,
};
