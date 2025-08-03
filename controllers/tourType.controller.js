import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import tourTypeService from "../services/tourType.service.js";

const getAllTourTypes = async (req, res) => {
  try {
    const tourTypes = await tourTypeService.getAllTourTypes();
    return res.status(200).json({
      success: true,
      message: "Tour types retrieved successfully",
      data: tourTypes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving tour types",
      error: error.message,
    });
  }
};

const createTourType = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Name and description are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const ext = path.extname(req.file.originalname);
    const filename = `${uuidv4()}${ext}`;
    const uploadDir = path.join("uploads", "tour-types");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, req.file.buffer);

    const imageUrl = `/uploads/tour-types/${filename}`;

    const newTourType = await tourTypeService.createTourType({
      name,
      description,
      image_url: imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Tour type created successfully",
      data: newTourType,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating tour type",
      error: error.message,
    });
  }
};

const updateTourType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name && !description) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update. Provide at least name or description.",
      });
    }

    const updatedTourType = await tourTypeService.updateTourType(id, {
      ...(name && { name }),
      ...(description && { description }),
    });

    if (!updatedTourType) {
      return res.status(404).json({
        success: false,
        message: "Tour type not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tour type updated successfully",
      data: updatedTourType,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating tour type",
      error: error.message,
    });
  }
};

const deleteTourType = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await tourTypeService.deleteTourType(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Tour type not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tour type deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting tour type",
      error: error.message,
    });
  }
};

const getTourTypeById = async (req, res) => {
  try {
    const { id } = req.params;

    const tourType = await tourTypeService.getTourTypeById(id);

    if (!tourType) {
      return res.status(404).json({
        success: false,
        message: "Tour type not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tour type retrieved successfully",
      data: tourType,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving tour type",
      error: error.message,
    });
  }
};

export default {
  getAllTourTypes,
  createTourType,
  updateTourType,
  deleteTourType,
  getTourTypeById,
};
