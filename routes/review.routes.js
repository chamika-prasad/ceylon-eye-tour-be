import express from "express";
import reviewController from "../controllers/review.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

router.post("/add",tokenMiddleware.verifyToken, reviewController.createReview);
router.get("/get-all", reviewController.getAllReviews);
router.put("/:id", reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);

export default router;
