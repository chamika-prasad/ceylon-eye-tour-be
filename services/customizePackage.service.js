import customizePackageRepository from "../repositories/customizePackage.repository.js";

const createCustomizePackage = async (userId, places) => {
  const customizePackage =
    await customizePackageRepository.createCustomizePackage(userId, places);
  return customizePackage;
};

const getAllCustomizePackages = async () => {
  const customizePackage =
    await customizePackageRepository.getAllCustomizePackages();
  return customizePackage;
};

const getAllCustomizePackagesByUserId = async (userId) => {
  const customizePackage =
    await customizePackageRepository.getAllCustomizePackagesByUserId(userId);
  return customizePackage;
};

const setIsApproved = async (id, isApproved) => {
  const updatedRows = await customizePackageRepository.updateIsApproved(
    id,
    isApproved
  );
  if (updatedRows === 0) {
    throw new Error("Customize Package not found or no changes applied");
  }
  return { id, is_approved: isApproved };
};

const updateMessage = async (id, message) => {
  const updatedRows = await customizePackageRepository.updateMessage(
    id,
    message
  );
  if (updatedRows === 0) {
    throw new Error("Customize Package not found or no changes applied");
  }
  return { id, message: message };
};

const updatePrice = async (id, price) => {
  const updatedRows = await customizePackageRepository.updatePrice(id, price);
  if (updatedRows === 0) {
    throw new Error("Customize Package not found or no changes applied");
  }
  return { id, price: price };
};

const setRequiredDayCount = async (id, dayCount) => {
  const updatedRows = await customizePackageRepository.updateRequiredDayCount(
    id,
    dayCount
  );
  if (updatedRows === 0) {
    throw new Error("Customize Package not found or no changes applied");
  }
  return { id, required_day_count: dayCount };
};

const getCustomizePackageById = async (id) => {
  const customizePackage =
    await customizePackageRepository.getCustomizePackageById(id);
  return customizePackage;
};

export default {
  createCustomizePackage,
  getAllCustomizePackages,
  getAllCustomizePackagesByUserId,
  setIsApproved,
  setRequiredDayCount,
  getCustomizePackageById,
  updateMessage,
  updatePrice,
};
