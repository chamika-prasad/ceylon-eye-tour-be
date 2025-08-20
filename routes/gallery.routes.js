import express from "express";
import galleryController from "./../controllers/gallery.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/get-all", galleryController.getAllGallery);
router.get("/get-all-approved", galleryController.getAllApprovedGallery);
router.put("/:id", galleryController.updateGalleryApproval);
router.post("/add", upload.single("image"), galleryController.addGalleryItem);
router.delete("/:id", galleryController.deleteGalleryItem);

export default router;
