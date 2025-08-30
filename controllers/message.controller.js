import messageService from "../services/message.service.js";

// ✅ Add new message
const addMessage = async (req, res) => {
  try {
    // const { senderId, receiverId, message } = req.body;
    const { receiverId, message } = req.body;
    const { userId } = req.user;

    // if (!senderId || !receiverId || !message) {
    if (!receiverId || !message) {
      return res.status(400).json({
        success: false,
        // message: "Sender, receiver, and message are required",
        message: "Receiver, and message are required",
      });
    }

    const newMessage = await messageService.createMessage({
      senderId: userId,
      receiverId,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error sending message",
      error: error.message,
    });
  }
};

// ✅ Get all messages for a user (sender or receiver)
const getMessages = async (req, res) => {
  try {
    // const { userId } = req.params;
    const { userId } = req.user;

    const messages = await messageService.getUserMessages(userId);

    return res.status(200).json({
      success: true,
      message: "Messages retrieved successfully",
      data: messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving messages",
      error: error.message,
    });
  }
};

// ✅ Get grouped messages (latest message per user)
const getGroupedMessages = async (req, res) => {
  try {
    // const { adminId } = req.params;
    const { userId } = req.user;

    const groupedMessages = await messageService.getGroupedMessages(userId);

    return res.status(200).json({
      success: true,
      message: "Grouped messages retrieved successfully",
      data: groupedMessages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving grouped messages",
      error: error.message,
    });
  }
};

export default {
  addMessage,
  getMessages,
  getGroupedMessages,
};
