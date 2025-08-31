import express from "express";
import placeActivityController from "./../controllers/placeActivity.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post(
  "/add",
  upload.single("image"),
  placeActivityController.createPlaceActivitiy
);

router.get("/grouped", placeActivityController.getGroupedByPlace);

router.put(
  "/:place_id/:activity_id",
  placeActivityController.updatePlaceActivity
);

router.delete(
  "/:place_id/:activity_id",
  placeActivityController.deletePlaceActivity
);

export default router;
