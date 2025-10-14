import categoryRepository from "../repositories/category.repository.js";
import fileUploadService from "./fileUpload.service.js";

const createCategory = async (data) => {
  const newCategory = await categoryRepository.createCategory(data);
  return newCategory;
};

const updateCategory = async (id, data) => {
  //if new image have been added
  if (data.image_url) {
    const existCategory = await categoryRepository.getCategoryById(id, null);
    if (!existCategory) return false;

    var oldImagePath = existCategory.image_url;
  }

  const updatedCategory = await categoryRepository.updateCategory(id, data);

  if (oldImagePath) {
    await fileUploadService.removeFile(oldImagePath);
  }
  return updatedCategory;
};

const deleteCategory = async (id) => {
  const existCategory = await categoryRepository.getCategoryById(id, null);
  if (!existCategory) return false;

  var oldImagePath = existCategory.image_url;
  const deletedCategory = await categoryRepository.deleteCategory(id);

  if (oldImagePath) {
    await fileUploadService.removeFile(oldImagePath);
  }
  return deletedCategory;
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
