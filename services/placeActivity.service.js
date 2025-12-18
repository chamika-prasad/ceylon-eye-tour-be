import placeActivityRepository from "../repositories/placeActivity.repository.js";

const create = async (data) => {
  return await placeActivityRepository.create(data);
};

const getByPlaceIdAndActivityId = async (data) => {
  return await placeActivityRepository.getByPlaceIdAndActivityId(data);
};

const getAllGroupedByPlace = async () => {
  return await placeActivityRepository.fetchGroupedByPlace();
};

const getAllGroupedByPlaceWithSearchAndPagination = async (
  search,
  page,
  limit
) => {
  const places = await placeActivityRepository.fetchGroupedByPlace();
  // Filter based on search term
  let filteredPlaces = places;
  if (search) {
    const lowerSearch = search.toLowerCase();
    filteredPlaces = places.filter((place) =>
      place.placeDetails.name.toLowerCase().includes(lowerSearch)
    );
  }
  // Pagination
  const totalItems = filteredPlaces.length;
  const totalPages = Math.ceil(totalItems / limit);
  const offset = (page - 1) * limit;
  const paginatedCategories = filteredPlaces.slice(
    offset,
    offset + parseInt(limit)
  );
  return {
    places: paginatedCategories,
    totalItems: totalItems,
    totalPages: totalPages,
    currentPage: parseInt(page),
  };
};

const updatePlaceActivity = async (place_id, activity_id, updatedData) => {
  return await placeActivityRepository.update(
    place_id,
    activity_id,
    updatedData
  );
};

const deletePlaceActivity = async (place_id, activity_id) => {
  return await placeActivityRepository.remove(place_id, activity_id);
};

export default {
  getAllGroupedByPlace,
  updatePlaceActivity,
  deletePlaceActivity,
  create,
  getByPlaceIdAndActivityId,
  getAllGroupedByPlaceWithSearchAndPagination,
};
