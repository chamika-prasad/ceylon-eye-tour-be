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

export default {
  register,
  getUserByEmail,
};
