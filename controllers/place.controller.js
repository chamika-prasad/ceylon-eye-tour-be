import path from "path";
import placeService from "../services/place.service.js";
import fileUploadService from "../services/fileUpload.service.js";

// ✅ Create a new place
const createPlace = async (req, res) => {
  try {
    const { location, longitude, latitude, name, description } = req.body;

    if (!name || !location || !longitude || !latitude || !description) {
      return res.status(400).json({
        success: false,
        message:
          "Name, location, longitude, latitude, and description are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Place image is required",
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

// ✅ Create a new place
const updatePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const { location, longitude, latitude, name, description } = req.body;

    if (
      !name &&
      !location &&
      !longitude &&
      !latitude &&
      !description &&
      !req.file
    ) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update. Provide at least one field to update.",
      });
    }

    if (name) {
      var urlPrefix = name.toLowerCase().replace(/\s+/g, "-");
    }

    const existPlace = await placeService.getPlaceById(id);
    if (!existPlace) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    if (existPlace.url_prefix === urlPrefix) {
      return res.status(400).json({
        success: false,
        message: "Place with the same name already exists",
      });
    }

    if (req.file) {
      const uploadDir = path.join("uploads", "places");
      const filename = await fileUploadService.uploadFile(uploadDir, req.file);
      var imageUrl = `/uploads/places/${filename}`;
    }

    const updatedData = {
      ...(location && { location }),
      ...(longitude && { longitude }),
      ...(latitude && { latitude }),
      ...(name && { name }),
      ...(name && { url_prefix: urlPrefix }),
      ...(description && { description }),
      ...(req.file && { image_url: imageUrl }),
    };

    await placeService.updatePlace(id, updatedData);

    if (req.file) {
      // Delete old image file
      await fileUploadService.removeFile(existPlace.image_url);
    }

    return res.status(200).json({
      success: true,
      message: "Place updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating place",
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

    const existPlace = await placeService.getPlaceById(id);
    if (!existPlace) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    await placeService.deletePlace(id);

    // Delete image file
    await fileUploadService.removeFile(existPlace.image_url);

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
  updatePlace,
  getAllPlaces,
  getPlaceById,
  deletePlace,
  getAllPlacesWithHotelCount,
  getPlaceByUrlPrefix,
};
