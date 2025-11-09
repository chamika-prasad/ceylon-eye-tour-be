import packageRepository from "../repositories/package.repository.js";
import fileUploadService from "./fileUpload.service.js";

const getPackages = async () => {
  const result = await packageRepository.getPackages();
  return result;
};

const addPackage = async (data) => {
  return await packageRepository.addPackage(data);
};

const updatePackage = async (data, id) => {
  const updatedPackage = await packageRepository.updatePackage(data, id);
  if (!updatedPackage) return false;

  if (updatePackage.imagesToDelete > 0) {
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
  return await packageRepository.updatePackageRating(id, data);
};

const deletePackage = async (id) => {
  console.log(id);

  const imagesToDelete = await packageRepository.getImagesByPackageId(id);
  const deleted = await packageRepository.deletePackage(id);

  if (imagesToDelete.length > 0) {
    for (const img of imagesToDelete) {
      await fileUploadService.removeFile(img.image_url);
    }
  }
  return deleted;
};

export default {
  getPackages,
  addPackage,
  getPackageById,
  getPackageByUrlPrefix,
  updatePackageRating,
  updatePackage,
  deletePackage,
};
