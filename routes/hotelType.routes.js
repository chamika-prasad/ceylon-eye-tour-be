import express from "express";
import hotelTypeController from "./../controllers/hotelType.controller.js";
import upload from "../middlewares/upload.middleware.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

// Create new hotel type
router.post(
  "/add",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  upload.single("image"),
  hotelTypeController.createHotelType
);

// Get all hotel types
router.get(
  "/get-all",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  hotelTypeController.getAllHotelTypes
);

router.get(
  "/get-all-paginated",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  hotelTypeController.getAllHotelTypesWithPagination
);

// Get single hotel type by ID
router.get("/get-by-id/:id", hotelTypeController.getHotelTypeById);

// Update hotel type by ID
router.put(
  "/:id",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  upload.single("image"),
  hotelTypeController.updateHotelType
);

// Delete hotel type by ID
router.delete(
  "/:id",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  hotelTypeController.deleteHotelType
);

router.get(
  "/get-all-with-hotels",
  hotelTypeController.getAllHotelTypesWithHotelCount
);

router.get(
  "/get-all-with-hotels-paginated",
  hotelTypeController.getAllHotelTypesWithHotelCountAndPagination
);

router.get(
  "/get-by-urlprefix/:urlPrefix",
  hotelTypeController.getHotelTypeByUrlPrefix
);

router.get(
  "/get-by-urlprefix-paginated/:urlPrefix",
  hotelTypeController.getHotelTypeByUrlPrefixWithPaginationAndSearch
);

export default router;
