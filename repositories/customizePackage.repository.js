import sequelize from "../config/sequelize.js";
import {
  CustomizePackage,
  CustomizePackagePlace,
  CustomizePackagePlaceActivity,
  Place,
  Activity,
  User,
} from "../models/index.js";

const createCustomizePackage = async (userId, places = []) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();
    const newPackage = await CustomizePackage.create(
      { user_id: userId },
      { transaction }
    );

    const placeRecords = await Promise.all(
      places.map(async (place) => {
        const packagePlace = await CustomizePackagePlace.create(
          { customize_package_id: newPackage.id, place_id: place.placeId },
          { transaction }
        );

        // If activities exist, insert them
        if (
          place.activityIds &&
          Array.isArray(place.activityIds) &&
          place.activityIds.length > 0
        ) {
          const activities = place.activityIds.map((activityId) => ({
            customize_package_place_id: packagePlace.id,
            activity_id: activityId,
          }));

          await CustomizePackagePlaceActivity.bulkCreate(activities, {
            transaction,
          });
        }

        return packagePlace;
      })
    );

    // Commit the transaction if all operations were successful
    await transaction.commit();

    return newPackage;
  } catch (error) {
    console.log(error);
    // Rollback the transaction if any error occurs
    if (transaction) await transaction.rollback();
    throw new Error(
      `Error in add customize Package repository: ${error.message}`
    );
  }
};

// const updateCustomizePackage = async (packageId, data) => {
//   const transaction = await sequelize.transaction();
//   const existingPackage = await CustomizePackage.findByPk(packageId, {
//     transaction,
//   });

//   if (!existingPackage) throw new Error("Package not found");

//   try {
//     const { updatePlaces = [], places = [] } = data;

//     // First, delete existing places and their activities
//     if (updatePlaces.length > 0) {
//       await Promise.all(
//         updatePlaces.map(async (place) => {
//           if (place.remove) {
//             // Delete associated activities first
//             await CustomizePackagePlaceActivity.destroy({
//               where: { customize_package_place_id: place.id },
//               transaction,
//             });
//             // Then delete the place
//             await CustomizePackagePlace.destroy({
//               where: { id: place.id },
//               transaction,
//             });
//           }

//           // If there are activities to remove
//           if (place.removedActivityIds) {
//             await Promise.all(
//               place.removedActivityIds.map((aId) =>
//                 CustomizePackagePlaceActivity.destroy({
//                   where: { id: aId },
//                   transaction,
//                 })
//               )
//             );
//           }

//           // If activities exist, insert them
//           if (
//             place.activityIds &&
//             Array.isArray(place.activityIds) &&
//             place.activityIds.length > 0
//           ) {
//             const activities = place.activityIds.map((activityId) => ({
//               customize_package_place_id: place.id,
//               activity_id: activityId,
//             }));

//             await CustomizePackagePlaceActivity.bulkCreate(activities, {
//               transaction,
//             });
//           }
//         })
//       );
//     }

//     //Add new places if any
//     if (places.length > 0) {
//       await Promise.all(
//         places.map(async (place) => {
//           const packagePlace = await CustomizePackagePlace.create(
//             { customize_package_id: packageId, place_id: place.placeId },
//             { transaction }
//           );

//           // If activities exist, insert them
//           if (
//             place.activityIds &&
//             Array.isArray(place.activityIds) &&
//             place.activityIds.length > 0
//           ) {
//             const activities = place.activityIds.map((activityId) => ({
//               customize_package_place_id: packagePlace.id,
//               activity_id: activityId,
//             }));

//             await CustomizePackagePlaceActivity.bulkCreate(activities, {
//               transaction,
//             });
//           }
//         })
//       );
//     }

//     // Commit the transaction if all operations were successful
//     await transaction.commit();

//     return true;
//   } catch (error) {
//     console.log(error);
//     // Rollback the transaction if any error occurs
//     if (transaction) await transaction.rollback();
//     throw new Error(`Error in add customize Package update: ${error.message}`);
//   }
// };

