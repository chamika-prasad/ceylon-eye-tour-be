import customizePackagePlaceRepository from "../repositories/customizePackagePlace.repository.js";

const updateCustomizePackagePlace = async (id, data) => {
  const { sortOrder, dayNo, description } = data;

  const updatedRows =
    await customizePackagePlaceRepository.updateCustomizePackagePlaceFields(
      id,
      {
        sortOrder,
        dayNo,
        description,
      }
    );

  if (updatedRows === 0) {
    throw new Error("CustomizePackagePlace not found or no changes applied");
  }

  return { id, sortOrder, dayNo, description };
};

const getCustomizePackagePlaceById = async (id) => {
  const customizePackagePlace =
    await customizePackagePlaceRepository.getCustomizePackagePlaceById(id);
  return customizePackagePlace;
};

const getCustomizePackagePlaceByPackageIdAndSortOrder = async (
  packageId,
  sortOrder
) => {
  const customizePackagePlace =
    await customizePackagePlaceRepository.getCustomizePackagePlaceByPackageIdAndSortOrder(
      packageId,
      sortOrder
    );
  return customizePackagePlace;
};

export default {
  updateCustomizePackagePlace,
  getCustomizePackagePlaceById,
  getCustomizePackagePlaceByPackageIdAndSortOrder,
};
