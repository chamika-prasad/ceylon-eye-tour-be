import path from "path";
import authService from "../services/auth.service.js";
import passwordService from "./../services/password.service.js";
import tokenService from "./../services/token.service.js";
import fileUploadService from "../services/fileUpload.service.js";
import emailService from "../services/email.service.js";
import emailTemplateService from "../services/emailTemplate.service.js";

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

    let profileImageUrl = null;

    if (req.file) {
      // Upload profile image
      const uploadDir = path.join("uploads", "auth");

      const filename = await fileUploadService.uploadFile(uploadDir, req.file);

      profileImageUrl = `/uploads/auth/${filename}`;
    }

    // Hash the password
    var hashedPassword = await passwordService.hashPassword(password);

    const createdUser = await authService.register({
      name,
      email,
      country,
      phoneNo,
      hashedPassword,
      profileImage: profileImageUrl,
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
      error: error.message,
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
      existingUser.data.role,
      existingUser.data.profile_image
    );

    return res
      .status(200)
      .json({ success: true, data: token, message: "User login successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const { name, email, country, phoneNo, password } = req.body;

    if (!name && !email && !country && !phoneNo && !password && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }

    // Check if user already exists
    const existingUser = await authService.getUserById(userId);
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (password) {
      var hashedPassword = await passwordService.hashPassword(password);
    }

    if (req.file) {
      // Upload profile image
      const uploadDir = path.join("uploads", "auth");

      const filename = await fileUploadService.uploadFile(uploadDir, req.file);

      var profileImageUrl = `/uploads/auth/${filename}`;
    }

    const userData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(country && { country }),
      ...(phoneNo && { phoneno: phoneNo }),
      ...(password && { pw: hashedPassword }),
      ...(req.file && { profile_image: profileImageUrl }),
    };

    // Update in DB
    const updatedUser = await authService.updateProfile(userId, userData);

    if (req.file && existingUser.profile_image) {
      // Remove old profile image
      await fileUploadService.removeFile(existingUser.profile_image);
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

const getTempPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    // Check if user already exists
    const existingUser = await authService.getUserByEmail(email);
    if (!existingUser.success) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // Generate a temp password
    const tempPassword = passwordService.generateTempPassword();
    var hashedPassword = await passwordService.hashPassword(tempPassword);
    const updateTempPw = await authService.updateTempPassword(
      email,
      hashedPassword
    );
    // Send email with temp password
    const template = emailTemplateService.generateTempPasswordTemplate(
      existingUser.data.name,
      tempPassword,
      15
    );

    await emailService.sendEmail({
      to: email,
      subject: "Password Reset",
      html: template,
    });
    return res.status(200).json({
      success: true,
      message: "Temporary password sent to your email",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error password resetting",
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password, tempPassword } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password is required" });
    }

    // Check if user already exists
    const existingUser = await authService.getUserByEmail(email);
    if (!existingUser.success) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Varify the temp password
    var isPasswordValid = await passwordService.verifyPassword(
      tempPassword,
      existingUser.data.temp_pw
    );

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect reset code" });
    }

    if (
      new Date(existingUser.data.updated_at).getTime() + 15 * 60 * 1000 <
      Date.now()
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Your temp code has expired" });
    }

    var hashedPassword = await passwordService.hashPassword(password);
    const updatePw = await authService.resetPassword(email, hashedPassword);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error password resetting",
      error: error.message,
    });
  }
};

export default {
  register,
  login,
  updateProfile,
  getTempPassword,
  resetPassword,
};
