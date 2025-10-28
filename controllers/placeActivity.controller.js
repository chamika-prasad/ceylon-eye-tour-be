import fs from "fs";
import path from "path";
import placeActivityService from "../services/placeActivity.service.js";
import fileUploadService from "../services/fileUpload.service.js";

const createPlaceActivitiy = async (req, res) => {
  try {
    const { placeId, activityId, description, price } = req.body;
    const file = req.file;

    if (!placeId || !activityId || !description || !price) {
      return res.status(400).json({
        success: false,
        message: "place, activity, description, and price are required",
      });
    }

    const existing = await placeActivityService.getByPlaceIdAndActivityId({
      placeId: placeId,
      activityId: activityId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "This activity is already associated with the place",
      });
    }

    // Save files to disk and create image URLs
    const uploadDir = path.join("uploads", "placeactivities");

    let imageUrl = null;

    if (file) {
      const filename = await fileUploadService.uploadFile(uploadDir, file);
      imageUrl = `/uploads/placeactivities/${filename}`;
    }

    const record = await placeActivityService.create({
      place_id: placeId,
      activity_id: activityId,
      description: description,
      price: price,
      image_url: imageUrl,
    });

    return res.status(201).json({
      success: true,
      data: record,
      message: "Activity added successfully",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getGroupedByPlace = async (req, res) => {
  try {
    const data = await placeActivityService.getAllGroupedByPlace();
    return res.status(200).json({
      success: true,
      message: "Place activities retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving place activities",
      error: error.message,
    });
  }
};

const updatePlaceActivity = async (req, res) => {
  try {
    const { place_id, activity_id } = req.params;
    const { price, description } = req.body;
    const file = req.file;

    if (!price && !description && !file) {
      return res.status(400).json({
        success: false,
        message: "At least one field (price, description, image) is required",
      });
    }

    const existing = await placeActivityService.getByPlaceIdAndActivityId({
      placeId: place_id,
      activityId: activity_id,
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Place activity not found",
      });
    }

    const uploadDir = path.join("uploads", "placeactivities");

    if (file) {
      const filename = await fileUploadService.uploadFile(uploadDir, file);
      var imageUrl = `/uploads/placeactivities/${filename}`;
    }

    const updated = await placeActivityService.updatePlaceActivity(
      place_id,
      activity_id,
      {
        ...(price && { price }),
        ...(description && { description }),
        ...(file && { image_url: imageUrl }),
      }
    );

    // Delete old image file
    if (file) {
      await fileUploadService.removeFile(existing.image_url);
    }

    return res.status(200).json({
      success: true,
      message: "Place activity updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating place activity",
      error: error.message,
    });
  }
};

const deletePlaceActivity = async (req, res) => {
  try {
    const { place_id, activity_id } = req.params;

    const existing = await placeActivityService.getByPlaceIdAndActivityId({
      placeId: place_id,
      activityId: activity_id,
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Place activity not found",
      });
    }

    const deleted = await placeActivityService.deletePlaceActivity(
      place_id,
      activity_id
    );

    await fileUploadService.removeFile(existing.image_url);

    return res.status(200).json({
      success: true,
      message: "Place activity deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting place activity",
      error: error.message,
    });
  }
};

export default {
  getGroupedByPlace,
  updatePlaceActivity,
  deletePlaceActivity,
  createPlaceActivitiy,
};
