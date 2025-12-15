import express from "express";
import placeController from "../controllers/place.controller.js";
import upload from "../middlewares/upload.middleware.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

router.post(
  "/add",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  upload.single("image"),
  placeController.createPlace
);
router.put(
  "/update/:id",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  upload.single("image"),
  placeController.updatePlace
);
router.get("/get-all", placeController.getAllPlaces);
router.get("/get-by-id/:id", placeController.getPlaceById);
router.delete(
  "/:id",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  placeController.deletePlace
);
router.get("/get-all-with-hotels", placeController.getAllPlacesWithHotelCount);
router.get("/get-by-urlprefix/:urlPrefix", placeController.getPlaceByUrlPrefix);

router.get("/get-all-paginated", placeController.getAllPlacesWithPagination);
router.get("/get-all-with-hotels-paginated", placeController.getAllPlacesWithHotelCountAndPagination);
router.get("/get-by-urlprefix/:urlPrefix/paginated", placeController.getPlaceByUrlPrefixWithHotelCountAndPagination);


export default router;
