import authService from "../services/auth.service.js";
import passwordService from "./../services/password.service.js";
import tokenService from "./../services/token.service.js";

// Register method
const register = async (req, res) => {
  try {
    const { name, email, country, phoneNo, password } = req.body;

    // Check if user already exists
    const existingUser = await authService.getUserByEmail(email);
    if (existingUser.success) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash the password
    var hashedPassword = await passwordService.hashPassword(password);

    const createdUser = await authService.register({
      name,
      email,
      country,
      phoneNo,
      hashedPassword,
    });

    if (!createdUser.success) {
      return res
        .status(400)
        .json({ success: false, message: createdUser.message });
    }

    return res.status(201).json({
      success: createdUser.success,
      message: createdUser.message,
      data: createdUser.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await authService.getUserByEmail(email);
    if (!existingUser.success) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Varify the password
    var isPasswordValid = await passwordService.verifyPassword(
      password,
      existingUser.data.pw
    );

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    }

    var token = await tokenService.generateToken(
      existingUser.data.id,
      existingUser.data.name,
      existingUser.data.email,
      existingUser.data.role
    );

    return res
      .status(200)
      .json({ success: true, data: token, message: "User login successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error,
    });
  }
};

export default {
  register,
  login,
};
