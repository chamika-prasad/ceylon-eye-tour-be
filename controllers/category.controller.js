import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import categoryService from "../services/category.service.js";
import fileUploadService from "../services/fileUpload.service.js";
import tokenService from "../services/token.service.js";

const getCategories = async (req, res) => {
  const { tourType } = req.query;
  
  try {
    // const categories = await categoryService.getCategories();
    const categories = await categoryService.getCategories(Number(tourType), req.user?.role === 'admin');
    return res.status(200).json({
      success: true,
      message: "Categories retrived successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error retrieving categories",
      error: error,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Category description is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Category image is required",
      });
    }

    const uploadDir = path.join("uploads", "categories");

    const filename = await fileUploadService.uploadFile(uploadDir, req.file);

    const imageUrl = `/uploads/categories/${filename}`;

    const newCategory = await categoryService.createCategory({
      name,
      description,
      image_url: imageUrl,
      url_prefix: name.toLowerCase().replace(/\s+/g, "-"),
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error adding category:", error.message);

    return res.status(500).json({
      success: false,
      message: "Error adding category",
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name && !description) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update. Provide at least name or description.",
      });
    }

    const updatedCategory = await categoryService.updateCategory(id, {
      ...(name && { name }),
      ...(description && { description }),
    });

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating category",
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await categoryService.deleteCategory(id);

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting category",
      error: error.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  const { categoryId } = req.params;
  const { tourType } = req.query;

  try {
    const packages = await categoryService.getCategoryById(
      categoryId,
      Number(tourType)
    );

    if (!packages) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: packages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving category by id",
      error: error.message,
    });
  }
};

const getCategoryByUrlPrefix = async (req, res) => {
  const { urlPrefix } = req.params;
  const { tourType } = req.query;

  try {
    const packages = await categoryService.getCategoryByUrlPrefix(
      urlPrefix,
      Number(tourType)
    );

    if (!packages) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: packages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving Category by urlprefix",
      error: error.message,
    });
  }
};

export default {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getCategoryByUrlPrefix,
};
