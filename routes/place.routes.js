import express from "express";
import placeController from "../controllers/place.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/add", upload.single("image"), placeController.createPlace);
router.get("/get-all", placeController.getAllPlaces);
router.get("/get-by-id/:id", placeController.getPlaceById);
router.delete("/:id", placeController.deletePlace);
router.get("/get-all-with-hotels", placeController.getAllPlacesWithHotelCount);
router.get(
  "/get-by-urlprefix/:urlPrefix",
  // tokenMiddleware.verifyToken,
  placeController.getPlaceByUrlPrefix
);

export default router;
