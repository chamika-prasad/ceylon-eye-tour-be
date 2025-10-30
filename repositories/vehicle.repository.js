import { Vehicle } from "../models/index.js";

const createVehicle = async (data) => {
  return await Vehicle.create(data);
};

const updateVehicle = async (id, updatedData) => {
  return await Vehicle.update(updatedData, {
    where: { id },
  });
};

const deleteVehicle = async (id) => {
  return await Vehicle.destroy({
    where: { id },
  });
};

const getAllVehicles = async () => {
  return await Vehicle.findAll();
};

const getVehicleByUrlPrefix = async (urlPrefix) => {
  return await Vehicle.findOne({
    where: { url_prefix: urlPrefix },
  });
};

const getVehicleById = async (id) => {
  return await Vehicle.findByPk(id);
};

export default {
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getAllVehicles,
  getVehicleByUrlPrefix,
  getVehicleById,
};
