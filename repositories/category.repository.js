import {
  Category,
  Package,
  PackageCategory,
  PackageImage,
} from "../models/index.js";
import { Sequelize } from "sequelize";

const createCategory = async (data) => {
  try {
    const category = await Category.create(data);
    return category;
  } catch (error) {
    console.error("Error creating category:", error.message);
    throw new Error("Failed to create category");
  }
};

const updateCategory = async (id, data) => {
  try {
    const category = await Category.findByPk(id);
    if (!category) return false;

    await category.update(data);
    return category;
  } catch (error) {
    throw new Error(`Error in CategoryRepository updateCategory: ${error}`);
  }
};

const deleteCategory = async (id) => {
  try {
    const deleted = await Category.destroy({ where: { id } });
    if (!deleted) return false;
    return deleted;
  } catch (error) {
    throw new Error(`Error in CategoryRepository deleteCategory: ${error}`);
  }
};

const getCategories = async (tourType, isAdmin) => {
  const isTourTypeValid = tourType === 0 || tourType === 1;
  try {
    const categories = await Category.findAll({
      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("Packages.id")), "packageCount"],
        ],
      },
      include: [
        {
          association: "Packages",
          attributes: [], // Don't load full package data, only count
          through: { attributes: [] }, // Don't include join table fields
          where: isTourTypeValid
            ? {
              tour_type: tourType, // Filter by passed tourType
            }
            : undefined,
          required: false,
        },
      ],
      group: ["Category.id"],
    });

    const filteredCategories = categories.filter(
      (category) => Number(category.get("packageCount")) > 0
    );

    return isAdmin ? categories : filteredCategories;
  } catch (error) {
    throw new Error(
      "Error fetching categories with package count: " + error.message
    );
  }
};

const getCategoryById = async (categoryId, tourType) => {
  const isTourTypeValid = tourType === 0 || tourType === 1;
  try {
    const category = await Category.findByPk(categoryId, {
      include: {
        model: Package,
        as: "Packages",
        where: isTourTypeValid ? { tour_type: tourType } : undefined,
        through: { attributes: [] },
        include: {
          model: PackageImage,
          as: "Images",
        },
        required: false,
      },
    });

    if (!category) return null;

    return category;
  } catch (error) {
    throw new Error(
      "Failed to fetch category by category ID: " + error.message
    );
  }
};

const getCategoryByUrlPrefix = async (urlPrefix, tourType) => {
  const isTourTypeValid = tourType === 0 || tourType === 1;
  try {
    const category = await Category.findOne({
      where: { url_prefix: urlPrefix },
      include: {
        model: Package,
        as: "Packages",
        where: isTourTypeValid ? { tour_type: tourType } : undefined,
        through: { attributes: [] },
        include: {
          model: PackageImage,
          as: "Images",
        },
        required: false,
      },
    });

    if (!category) return null;

    return category;
  } catch (error) {
    throw new Error(
      "Failed to fetch packages by category ID: " + error.message
    );
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
