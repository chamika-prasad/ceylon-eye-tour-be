import express from "express";
import hotelTypeController from "./../controllers/hotelType.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Create new hotel type
router.post(
  "/add",
  upload.single("image"),
  hotelTypeController.createHotelType
);

// Get all hotel types
router.get("/get-all", hotelTypeController.getAllHotelTypes);

// Get single hotel type by ID
router.get("/get-by-id/:id", hotelTypeController.getHotelTypeById);

// Update hotel type by ID
router.put("/:id", hotelTypeController.updateHotelType);

// Delete hotel type by ID
router.delete("/:id", hotelTypeController.deleteHotelType);

router.get(
  "/get-all-with-hotels",
  hotelTypeController.getAllHotelTypesWithHotelCount
);

router.get(
  "/get-by-urlprefix/:urlPrefix",
  // tokenMiddleware.verifyToken,
  hotelTypeController.getHotelTypeByUrlPrefix
);

export default router;
