import galleryService from "../services/gallery.service.js";

// Get all gallery items
const getAllGallery = async (req, res) => {
  try {
    const galleries = await galleryService.getAllGallery();
    return res.status(200).json({
      success: true,
      message: "Gallery items retrieved successfully",
      data: galleries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving gallery items",
      error: error.message,
    });
  }
};

const getAllApprovedGallery = async (req, res) => {
  try {
    const galleries = await galleryService.getAllApprovedGallery();
    return res.status(200).json({
      success: true,
      message: "Approved Gallery items retrieved successfully",
      data: galleries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving gallery items",
      error: error.message,
    });
  }
};

// Update is_approved by ID
const updateGalleryApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_approved } = req.body;

    if (typeof is_approved !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "is_approved must be a boolean value",
      });
    }

    const updated = await galleryService.updateGalleryApproval(id, is_approved);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Gallery approval status updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating gallery approval",
      error: error.message,
    });
  }
};

export default {
  getAllGallery,
  updateGalleryApproval,
  getAllApprovedGallery,
};
