import categoryRepository from "../repositories/category.repository.js";
// import packageRepository from "../repositories/package.repository.js";

const getCategories = async () => {
  try {
    const categories = await categoryRepository.getCategories();
    return categories;
  } catch (error) {
    throw new Error(`Error in CategoryService getCategories: ${error}`);
  }
};

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

// const getCategoriesByTourType = async (tour_type_id) => {
//   try {
//     const packages = await packageRepository.getPackagesByTourType(
//       tour_type_id
//     );
//     // Flatten and deduplicate categories
//     const allCategories = packages.flatMap((pkg) => pkg.Categories);
//     const uniqueMap = new Map();

//     for (const cat of allCategories) {
//       if (!uniqueMap.has(cat.id)) {
//         uniqueMap.set(cat.id, cat);
//       }
//     }

//     return Array.from(uniqueMap.values());
//   } catch (error) {
//     throw new Error(
//       `Error in CategoryService getCategoriesByTourType: ${error}`
//     );
//   }
// };

const getCategoriesWithPackageCount = async () => {
  return await categoryRepository.getCategoriesWithPackageCount();
};

export default {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  // getCategoriesByTourType,
  getCategoriesWithPackageCount,
};
