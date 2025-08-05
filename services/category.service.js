import categoryRepository from "../repositories/category.repository.js";

const createCategory = async ({ name, description, image_url }) => {
  try {
    const newCategory = await categoryRepository.createCategory({
      name,
      description,
      image_url,
    });
    return newCategory;
  } catch (error) {
    throw new Error(`Error in CategoryService createCategory: ${error}`);
  }
};

const updateCategory = async (id, data) => {
  try {
    return await categoryRepository.updateCategory(id, data);
  } catch (error) {
    throw new Error(`Error in CategoryService updateCategory: ${error}`);
  }
};

const deleteCategory = async (id) => {
  try {
    return await categoryRepository.deleteCategory(id);
  } catch (error) {
    throw new Error(`Error in CategoryService deleteCategory: ${error}`);
  }
};

const getCategories = async (tourType) => {
  return await categoryRepository.getCategories(tourType);
};

export default {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
};
