import { Message, User } from "../models/index.js";

const addMessage = async (messageData) => {
  return await Message.create({
    sender_id: messageData.senderId,
    receiver_id: messageData.receiverId,
    user_id: messageData.userId,
    message: messageData.message,
  });
};

const updateMessage = async (id, data) => {
  return await Message.update(data, {
    where: { id },
  });
};

const getMessageById = async (id) => {
  return await Message.findByPk(id);
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
    order: [["created_at", "DESC"]],
  });

  return latestMessages;
};

const markMessagesAsRead = async (receiverId) => {
  return await Message.update(
    { is_read: true },
    { where: { receiver_id: receiverId, is_read: false } }
  );
};

const markAdminMessagesAsReadForUser = async (userId, adminId) => {
  return await Message.update(
    { is_read: true },
    { where: { receiver_id: adminId, sender_id: userId, is_read: false } }
  );
};

const countUnreadMessagesFromSenderToReceiver = async (
  senderId,
  receiverId
) => {
  return await Message.count({
    where: {
      sender_id: senderId,
      receiver_id: receiverId,
      is_read: false,
    },
  });
};

const getUserUnredMessageCount = async (userId) => {
  return await Message.count({
    where: {
      receiver_id: userId,
      is_read: false,
    },
  });
};

export default {
  addMessage,
  updateMessage,
  getMessageById,
  getMessagesByUser,
  getMessagesGroupedByUser,
  markMessagesAsRead,
  countUnreadMessagesFromSenderToReceiver,
  getUserUnredMessageCount,
  markAdminMessagesAsReadForUser,
};
