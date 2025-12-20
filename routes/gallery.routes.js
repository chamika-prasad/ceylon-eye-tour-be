import express from "express";
import galleryController from "./../controllers/gallery.controller.js";
import upload from "../middlewares/upload.middleware.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

router.get("/get-all", galleryController.getAllGallery);
router.get("/get-all-approved", galleryController.getAllApprovedGallery);
router.get(
  "/get-all-paginated",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  galleryController.getAllGalleryWithPagination
);
router.get(
  "/get-all-approved-paginated",
  galleryController.getAllApprovedGalleryWithPagination
);
router.put(
  "/:id",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  galleryController.updateGalleryApproval
);
router.post(
  "/add",
  upload.single("image"),
  tokenMiddleware.verifyToken,
  galleryController.addGalleryItem
);
router.delete(
  "/:id",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  galleryController.deleteGalleryItem
);

export default router;
