import categoryRepository from "../repositories/category.repository.js";

const createCategory = async (data) => {

  const newCategory = await categoryRepository.createCategory(data);
  return newCategory;
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

const getCategories = async (tourType, isAdmin) => {
  return await categoryRepository.getCategories(tourType, isAdmin);
};

const getCategoryById = async (categoryId, tourType) => {
  return await categoryRepository.getCategoryById(categoryId, tourType);
};

const getCategoryByUrlPrefix = async (urlPrefix, tourType) => {
  return await categoryRepository.getCategoryByUrlPrefix(urlPrefix, tourType);
};

export default {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  getCategoryByUrlPrefix,
};
