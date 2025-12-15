import hotelTypeRepository from "../repositories/hotelType.repository.js";
import hotelRepository from "../repositories/hotel.repository.js";

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

const getAllHotelTypesWithHotelCountAndPagination = async (
  page,
  pageSize,
  searchTerm
) => {
  return await hotelTypeRepository.getAllHotelTypesWithHotelCountAndPagination(
    page,
    pageSize,
    searchTerm
  );
};

const getAllHotelTypesWithPagination = async (page, pageSize, searchTerm) => {
  return await hotelTypeRepository.getAllHotelTypesWithPagination(
    page,
    pageSize,
    searchTerm
  );
};

const getHotelTypeByUrlPrefixWithPaginationAndSearch = async (
  urlPrefix,
  searchTerm = "",
  page = 1,
  limit = 10
) => {
  const type = await hotelTypeRepository.getHotelTypeByUrlPrefix(urlPrefix);
  const hotels = await hotelRepository.getHotelsByTypeIdWithPagination(
    type.id,
    page,
    limit,
    searchTerm
  );

  const finalResult = {
    type: {
      ...type.toJSON(),
      Hotels: hotels.hotels,
    },
    currentPage: hotels.currentPage,
    totalPages: hotels.totalPages,
    totalItems: hotels.totalItems,
  };
  return finalResult;
};

export default {
  createHotelType,
  getAllHotelTypes,
  getHotelTypeById,
  updateHotelType,
  deleteHotelType,
  getAllHotelTypesWithHotelCount,
  getHotelTypeByUrlPrefix,
  getAllHotelTypesWithHotelCountAndPagination,
  getAllHotelTypesWithPagination,
  getHotelTypeByUrlPrefixWithPaginationAndSearch,
};
