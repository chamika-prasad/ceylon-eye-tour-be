import path from "path";
import placeService from "../services/place.service.js";
import fileUploadService from "../services/fileUpload.service.js";

// ✅ Create a new place
const createPlace = async (req, res) => {
  try {
    const { location, longitude, latitude, name, description } = req.body;

    if (
      !name ||
      !location ||
      !longitude ||
      !latitude ||
      !name ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, location, longitude, latitude, and description are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Category image is required",
      });
    }

    const uploadDir = path.join("uploads", "places");

    const filename = await fileUploadService.uploadFile(uploadDir, req.file);

    const imageUrl = `/uploads/places/${filename}`;

    const newPlace = await placeService.createPlace({
      location,
      longitude,
      latitude,
      name,
      url_prefix: name.toLowerCase().replace(/\s+/g, "-"),
      description,
      image_url: imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Place created successfully",
      data: newPlace,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating place",
      error: error.message,
    });
  }
};

// ✅ Get all places
const getAllPlaces = async (req, res) => {
  try {
    const places = await placeService.getAllPlaces();
    return res.status(200).json({
      success: true,
      message: "Places retrieved successfully",
      data: places,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving places",
      error: error.message,
    });
  }
};

// ✅ Get place by ID
const getPlaceById = async (req, res) => {
  try {
    const { id } = req.params;

    const place = await placeService.getPlaceById(id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Place retrieved successfully",
      data: place,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving place",
      error: error.message,
    });
  }
};

// ✅ Delete place
const deletePlace = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await placeService.deletePlace(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Place deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting place",
      error: error.message,
    });
  }
};

const getAllPlacesWithHotelCount = async (req, res) => {
  try {
    const places = await placeService.getAllPlacesWithHotelCount();
    return res.status(200).json({
      success: true,
      message: "Places retrieved with hotel count successfully",
      data: places,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving places",
      error: error.message,
    });
  }
};

// ✅ Get place by url prefix
const getPlaceByUrlPrefix = async (req, res) => {
  try {
    const { urlPrefix } = req.params;

    const place = await placeService.getPlaceByUrlPrefix(urlPrefix);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Place retrieved successfully",
      data: place,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving place",
      error: error.message,
    });
  }
};

export default {
  createPlace,
  getAllPlaces,
  getPlaceById,
  deletePlace,
  getAllPlacesWithHotelCount,
  getPlaceByUrlPrefix
};
