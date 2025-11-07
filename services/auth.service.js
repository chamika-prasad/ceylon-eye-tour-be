import authRepository from "../repositories/auth.repository.js";

const register = async (userData) => {
  const result = await authRepository.register(userData);
  return result;
};

const getUserByEmail = async (email) => {
  const user = await authRepository.getUserByEmail(email);
  return user;
};

const getUserById = async (userId) => {
  const user = await authRepository.getUserById(userId);
  return user;
};

const updateProfile = async (userId, userData) => {
  const result = await authRepository.updateProfile(userId, userData);
  return result;
};

const updateTempPassword = async (email, tempPassword) => {
  return await authRepository.updateTempPassword(email, tempPassword);
};

const resetPassword = async (email, password) => {
  return await authRepository.resetPassword(email, password);
};

export default {
  register,
  getUserByEmail,
  updateProfile,
  getUserById,
  updateTempPassword,
  resetPassword,
};
