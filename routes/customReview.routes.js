import express from "express";
import customReviewController from "../controllers/customReview.controller.js";

const router = express.Router();

router.post("/create", customReviewController.createCustomReview);
router.get("/get-all", customReviewController.getAllCustomReviews);
router.get("/:id", customReviewController.getCustomReviewById);
router.put("/update/:id", customReviewController.updateCustomReview);
router.delete("/:id", customReviewController.deleteCustomReview);

export default router;