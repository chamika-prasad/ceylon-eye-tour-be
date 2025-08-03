import express from "express";
import upload from "../middlewares/upload.middleware.js";
import tourTypeController from "../controllers/tourType.controller.js";

const router = express.Router();

router.get("/", tourTypeController.getAllTourTypes);
router.get("/:id", tourTypeController.getTourTypeById);
router.post("/create", upload.single("image"), tourTypeController.createTourType);
router.put("/:id", tourTypeController.updateTourType);
router.delete("/:id", tourTypeController.deleteTourType);

export default router;
