import express from "express";
import galleryController from "./../controllers/gallery.controller.js";

const router = express.Router();

router.get("/get-all", galleryController.getAllGallery);
router.get("/get-all-approved", galleryController.getAllApprovedGallery);
router.put("/:id", galleryController.updateGalleryApproval);

export default router;
