import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const generateToken = async (userId, username, email, role) => {
  const data = {
    userId: userId,
    userName: username,
    email: email,
    role: role,
  };

  try {
    const token = jwt.sign(data, jwtSecretKey, { expiresIn: "2 days" });
    return token;
  } catch (error) {
    throw new Error("Token generation faild");
  }
};

const decodeToken = async (token) => {
  try {
    const decoded = jwt.verify(token, jwtSecretKey);
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

export default { generateToken, decodeToken };
