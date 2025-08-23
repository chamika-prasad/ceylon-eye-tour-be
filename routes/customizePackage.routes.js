import express from "express";
import customizePackageController from "../controllers/customizePackage.controller.js";

const router = express.Router();

router.post("/add", customizePackageController.createCustomizePackage);
router.get("/get-all", customizePackageController.getAllCustomizePackages);
router.get("/get-all/:userId", customizePackageController.getAllCustomizePackagesByUserId);
router.get("/:id", customizePackageController.getCustomizePackageById);
router.put("/:id/is-approved", customizePackageController.updateIsApproved);
router.put("/:id/message", customizePackageController.updateMessage);
router.put("/:id/required-day-count", customizePackageController.updateRequiredDayCount);

export default router;
