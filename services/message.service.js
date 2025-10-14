import messageRepository from "../repositories/message.repository.js";

const createMessage = async (data) => {
  return await messageRepository.addMessage(data);
};

const getUserMessages = async (userId) => {
  return await messageRepository.getMessagesByUser(userId);
};

const getGroupedMessages = async () => {
  return await messageRepository.getMessagesGroupedByUser();
};

export default {
  createMessage,
  getUserMessages,
  getGroupedMessages,
};
