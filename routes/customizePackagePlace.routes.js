import express from "express";
import customizePackagePlaceController from "../controllers/customizePackagePlace.controller.js";

const router = express.Router();

router.put("/:id/update", customizePackagePlaceController.updateCustomizePackagePlace);

export default router;
