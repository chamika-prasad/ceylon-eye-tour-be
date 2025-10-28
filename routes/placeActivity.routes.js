import express from "express";
import placeActivityController from "./../controllers/placeActivity.controller.js";
import upload from "../middlewares/upload.middleware.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

router.post(
  "/add",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  upload.single("image"),
  placeActivityController.createPlaceActivitiy
);

router.get("/grouped", placeActivityController.getGroupedByPlace);

router.put(
  "/:place_id/:activity_id",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  upload.single("image"),
  placeActivityController.updatePlaceActivity
);

router.delete(
  "/:place_id/:activity_id",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  placeActivityController.deletePlaceActivity
);

export default router;
