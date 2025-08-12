import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import activityService from "../services/activity.service.js";
import fileUploadService from "../services/fileUpload.service.js";

const createActivity = async (req, res) => {
  try {
    const { name } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Activity logo is required",
      });
    }

    const uploadDir = path.join("uploads", "activities");

    const filename = await fileUploadService.uploadFile(uploadDir, req.file);

    const imageUrl = `/uploads/activities/${filename}`;

    const activity = await activityService.createActivity({
      name,
      image_url: imageUrl,
    });
    return res.status(201).json({ success: true, data: activity });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    await activityService.updateActivity(id, { name });
    return res.status(200).json({ success: true, message: "Activity updated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    await activityService.deleteActivity(id);
    return res.status(200).json({ success: true, message: "Activity deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllActivities = async (req, res) => {
  try {
    const activities = await activityService.getAllActivities();
    return res.status(200).json({ success: true, data: activities });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await activityService.getActivityById(id);
    if (!activity) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    return res.status(200).json({ success: true, data: activity });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



export default {
  createActivity,
  updateActivity,
  deleteActivity,
  getAllActivities,
  getActivityById,
};
