import { Customer } from "./../models/index.js";

const register = async (userData) => {
  try {
    const { name, email, country, phoneNo, hashedPassword } = userData;

    const customer = await Customer.create({
      email: email,
      pw: hashedPassword,
      phoneno: phoneNo,
      country: country,
      name: name,
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
  try {
    const existUser = await Customer.findByPk(userId);
    if (existing) {
      return { success: true, data: existUser, message: "User found" };
    } else {
      return { success: false, message: "User not found" };
    }
  } catch (error) {
    throw new Error(`Error in AuthRepository getUserById: ${error}`);
  }
};

const getUserByEmail = async (email) => {
  console.log("getUserByEmail called with email:", email);

  try {
    const existUser = await Customer.findOne({ where: { email } });
    if (existUser) {
      return { success: true, data: existUser, message: "User found" };
    } else {
      return { success: false, message: "User not found" };
    }
  } catch (error) {
    throw new Error(`Error in AuthRepository getUserByEmail: ${error}`);
  }
};

export default {
  register,
  getUserById,
  getUserByEmail,
};
