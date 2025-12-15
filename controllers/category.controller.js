import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import categoryService from "../services/category.service.js";
import fileUploadService from "../services/fileUpload.service.js";
import tokenService from "../services/token.service.js";
import dotenv from "dotenv";

dotenv.config();

const limit = process.env.PAGINATION_LIMIT || 10;

const getCategories = async (req, res) => {
  const { tourType } = req.query;

  try {
    // const categories = await categoryService.getCategories();
    const categories = await categoryService.getCategories(
      Number(tourType),
      req.user?.role === "admin"
    );
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

    const urlPrefix = name.toLowerCase().replace(/\s+/g, "-");
    const packages = await categoryService.getCategoryByUrlPrefix(
      urlPrefix,
      null
    );

    if (packages) {
      return res.status(400).json({
        success: false,
        message: "Category with the same name already exists",
      });
    }

    const uploadDir = path.join("uploads", "categories");

    const filename = await fileUploadService.uploadFile(uploadDir, req.file);

    const imageUrl = `/uploads/categories/${filename}`;

    const newCategory = await categoryService.createCategory({
      name,
      description,
      image_url: imageUrl,
      url_prefix: urlPrefix,
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

    if (!name && !description && !req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Nothing to update. Provide at least name or description or image.",
      });
    }

    if (name) {
      var urlPrefix = name.toLowerCase().replace(/\s+/g, "-");
      const packages = await categoryService.getCategoryByUrlPrefix(
        urlPrefix,
        null
      );

      if (packages) {
        return res.status(400).json({
          success: false,
          message: "Category with the same name already exists",
        });
      }
    }

    if (req.file) {
      const uploadDir = path.join("uploads", "categories");
      const filename = await fileUploadService.uploadFile(uploadDir, req.file);
      var imageUrl = `/uploads/categories/${filename}`;
    }

    const updatedCategory = await categoryService.updateCategory(id, {
      ...(name && { name }),
      ...(description && { description }),
      ...(urlPrefix && { url_prefix: urlPrefix }),
      ...(imageUrl && { image_url: imageUrl }),
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

const getCategoriesWithSearchAndPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const searchTerm = req.query.search || "";
    const tourType = req.query.tourType ? Number(req.query.tourType) : null;
    const isAdmin = req.user?.role === "admin";
    const pageLimit = parseInt(req.query.size) || limit;

    // Validation
    if (page < 1) {
      return res.status(400).json({
        success: false,
        message: "Page must be greater than 0",
      });
    }

    if (tourType !== null && tourType !== 0 && tourType !== 1) {
      return res.status(400).json({
        success: false,
        message: "Tour type must be 0 or 1",
      });
    }

    const result = await categoryService.getCategoriesWithSearchAndPagination(
      page,
      searchTerm,
      tourType,
      isAdmin,
      pageLimit
    );

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: result.categories,
      pagination: {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error retrieving categories",
    });
  }
};

const getCategoryByUrlPrefixWithSearchAndPagination = async (req, res) => {
  const { urlPrefix } = req.params;
  const { tourType } = req.query;
  const page = parseInt(req.query.page) || 1;
  const searchTerm = req.query.search || "";
  const pageLimit = parseInt(req.query.size) || limit;

  try {
    const category =
      await categoryService.getCategoryByUrlPrefixWithSearchAndPagination(
        urlPrefix,
        Number(tourType),
        searchTerm,
        page,
        pageLimit
      );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: category.category,
      pagination: {
        currentPage: category.currentPage,
        totalPages: category.totalPages,
        totalItems: category.totalItems,
      },
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
  getCategoriesWithSearchAndPagination,
  getCategoryByUrlPrefixWithSearchAndPagination,
};
