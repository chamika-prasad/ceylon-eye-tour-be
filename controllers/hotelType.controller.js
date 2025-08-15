import path from "path";
import hotelTypeService from "../services/hotelType.service.js";
import fileUploadService from "../services/fileUpload.service.js";

// ✅ Create hotel type
const createHotelType = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Hotel type image is required",
      });
    }

    const uploadDir = path.join("uploads", "hotelTypes");

    const filename = await fileUploadService.uploadFile(uploadDir, req.file);

    const imageUrl = `/uploads/hotelTypes/${filename}`;

    const newHotelType = await hotelTypeService.createHotelType({
      name,
      description,
      url_prefix: name.toLowerCase().replace(/\s+/g, "-"),
      image_url: imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Hotel type created successfully",
      data: newHotelType,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating hotel type",
      error: error.message,
    });
  }
};

// ✅ Get all hotel types
const getAllHotelTypes = async (req, res) => {
  try {
    const hotelTypes = await hotelTypeService.getAllHotelTypes();
    return res.status(200).json({
      success: true,
      message: "Hotel types retrieved successfully",
      data: hotelTypes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving hotel types",
      error: error.message,
    });
  }
};

// ✅ Get hotel type by ID
const getHotelTypeById = async (req, res) => {
  try {
    const { id } = req.params;

    const hotelType = await hotelTypeService.getHotelTypeById(id);

    if (!hotelType) {
      return res.status(404).json({
        success: false,
        message: "Hotel type not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hotel type retrieved successfully",
      data: hotelType,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving hotel type",
      error: error.message,
    });
  }
};

// ✅ Update hotel type
const updateHotelType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updated = await hotelTypeService.updateHotelType(id, {
      name,
      description,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Hotel type not found or no changes made",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hotel type updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating hotel type",
      error: error.message,
    });
  }
};

// ✅ Delete hotel type
const deleteHotelType = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await hotelTypeService.deleteHotelType(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Hotel type not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hotel type deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting hotel type",
      error: error.message,
    });
  }
};

const getAllHotelTypesWithHotelCount = async (req, res) => {
  try {
    const hotelTypes = await hotelTypeService.getAllHotelTypesWithHotelCount();
    return res.status(200).json({
      success: true,
      message: "Hotel types retrieved with hotel count successfully",
      data: hotelTypes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving hotel types",
      error: error.message,
    });
  }
};

// ✅ Get Hotel type by url prefix
const getHotelTypeByUrlPrefix = async (req, res) => {
  try {
    const { urlPrefix } = req.params;

    const hotelType = await hotelTypeService.getHotelTypeByUrlPrefix(urlPrefix);

    if (!hotelType) {
      return res.status(404).json({
        success: false,
        message: "Hotel type not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hotel type retrieved successfully",
      data: hotelType,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving Hotel type",
      error: error.message,
    });
  }
};

export default {
  createHotelType,
  getAllHotelTypes,
  getHotelTypeById,
  updateHotelType,
  deleteHotelType,
  getAllHotelTypesWithHotelCount,
  getHotelTypeByUrlPrefix,
};
