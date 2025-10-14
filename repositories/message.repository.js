import { Message, User } from "../models/index.js";

const addMessage = async (messageData) => {
  return await Message.create({
    sender_id: messageData.senderId,
    receiver_id: messageData.receiverId,
    message: messageData.message,
  });
};

const getMessagesByUser = async (userId) => {
  return await Message.findAll({
    where: { user_id: userId },
    order: [["created_at", "ASC"]],
  });
};

const getMessagesGroupedByUser = async () => {
  const latestMessages = await Message.findAll({
    attributes: ["id", "message", "sender_id", "receiver_id", "created_at"],
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name"], // Include customer name and id
      },
    ],
    order: [['created_at', 'DESC']]
  });

  const uniqueSenders = [];
  const userIds = new Set();

  for (const msg of latestMessages) {
    if (!userIds.has(msg.user.id)) {
      userIds.add(msg.user.id);
      uniqueSenders.push(msg);
    }
  }

  return uniqueSenders;
};



export default {
  addMessage,
  getMessagesByUser,
  getMessagesGroupedByUser,
};
