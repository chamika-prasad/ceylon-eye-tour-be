import { Category, Package, PackageCategory } from "../models/index.js";
import { Sequelize } from "sequelize";

const getCategories = async () => {
  try {
    const categories = await Category.findAll({
      attributes: ["id", "name", "description", "image_url"],
    });
    return categories;
  } catch (error) {
    throw new Error(`Error in Get All Categories: ${error}`);
  }
};

const createCategory = async ({ name, description, image_url }) => {
  try {
    const category = await Category.create({
      // id: uuidv4(),
      name,
      description,
      image_url,
    });
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

const getCategoriesWithPackageCount = async () => {
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
        },
      ],
      group: ["Category.id"],
    });

    return categories;
  } catch (error) {
    throw new Error(
      "Error fetching categories with package count: " + error.message
    );
  }
};

export default {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesWithPackageCount,
};
