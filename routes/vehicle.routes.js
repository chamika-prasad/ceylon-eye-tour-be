import express from "express";
import vehicleController from "../controllers/vehicle.controller.js";
import upload from "../middlewares/upload.middleware.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

router.post(
  "/add",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  upload.array("images", 8),
  vehicleController.createVehicle
);
router.delete(
  "/:id",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  vehicleController.deleteVehicle
);
router.get("/get-all", vehicleController.getAllVehicles);
router.get("/:urlPrefix", vehicleController.getVehicleByUrlPrefix);
// Update vehicle details
router.put(
  "/:id",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  upload.array("images", 8),
  vehicleController.updateVehicle
);

export default router;
