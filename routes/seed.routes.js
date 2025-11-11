import express from "express";
import seedController from "../controllers/seed.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Route for uploading seed temp image
router.post(
  "/upload-seed-image",
  upload.single("image"),
  seedController.uploadSeedImage
);

export default router;
