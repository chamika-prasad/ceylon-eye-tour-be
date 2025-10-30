import messageRepository from "../repositories/message.repository.js";

const createMessage = async (data) => {
  return await messageRepository.addMessage(data);
};

const getMessageById = async (id) => {
  return await messageRepository.getMessageById(id);
};

const updateMessage = async (id,data) => {
  return await messageRepository.updateMessage(id,data);
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
  getMessageById,
  updateMessage,
};
