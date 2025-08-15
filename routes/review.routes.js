import express from "express";
import reviewController from "../controllers/review.controller.js";

const router = express.Router();

router.post("/add", reviewController.createReview);
router.get("/get-all", reviewController.getAllReviews);
router.put("/:id", reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);

export default router;
