import express from "express";
import authController from "../controllers/auth.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Route for user registration
router.post("/register", upload.single("profileImage"), authController.register);

// Route for user login
router.post("/login", authController.login);

export default router;
