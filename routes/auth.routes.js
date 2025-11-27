import express from "express";
import authController from "../controllers/auth.controller.js";
import upload from "../middlewares/upload.middleware.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

// Route for user registration
router.post(
  "/register",
  upload.single("profileImage"),
  authController.register
);

// Route for user login
router.post("/login", authController.login);

router.put(
  "/update-profile",
  tokenMiddleware.verifyToken,
  upload.single("profileImage"),
  authController.updateProfile
);

router.put("/get-temp-password", authController.getTempPassword);
router.put("/reset-password", authController.resetPassword);

router.get(
  "/user",
  tokenMiddleware.verifyToken,
  authController.getUserById
);

export default router;
