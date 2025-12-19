import path from "path";
import galleryService from "../services/gallery.service.js";
import fileUploadService from "../services/fileUpload.service.js";
import dotenv from "dotenv";

dotenv.config();

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

const getAllGalleryWithPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize =
      parseInt(req.query.size) || parseInt(process.env.PAGINATION_LIMIT) || 10;
    const isApproved =
      req.query.isApproved === "true"
        ? true
        : req.query.isApproved === "false"
        ? false
        : undefined;

    // Validation
    if (page < 1) {
      return res.status(400).json({
        success: false,
        message: "Page must be greater than 0",
      });
    }

    if (pageSize < 1 || pageSize > 100) {
      return res.status(400).json({
        success: false,
        message: "Page size must be between 1 and 100",
      });
    }

    const result = await galleryService.getAllGalleryWithPagination(
      page,
      pageSize,
      isApproved
    );

    return res.status(200).json({
      success: true,
      message: "Gallery items retrieved successfully",
      data: result.galleries,
      pagination: {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        pageSize: result.pageSize,
      },
    });
  } catch (error) {
    console.error("Error retrieving gallery items:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving gallery items",
      error: error.message,
    });
  }
};

const getAllApprovedGalleryWithPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize =
      parseInt(req.query.pageSize) ||
      parseInt(process.env.PAGINATION_LIMIT) ||
      10;

    // Validation
    if (page < 1) {
      return res.status(400).json({
        success: false,
        message: "Page must be greater than 0",
      });
    }

    if (pageSize < 1 || pageSize > 100) {
      return res.status(400).json({
        success: false,
        message: "Page size must be between 1 and 100",
      });
    }

    const result = await galleryService.getAllApprovedGalleryWithPagination(
      page,
      pageSize
    );

    return res.status(200).json({
      success: true,
      message: "Approved gallery items retrieved successfully",
      data: result.galleries,
      pagination: {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        pageSize: result.pageSize,
      },
    });
  } catch (error) {
    console.error("Error retrieving approved gallery items:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving approved gallery items",
      error: error.message,
    });
  }
};

export default {
  getAllGallery,
  updateGalleryApproval,
  getAllApprovedGallery,
  addGalleryItem,
  deleteGalleryItem,
  getAllGalleryWithPagination,
  getAllApprovedGalleryWithPagination,
};
