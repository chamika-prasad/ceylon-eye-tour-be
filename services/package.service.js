import packageRepository from "../repositories/package.repository.js";

const getPackages = async () => {
  try {
    const result = await packageRepository.getPackages();
    return result;
  } catch (error) {
    throw new Error(`Error in PackageService getPackages: ${error}`);
  }
};

const addPackage = async (data) => {
  try {
    return await packageRepository.addPackage(data);
  } catch (error) {
    throw new Error(`Error in addPackage service: ${error.message}`);
  }
};

const getPackageById = async (id) => {
  try {
    return await packageRepository.getPackageById(id);
  } catch (error) {
    throw new Error(`Error in getPackageById service: ${error.message}`);
  }
};

const getPackagesByCategoryId = async (categoryId) => {
  return await packageRepository.getPackagesByCategoryId(categoryId);
};

const getPackagesByTourType = async (tour_type_id) => {
  return await packageRepository.getPackagesByTourType(tour_type_id);
};

export default {
  getPackages,
  addPackage,
  getPackageById,
  getPackagesByCategoryId,
  getPackagesByTourType,
};
