import { User } from "./../models/index.js";

const register = async (userData) => {
  try {
    const { name, email, country, phoneNo, hashedPassword, profileImage } =
      userData;

    const customer = await User.create({
      email: email,
      pw: hashedPassword,
      phoneno: phoneNo,
      country: country,
      name: name,
      profile_image: profileImage,
    });

    return {
      success: true,
      data: customer,
      message: "User registered successfully",
    };
  } catch (error) {
    throw new Error(`Error in AuthRepository register: ${error}`);
  }
};

const getUserById = async (userId) => {
  const existUser = await User.findByPk(userId);
  return existUser;
};

const getUserByEmail = async (email) => {
  try {
    const existUser = await User.findOne({ where: { email } });
    if (existUser) {
      return { success: true, data: existUser, message: "User found" };
    } else {
      return { success: false, message: "User not found" };
    }
  } catch (error) {
    throw new Error(`Error in AuthRepository getUserByEmail: ${error}`);
  }
};

const updateProfile = async (userId, userData) => {
  return await User.update(userData, {
    where: { id: userId },
  });
};

export default {
  register,
  getUserById,
  getUserByEmail,
  updateProfile,
};
