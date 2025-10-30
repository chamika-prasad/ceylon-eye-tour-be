import vehicleRepository from "../repositories/vehicle.repository.js";

const createVehicle = async (data) => {
  return await vehicleRepository.createVehicle(data);
};

const updateVehicle = async (id, data) => {
  return await vehicleRepository.updateVehicle(id, data);
};

const deleteVehicle = async (id) => {
  return await vehicleRepository.deleteVehicle(id);
};

const getAllVehicles = async () => {
  return await vehicleRepository.getAllVehicles();
};

const getVehicleByUrlPrefix = async (urlPrefix) => {
  return await vehicleRepository.getVehicleByUrlPrefix(urlPrefix);
};

const getVehicleById = async (id) => {
  return await vehicleRepository.getVehicleById(id);
};

export default {
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getAllVehicles,
  getVehicleByUrlPrefix,
  getVehicleById,
};
