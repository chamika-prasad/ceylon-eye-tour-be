import { v4 as uuidv4 } from "uuid";
import path from "path";
import vehicleService from "../services/vehicle.service.js";
import fileUploadService from "../services/fileUpload.service.js";

const createVehicle = async (req, res) => {
  try {
    const {
      name,
      descriptions,
      excludes,
      facilities,
      terms,
      owner,
      ownerContact,
      passengerCapacity,
      location,
      price,
    } = req.body;

    if (
      !name ||
      !owner ||
      !ownerContact ||
      !location ||
      !price ||
      !passengerCapacity ||
      !descriptions ||
      !excludes ||
      !facilities ||
      !terms
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Vehicle images are required",
      });
    }

    const vehicleId = uuidv4();

    // Prepare upload directory: uploads/vehicles/{vehicleId}
    const uploadDir = path.join("uploads", "vehicles", vehicleId.toString());
    const images = [];

    for (const file of req.files) {
      const filename = await fileUploadService.uploadFile(uploadDir, file);
      images.push(`/uploads/vehicles/${vehicleId}/${filename}`);
    }

    const vehicle = await vehicleService.createVehicle({
      id: vehicleId,
      name,
      descriptions,
      images:JSON.stringify(images),
      excludes,
      facilities,
      terms,
      owner,
      owner_contact: ownerContact,
      url_prefix: name.toLowerCase().replace(/\s+/g, "-"),
      passenger_capacity: passengerCapacity,
      location,
      price,
    });

    return res.status(201).json({
      success: true,
      data: vehicle,
      message: "Vehicle created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating vehicle",
      error: error.message,
    });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    await vehicleService.deleteVehicle(id);
    return res.status(200).json({ success: true, message: "Vehicle deleted" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error deleting vehicle",
    });
  }
};

const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    return res.status(200).json({
      success: true,
      data: vehicles,
      message: "Vehicles fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error fetching vehicles",
    });
  }
};

const getVehicleByUrlPrefix = async (req, res) => {
  try {
    const { urlPrefix } = req.params;
    const vehicle = await vehicleService.getVehicleByUrlPrefix(urlPrefix);
    if (!vehicle) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    }
    return res.status(200).json({
      success: true,
      data: vehicle,
      message: "Vehicle fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error fetching vehicle",
    });
  }
};

export default {
  createVehicle,
  deleteVehicle,
  getAllVehicles,
  getVehicleByUrlPrefix,
};
