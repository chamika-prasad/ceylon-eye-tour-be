import activityRepository from "../repositories/activity.repository.js";

const createActivity = async (data) => {
  return await activityRepository.createActivity(data);
};

const updateActivity = async (id, data) => {
  return await activityRepository.updateActivity(id, data);
};

const deleteActivity = async (id) => {
  return await activityRepository.deleteActivity(id);
};

const getAllActivities = async () => {
  return await activityRepository.getAllActivities();
};

const getActivityById = async (id) => {
  return await activityRepository.getActivityById(id);
};

const getActivityByName = async (name) => {
  return await activityRepository.getActivityByName(name);
};

const getAllActivitiesWithSearchAndPagination = async (
  page,
  limit,
  searchName
) => {
  return await activityRepository.getAllActivitiesWithSearchAndPagination(
    page,
    searchName
  );
};

export default {
  createActivity,
  updateActivity,
  deleteActivity,
  getAllActivities,
  getActivityById,
  getActivityByName,
  getAllActivitiesWithSearchAndPagination,
};
