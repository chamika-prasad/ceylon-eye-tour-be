import express from "express";
import customReviewController from "../controllers/customReview.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

router.post("/create", customReviewController.createCustomReview);
router.get("/get-all", customReviewController.getAllCustomReviews);
router.get("/:id",tokenMiddleware.verifyToken,tokenMiddleware.authorizeAdmin, customReviewController.getCustomReviewById);
router.put("/update/:id",tokenMiddleware.verifyToken,tokenMiddleware.authorizeAdmin, customReviewController.updateCustomReview);
router.delete("/:id",tokenMiddleware.verifyToken,tokenMiddleware.authorizeAdmin, customReviewController.deleteCustomReview);

export default router;