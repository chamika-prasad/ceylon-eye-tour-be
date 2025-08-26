import sequelize from "../config/sequelize.js";
import { CustomizePackagePlace } from "../models/index.js";

const updateCustomizePackagePlaceFields = async (
  id,
  { sortOrder, dayNo, description }
) => {
  const [updatedRows] = await CustomizePackagePlace.update(
    { sort_order: sortOrder, day_no: dayNo, description },
    { where: { id } }
  );

  return updatedRows; // Number of rows updated
};

const getCustomizePackagePlaceById = async (id) => {
  const customizePackagePlace = await CustomizePackagePlace.findByPk(id);

  return customizePackagePlace;
};

const getCustomizePackagePlaceByPackageIdAndSortOrder = async (
  packageId,
  sortOrder
) => {
  const customizePackagePlace = await CustomizePackagePlace.findOne({
    where: { customize_package_id: packageId, sort_order: sortOrder },
  });

  return customizePackagePlace;
};

export default {
  updateCustomizePackagePlaceFields,
  getCustomizePackagePlaceById,
  getCustomizePackagePlaceByPackageIdAndSortOrder
};
