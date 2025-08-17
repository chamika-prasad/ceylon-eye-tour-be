import express from "express";
import vehicleController from "../controllers/vehicle.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/add",upload.array("images", 8), vehicleController.createVehicle);
router.delete("/:id", vehicleController.deleteVehicle);
router.get("/get-all", vehicleController.getAllVehicles);
router.get("/:urlPrefix", vehicleController.getVehicleByUrlPrefix);

export default router;
