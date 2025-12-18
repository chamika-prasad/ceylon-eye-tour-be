import messageRepository from "../repositories/message.repository.js";

const createMessage = async (data) => {
  return await messageRepository.addMessage(data);
};

const getMessageById = async (id) => {
  return await messageRepository.getMessageById(id);
};

const updateMessage = async (id, data) => {
  return await messageRepository.updateMessage(id, data);
};

const getUserMessages = async (userId) => {
  return await messageRepository.getMessagesByUser(userId);
};

const getGroupedMessages = async (adminId) => {
  const groupedMessages = await messageRepository.getMessagesGroupedByUser();

  const uniqueSenders = [];
  const userIds = new Set();

  for (const msg of groupedMessages) {
    if (!userIds.has(msg.user.id)) {
      const unreadCount =
        await messageRepository.countUnreadMessagesFromSenderToReceiver(
          msg.user.id,
          adminId
        );
      userIds.add(msg.user.id);
      uniqueSenders.push({ ...msg.toJSON(), unreadCount });
    }
  }

  return uniqueSenders;
};

const markMessagesAsRead = async (receiverId) => {
  return await messageRepository.markMessagesAsRead(receiverId);
};

const markAdminMessagesAsReadForUser = async (userId, adminId) => {
  return await messageRepository.markAdminMessagesAsReadForUser(userId, adminId);
};

const getUserUnredMessageCount = async (userId) => {
  return await messageRepository.getUserUnredMessageCount(userId);
};

export default {
  createMessage,
  getUserMessages,
  getGroupedMessages,
  getMessageById,
  updateMessage,
  markMessagesAsRead,
  getUserUnredMessageCount,
  markAdminMessagesAsReadForUser,
};
