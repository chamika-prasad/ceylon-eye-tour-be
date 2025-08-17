import path from "path";
import galleryService from "../services/gallery.service.js";
import fileUploadService from "../services/fileUpload.service.js";

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
    const { isApproved } = req.body;

    if (typeof isApproved !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "is_approved must be a boolean value",
      });
    }

    const updated = await galleryService.updateGalleryApproval(id, isApproved);

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

// Add a new gallery item
const addGalleryItem = async (req, res) => {
  try {
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer id required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const uploadDir = path.join("uploads", "gallery");

    const filename = await fileUploadService.uploadFile(uploadDir, req.file);

    const imageUrl = `/uploads/gallery/${filename}`;

    const newGalleryItem = await galleryService.addGalleryItem({
      customer_id: customerId,
      image_url: imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Gallery item added successfully",
      data: newGalleryItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error adding gallery item",
      error: error.message,
    });
  }
};

// Delete a gallery item by ID
const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await galleryService.deleteGalleryItemById(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Gallery item deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting gallery item",
      error: error.message,
    });
  }
};

export default {
  getAllGallery,
  updateGalleryApproval,
  getAllApprovedGallery,
  addGalleryItem,
};
