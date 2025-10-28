import { Activity } from "./../models/index.js";
import { where, fn, col } from "sequelize";

const createActivity = async (data) => {
  return await Activity.create(data);
};

const updateActivity = async (id, data) => {
  return await Activity.update(data, {
    where: { id },
  });
};

const deleteActivity = async (id) => {
  return await Activity.destroy({
    where: { id },
  });
};

const getAllActivities = async () => {
  return await Activity.findAll();
};

const getActivityById = async (id) => {
  return await Activity.findByPk(id);
};

const getActivityByName = async (name) => {
  return await Activity.findOne({
    where: where(fn("lower", col("name")), name.toLowerCase()),
  });
};

export default {
  createActivity,
  updateActivity,
  deleteActivity,
  getAllActivities,
  getActivityById,
  getActivityByName
};
