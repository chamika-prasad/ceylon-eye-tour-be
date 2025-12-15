import { Vehicle } from "../models/index.js";
import { Op } from "sequelize";

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

const getAllVehiclesWithPagination = async (
  page = 1,
  pageSize = 10,
  searchTerm = "",
  vehicleType = null
) => {
  const offset = (page - 1) * pageSize;

  // Build where clause for searching vehicle name and filtering by type
  const whereClause = {};

  // Add search condition if searchTerm exists
  if (searchTerm) {
    whereClause.name = { [Op.like]: `%${searchTerm}%` };
  }

  // Add vehicle type filter if specified
  if (vehicleType !== null && !isNaN(vehicleType)) {
    whereClause.vehicle_type = vehicleType;
  }

  try {
    const { count, rows } = await Vehicle.findAndCountAll({
      where: whereClause,
      limit: parseInt(pageSize),
      offset: parseInt(offset),
      order: [["name", "ASC"]],
    });

    return {
      vehicles: rows,
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: parseInt(page),
      pageSize: parseInt(pageSize),
    };
  } catch (error) {
    throw new Error(`Error fetching vehicles: ${error.message}`);
  }
};

export default {
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getAllVehicles,
  getVehicleByUrlPrefix,
  getVehicleById,
  getAllVehiclesWithPagination,
};
