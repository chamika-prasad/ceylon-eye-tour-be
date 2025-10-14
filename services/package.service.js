import packageRepository from "../repositories/package.repository.js";
import fileUploadService from "./fileUpload.service.js";

const getPackages = async () => {
  try {
    const result = await packageRepository.getPackages();
    return result;
  } catch (error) {
    throw new Error(`Error in PackageService getPackages: ${error}`);
  }
};

const addPackage = async (data) => {
  return await packageRepository.addPackage(data);
};

const updatePackage = async (data, id) => {
  const updatedPackage = await packageRepository.updatePackage(data, id);
  if (!updatedPackage) return false;
  
  if(updatePackage.imagesToDelete > 0){
        for (const img of imagesToDelete) {
      await fileUploadService.removeFile(img.image_url);
      
    }
  }
};

const getPackageById = async (id) => {
  try {
    return await packageRepository.getPackageById(id);
  } catch (error) {
    throw new Error(`Error in getPackageById service: ${error.message}`);
  }
};

const getPackageByUrlPrefix = async (urlPrefix) => {
  try {
    return await packageRepository.getPackageByUrlPrefix(urlPrefix);
  } catch (error) {
    throw new Error(`Error in getPackageByUrlPrefix service: ${error.message}`);
  }
};

const updatePackageRating = async (id, data) => {
  try {
    return await packageRepository.updatePackageRating(id, data);
  } catch (error) {
    throw new Error(`Error in updatePackageRating service: ${error.message}`);
  }
};

export default {
  getPackages,
  addPackage,
  getPackageById,
  getPackageByUrlPrefix,
  updatePackageRating,
  updatePackage
};
