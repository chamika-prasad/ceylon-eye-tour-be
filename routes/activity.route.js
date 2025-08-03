import express from "express";
import activityController from "./../controllers/activity.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post(
  "/create",
  upload.single("logo"),
  activityController.createActivity
);
router.put("/update/:id", activityController.updateActivity);
router.delete("/:id", activityController.deleteActivity);
router.get("/get-all", activityController.getAllActivities);
router.get("/:id", activityController.getActivityById);

export default router;
