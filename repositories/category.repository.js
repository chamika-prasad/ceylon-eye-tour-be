import { Category, Package, PackageImage } from "../models/index.js";
import { Sequelize, Op } from "sequelize";

const createCategory = async (data) => {
  const category = await Category.create(data);
  return category;
};

const updateCategory = async (id, data) => {
  const category = await Category.findByPk(id);
  if (!category) return false;

  await category.update(data);
  return category;
};

const deleteCategory = async (id) => {
  const deleted = await Category.destroy({ where: { id } });
  if (!deleted) return false;
  return deleted;
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


const getCategoriesWithSearchAndPagination = async (
  page = 1,
  searchTerm = "",
  tourType = null,
  isAdmin = false,
  limit = 10
) => {
  const offset = (page - 1) * limit;
  const isTourTypeValid = tourType === 0 || tourType === 1;

  try {
    // Build where clause for category name search
    const whereClause = searchTerm
      ? {
          name: { [Op.like]: `%${searchTerm}%` },
        }
      : {};

    const { count, rows } = await Category.findAndCountAll({
      where: whereClause,
      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("Packages.id")), "packageCount"],
        ],
      },
      include: [
        {
          association: "Packages",
          attributes: [],
          through: { attributes: [] },
          where: isTourTypeValid
            ? {
                tour_type: tourType,
              }
            : undefined,
          required: false,
        },
      ],
      group: ["Category.id"],
      // limit: parseInt(limit),
      // offset: parseInt(offset),
      order: [["name", "ASC"]], // Order by category name
      subQuery: false,
    });

    // Filter categories with packageCount > 0 for non-admin users
    let filteredRows = rows;
    
    if (!isAdmin) {
      filteredRows = rows.filter(
        (category) => Number(category.get("packageCount")) > 0
      );
    }

    // Calculate filtered count for non-admin
    const finalCount = isAdmin ? count.length : filteredRows.length;

    return {
      categories: filteredRows,
      totalItems: finalCount,
      totalPages: Math.ceil(finalCount / limit),
      currentPage: parseInt(page),
    };
  } catch (error) {
    throw new Error(
      "Error fetching categories with pagination: " + error.message
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
  getCategoriesWithSearchAndPagination,
};