const updateCustomizePackage = async (packageId, data) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    const existingPackage = await CustomizePackage.findByPk(packageId, { transaction });
    if (!existingPackage) return false;

    const { updatePlaces , places } = data;

    // Handle existing places (update/remove)
    if (updatePlaces.length > 0) {
      await Promise.all(
        updatePlaces.map(async (place) => {
          // Remove entire place with its activities
          if (place.remove) {
            await CustomizePackagePlaceActivity.destroy({
              where: { customize_package_place_id: place.id },
              transaction,
            });
            await CustomizePackagePlace.destroy({
              where: { id: place.id },
              transaction,
            });
            return;
          }

          // Remove specific activities
          if (place.removedActivityIds && place.removedActivityIds.length > 0) {
            await Promise.all(
              place.removedActivityIds.map((aId) =>
                CustomizePackagePlaceActivity.destroy({
                  where: { id: aId },
                  transaction,
                })
              )
            );
          }

          // Add new activities
          if (place.activityIds && place.activityIds.length > 0) {
            const activities = place.activityIds.map((activityId) => ({
              customize_package_place_id: place.id,
              activity_id: activityId,
            }));

            await CustomizePackagePlaceActivity.bulkCreate(activities, {
              transaction,
            });
          }
        })
      );
    }

    // Add new places
    if (places.length > 0) {
      await Promise.all(
        places.map(async (place) => {
          const packagePlace = await CustomizePackagePlace.create(
            { customize_package_id: packageId, place_id: place.placeId },
            { transaction }
          );

          if (place.activityIds && place.activityIds.length > 0) {
            const activities = place.activityIds.map((activityId) => ({
              customize_package_place_id: packagePlace.id,
              activity_id: activityId,
            }));

            await CustomizePackagePlaceActivity.bulkCreate(activities, {
              transaction,
            });
          }
        })
      );
    }

    await transaction.commit();
    return true;
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error(error);
    throw new Error(`Error updating customize package: ${error.message}`);
  }
};

const getAllCustomizePackages = async () => {
  return await CustomizePackage.findAll({
    include: [
      {
        model: User,
        as: "User",
        attributes: ["id", "name", "country"],
      },
      {
        model: CustomizePackagePlace,
        as: "CustomizePackagePlaces",
        attributes: ["id", "place_id", "sort_order", "day_no", "description"],
        include: [
          {
            model: Place,
            as: "Place",
            attributes: ["id", "name"], // Select only what you need
          },
          {
            model: Activity,
            as: "Activities",
            attributes: ["id", "name"], // Activity details
            through: { attributes: ["id"] }, // Hide join table columns
          },
        ],
      },
    ],
  });
};

const getAllCustomizePackagesByUserId = async (userId) => {
  return await CustomizePackage.findAll({
    where: { user_id: userId },
    include: [
      {
        model: CustomizePackagePlace,
        as: "CustomizePackagePlaces",
        include: [
          {
            model: Place,
            as: "Place",
            attributes: ["id", "name", "image_url"], // Select only what you need
          },
          {
            model: Activity,
            as: "Activities",
            attributes: ["id", "name"], // Activity details
            through: { attributes: [] }, // Hide join table columns
          },
        ],
      },
    ],
  });
};

const updateIsApproved = async (id, isApproved) => {
  const [updatedRows] = await CustomizePackage.update(
    { is_approved: isApproved },
    { where: { id } }
  );
  return updatedRows; // number of updated rows
};

const updateMessage = async (id, message) => {
  const [updatedRows] = await CustomizePackage.update(
    { message: message },
    { where: { id } }
  );
  return updatedRows; // number of updated rows
};

const updatePrice = async (id, price) => {
  const [updatedRows] = await CustomizePackage.update(
    { price: price },
    { where: { id } }
  );
  return updatedRows; // number of updated rows
};

const updateRequiredDayCount = async (id, dayCount) => {
  const [updatedRows] = await CustomizePackage.update(
    { required_day_count: dayCount },
    { where: { id } }
  );
  return updatedRows;
};

const getCustomizePackageById = async (id) => {
  const customizePackage = await CustomizePackage.findOne({
    where: { id },
    include: [
      {
        model: CustomizePackagePlace,
        as: "CustomizePackagePlaces",
        include: [
          {
            model: Place,
            as: "Place",
            attributes: ["id", "name"], // Select only what you need
          },
          {
            model: Activity,
            as: "Activities",
            attributes: ["id", "name"], // Activity details
            through: { attributes: [] }, // Hide join table columns
          },
        ],
      },
    ],
  });

  return customizePackage;
};

export default {
  createCustomizePackage,
  updateCustomizePackage,
  getAllCustomizePackages,
  getAllCustomizePackagesByUserId,
  updateIsApproved,
  updateRequiredDayCount,
  getCustomizePackageById,
  updateMessage,
  updatePrice,
};
