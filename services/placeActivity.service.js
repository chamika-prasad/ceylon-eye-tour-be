import placeActivityRepository from "../repositories/placeActivity.repository.js";

const bulkCreateActivities = async (records) => {
  return await placeActivityRepository.bulkInsert(records);
};

const getAllGroupedByPlace = async () => {
  return await placeActivityRepository.fetchGroupedByPlace();
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
  bulkCreateActivities,
  getAllGroupedByPlace,
  updatePlaceActivity,
  deletePlaceActivity,
};
