import express from "express";
import reviewController from "../controllers/review.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

router.post("/add", tokenMiddleware.verifyToken, reviewController.createReview);
router.get("/get-all", reviewController.getAllReviews);
router.put("/:id", tokenMiddleware.verifyToken, reviewController.updateReview);
router.delete(
  "/:id",
  tokenMiddleware.verifyToken,
  reviewController.deleteReview
);

export default router;
