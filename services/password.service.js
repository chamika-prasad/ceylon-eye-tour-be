import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const hashPassword = async (plainPassword) => {
  try {
    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password: " + error);
  }
};

const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error("Error verifying password: " + error);
  }
};

const generateTempPassword = () => {
  try {
    const tempPassword = Math.random().toString(36).slice(-8);
    return tempPassword;
  } catch (error) {
    throw new Error("Error generating temporary password: " + error);
  }
};

export default { hashPassword, verifyPassword, generateTempPassword };
