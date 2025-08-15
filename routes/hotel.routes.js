import express from "express";
import hotelController from "./../controllers/hotel.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Create new hotel
router.post("/add", upload.array("images", 8), hotelController.createHotel);

// Get all hotels
router.get("/get-all", hotelController.getAllHotels);

// Get hotel by ID
router.get("/get-by-id/:id", hotelController.getHotelById);

// Get hotels for a specific customer
router.get("/place/:placeId", hotelController.getHotelsByPlaceId);

// Update hotel details
router.put("/:id", hotelController.updateHotel);

// Delete hotel
router.delete("/:id", hotelController.deleteHotel);

export default router;
