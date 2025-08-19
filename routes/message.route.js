import express from "express";
import messageController from "../controllers/message.controller.js";

const router = express.Router();

// Add a new message
router.post("/add", messageController.addMessage);

// Get all messages where senderId OR receiverId = userId (order by created_at)
router.get("/:userId", messageController.getMessages);

// Get all messages grouped by user
router.get("/grouped/:adminId", messageController.getGroupedMessages);

export default router;
