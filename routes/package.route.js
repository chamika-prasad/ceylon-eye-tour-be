import express from "express";
import packageController from "./../controllers/package.controller.js";
import tokenMiddleware from "./../middlewares/token.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get(
  "/get-all",
  // tokenMiddleware.verifyToken,
  packageController.getPackages
);

router.get(
  "/get-by-id/:id",
  // tokenMiddleware.verifyToken,
  packageController.getPackageById
);

router.get("/category/:categoryId", packageController.getPackagesByCategoryId);
router.get("/tour-type/:tour_type_id", packageController.getPackagesByTourType);

router.post(
  "/add",
  // tokenMiddleware.verifyToken,
  upload.array("images", 10),
  packageController.addPackage
);

export default router;
