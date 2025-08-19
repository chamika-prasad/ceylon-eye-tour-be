import messageRepository from "../repositories/message.repository.js";

const createMessage = async (data) => {
  return await messageRepository.addMessage(data);
};

const getUserMessages = async (userId) => {
  return await messageRepository.getMessagesByUser(userId);
};

const getGroupedMessages = async (adminId) => {
  return await messageRepository.getMessagesGroupedByUser(adminId);
};

export default {
  createMessage,
  getUserMessages,
  getGroupedMessages,
};
