import vehicleRepository from "../repositories/vehicle.repository.js";

const createVehicle = async (data) => {
  return await vehicleRepository.createVehicle(data);
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

export default {
  createVehicle,
  deleteVehicle,
  getAllVehicles,
  getVehicleByUrlPrefix,
};
