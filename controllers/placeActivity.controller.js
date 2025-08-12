import fs from "fs";
import path from "path";
import placeActivityService from "../services/placeActivity.service.js";
import fileUploadService from "../services/fileUpload.service.js";

const createPlaceActivities = async (req, res) => {
  try {
    const { placeid, activities } = req.body;
    const parseActivities = JSON.parse(activities); // must be stringified in frontend
    const files = req.files;

    // ✅ Validate: activity count === image count
    if (!Array.isArray(parseActivities)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid activities format" });
    }

    if (parseActivities.length !== files.length) {
      return res.status(400).json({
        success: false,
        message: `Activities count (${parseActivities.length}) and images count (${files.length}) do not match.`,
      });
    }

    // Save files to disk and create image URLs
    const uploadDir = path.join("uploads", "placeactivities");
    const activityRecords = await Promise.all(
      parseActivities.map(async (activity, index) => {
        const file = files[index];
        let imageUrl = null;

        if (file) {
          const filename = await fileUploadService.uploadFile(uploadDir, file);
          imageUrl = `/uploads/placeactivities/${filename}`;
        }

        return {
          place_id: placeid,
          activity_id: activity.id,
          description: activity.description,
          price: activity.price,
          image_url: imageUrl,
        };
      })
    );

    await placeActivityService.bulkCreateActivities(activityRecords);

    res
      .status(201)
      .json({ success: true, message: "Activities added successfully" });
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

    const updated = await placeActivityService.updatePlaceActivity(
      place_id,
      activity_id,
      {
        ...(price && { price }),
        ...(description && { description }),
      }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Place activity not found",
      });
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

    const deleted = await placeActivityService.deletePlaceActivity(
      place_id,
      activity_id
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Place activity not found",
      });
    }

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
  createPlaceActivities,
  getGroupedByPlace,
  updatePlaceActivity,
  deletePlaceActivity,
};
