import placeRepository from "../repositories/place.repository.js";
import hotelRepository from "../repositories/hotel.repository.js";

const createPlace = async (data) => {
  return await placeRepository.createPlace(data);
};

const updatePlace = async (id, data) => {
  return await placeRepository.updatePlace(id, data);
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

const getAllPlacesWithPagination = async (page, pageSize, searchTerm) => {
  return await placeRepository.getAllPlacesWithPagination(
    page,
    pageSize,
    searchTerm
  );
};

const getAllPlacesWithHotelCountAndPagination = async (
  page,
  pageSize,
  searchTerm
) => {
  return await placeRepository.getAllPlacesWithHotelCountAndPagination(
    page,
    pageSize,
    searchTerm
  );
};

const getPlaceByUrlPrefixWithHotelCountAndPagination = async (
  urlPrefix,
  page,
  pageSize,
  searchTerm
) => {
  const place = await placeRepository.getPlaceByUrlPrefix(urlPrefix);
  const result = await hotelRepository.getHotelsByPlaceIdWithPagination(
    place.id,
    page,
    pageSize,
    searchTerm
  );

  const formattedHotels = result.hotels.map((hotel) => {
    return {
      ...hotel.dataValues,
      description: hotel.description,
      facilities: hotel.facilities,
      images: hotel.images,
      rooms_details: safeParse(hotel.rooms_details),
    };
  });

  const finalResult = {
    result: {
      ...place.toJSON(),
      Hotels:
        !result.hotels || result.hotels.length === 0 ? [] : formattedHotels,
    },
    currentPage: result.currentPage,
    totalPages: result.totalPages,
    totalItems: result.totalItems,
  };
  return finalResult;
};

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
};

export default {
  createPlace,
  updatePlace,
  getAllPlaces,
  getPlaceById,
  deletePlace,
  getAllPlacesWithHotelCount,
  getPlaceByUrlPrefix,
  getAllPlacesWithPagination,
  getAllPlacesWithHotelCountAndPagination,
  getPlaceByUrlPrefixWithHotelCountAndPagination,
};
