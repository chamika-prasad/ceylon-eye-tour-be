import express from "express";
import messageController from "../controllers/message.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

// Add a new message
router.post("/add", tokenMiddleware.verifyToken, messageController.addMessage);

// Get all messages where senderId OR receiverId = userId (order by created_at)
router.get("/", tokenMiddleware.verifyToken, messageController.getMessages);

// Get all messages grouped by user
// Need to authorize for only admin
router.get(
  "/grouped",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  messageController.getGroupedMessages
);

export default router;
