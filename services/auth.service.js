import authRepository from "../repositories/auth.repository.js";

const register = async (userData) => {
  try {
    const result = await authRepository.register(userData);
    return result;
  } catch (error) {
    throw new Error(`Error in AuthService register: ${error}`);
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await authRepository.getUserByEmail(email);
    return user;
  } catch (error) {
    throw new Error(`Error in AuthService getUserByEmail: ${error}`);
  }
};

const getUserById = async (userId) => {
  const user = await authRepository.getUserById(userId);
  return user;
};

const updateProfileImage = async (userId, newProfileImage) => {
  try {
    const result = await authRepository.updateProfileImage(
      userId,
      newProfileImage
    );
    return result;
  } catch (error) {
    throw new Error(`Error in AuthService updateProfileImage: ${error}`);
  }
};

export default {
  register,
  getUserByEmail,
  updateProfileImage,
  getUserById,
};
