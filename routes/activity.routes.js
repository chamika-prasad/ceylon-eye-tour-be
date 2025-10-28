import express from "express";
import activityController from "../controllers/activity.controller.js";
import upload from "../middlewares/upload.middleware.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

router.post(
  "/create",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  upload.single("logo"),
  activityController.createActivity
);
router.put(
  "/update/:id",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  upload.single("logo"),
  activityController.updateActivity
);
router.delete(
  "/:id",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  activityController.deleteActivity
);
router.get("/get-all", activityController.getAllActivities);
router.get("/:id", activityController.getActivityById);

export default router;
