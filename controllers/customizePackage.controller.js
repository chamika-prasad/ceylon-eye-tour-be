import customizePackageService from "../services/customizePackage.service.js";

const createCustomizePackage = async (req, res) => {
  // const { userId, places } = req.body;
  const { places } = req.body;
  const { userId } = req.user;

  try {
    // if (!userId) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "User id requird" });
    // }

    if (!places || !Array.isArray(places)) {
      return res
        .status(400)
        .json({ success: false, message: "Place format invalid" });
    }

    if (places.length === 0) {
      return res.status(400).json({
        success: false,
        message: "There should be at least one place",
      });
    }

    const newPackage = await customizePackageService.createCustomizePackage(
      userId,
      places
    );

    res.status(201).json({
      success: true,
      message: "Customize package created successfully",
      data: newPackage,
    });
  } catch (error) {
    console.error("Error creating customize package:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create customize package",
      error: error.message,
    });
  }
};

const getAllCustomizePackages = async (req, res) => {
  try {
    const customizePackages =
      await customizePackageService.getAllCustomizePackages();

    res.status(200).json({
      success: true,
      message: "Customize packages retrive successfully",
      data: customizePackages,
    });
  } catch (error) {
    console.error("Error retriving customize packages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrive customize packages",
      error: error.message,
    });
  }
};

const getAllCustomizePackagesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const customizePackages =
      await customizePackageService.getAllCustomizePackagesByUserId(userId);

    res.status(200).json({
      success: true,
      message: "Customize packages for user retrive successfully",
      data: customizePackages,
    });
  } catch (error) {
    console.error("Error retriving customize packages for user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrive customize packages for user",
      error: error.message,
    });
  }
};

const updateIsApproved = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const customizePackage =
      await customizePackageService.getCustomizePackageById(id);
    if (!customizePackage) {
      return res
        .status(404)
        .json({ success: false, message: "Customize package not found" });
    }

    const result = await customizePackageService.setIsApproved(id, isApproved);
    return res.status(200).json({
      success: true,
      message: `Package ${isApproved ? "approved" : "rejected"}`,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in package approve",
      error: error.message,
    });
  }
};

const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const customizePackage =
      await customizePackageService.getCustomizePackageById(id);
    if (!customizePackage) {
      return res
        .status(404)
        .json({ success: false, message: "Customize package not found" });
    }

    const result = await customizePackageService.updateMessage(id, message);
    return res.status(200).json({
      success: true,
      message: "Customize package message updated successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in message update",
      error: error.message,
    });
  }
};

const updateRequiredDayCount = async (req, res) => {
  try {
    const { id } = req.params;
    const { requiredDayCount } = req.body;

    const customizePackage =
      await customizePackageService.getCustomizePackageById(id);
    if (!customizePackage) {
      return res
        .status(404)
        .json({ success: false, message: "Customize package not found" });
    }

    if (requiredDayCount < 1) {
      return res.status(400).json({
        success: false,
        message: "Required day count must be at least 1",
      });
    }

    const result = await customizePackageService.setRequiredDayCount(
      id,
      requiredDayCount
    );
    return res.status(200).json({
      success: true,
      message: "required_day_count updated",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error in update required day count",
    });
  }
};

const getCustomizePackageById = async (req, res) => {
  try {
    const { id } = req.params;

    const customizePackage =
      await customizePackageService.getCustomizePackageById(id);
    if (!customizePackage) {
      return res
        .status(404)
        .json({ success: false, message: "Customize package not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Customize package retrived successfully",
      data: customizePackage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error in update required day count",
    });
  }
};

export default {
  createCustomizePackage,
  getAllCustomizePackages,
  getAllCustomizePackagesByUserId,
  updateIsApproved,
  updateRequiredDayCount,
  getCustomizePackageById,
  updateMessage,
};
