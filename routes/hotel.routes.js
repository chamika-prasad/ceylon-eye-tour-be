import express from "express";
import hotelController from "./../controllers/hotel.controller.js";
import upload from "../middlewares/upload.middleware.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

// Create new hotel
router.post(
  "/add",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  upload.any(),
  hotelController.createHotel
);

// Get all hotels
router.get("/get-all", hotelController.getAllHotels);

// Get hotel by ID
router.get("/get-by-id/:id", hotelController.getHotelById);
router.get("/get-by-urlPrifix/:urlPrifix", hotelController.getHotelByPrefix);

// Get hotels for a specific place
router.get("/place/:placeId", hotelController.getHotelsByPlaceId);

// Update hotel details
router.put(
  "/:id",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  // upload.array("images", 8),
  upload.any(),
  hotelController.updateHotel
);

// Delete hotel
router.delete(
  "/:id",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  hotelController.deleteHotel
);

export default router;
