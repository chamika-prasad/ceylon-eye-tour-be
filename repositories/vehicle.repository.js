import { Vehicle } from "../models/index.js";

const createVehicle = async (data) => {
  return await Vehicle.create(data);
};

const deleteVehicle = async (id) => {
  console.log(`Deleting vehicle with ID: ${id}`);
  
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

export default {
  createVehicle,
  deleteVehicle,
  getAllVehicles,
  getVehicleByUrlPrefix,
};
