import {
  Package,
  Place,
  Activity,
  Category,
  PackageImage,
  PackagePlace,
  PlaceActivity,
} from "../models/index.js";
import sequelize from "../config/sequelize.js";

const getPackages = async () => {
  try {
    const packages = await Package.findAll({
      attributes: { exclude: ["created_at", "updated_at"] },
      include: [
        {
          model: Place,
          as: "Places", // Match the alias defined in the Package -> Place association
          attributes: { exclude: ["created_at", "updated_at"] },
          through: {
            attributes: [], // Exclude PackagePlace attributes from the result
          },
          include: [
            {
              model: Activity,
              as: "Activities", // Match the alias defined in Place -> Activity association
              attributes: { exclude: ["created_at", "updated_at"] }, // Exclude timestamps from Activity
              through: {
                attributes: [], // Exclude PlaceActivity attributes
              },
            },
          ],
        },
        {
          model: Category,
          as: "Categories", // Alias defined in association
          attributes: { exclude: ["created_at", "updated_at"] },
          through: {
            attributes: [], // Exclude PackageCategory attributes
          },
        },
        {
          model: PackageImage,
          as: "Images",
        },
      ],
    });

    return packages;
  } catch (error) {
    console.log(`Error in Get All Packages: ${error}`);

    throw new Error(`Error in Get All Packages: ${error}`);
  }
};

const getPackageById = async (id) => {
  try {
    const packageData = await Package.findByPk(id);

    if (!packageData) {
      return false;
    }

    const packagePlaces = await PackagePlace.findAll({
      where: { package_id: packageData.id },
    });

    const placeDetails = await Promise.all(
      packagePlaces.map(async (packagePlace) => {
        const packagPlaceObj = packagePlace.toJSON();
        delete packagPlaceObj.id;
        delete packagPlaceObj.package_id;
        delete packagPlaceObj.place_id;
        delete packagPlaceObj.created_at;

        const place = await Place.findByPk(packagePlace.place_id, {
          attributes: { exclude: ["created_at", "updated_at"] },
          include: [
            {
              model: Activity,
              as: "Activities",
              attributes: { exclude: ["created_at", "updated_at"] },
              through: {
                attributes: [],
              },
            },
          ],
        });

        const placeObj = place.toJSON();
        delete placeObj.id;
        delete placeObj.url_prefix;

        return { place: placeObj, packagePlace: packagPlaceObj };
      })
    );

    if (placeDetails.length > 0) {
      placeDetails.sort(
        (a, b) => a.packagePlace.sort_order - b.packagePlace.sort_order
      );
    }

    // Convert to plain object first, then delete properties
    const packageObj = packageData.toJSON();
    delete packageObj.created_at;
    delete packageObj.updated_at;

    const responseObj = {
      package: packageObj,
      places: placeDetails,
    };
    return responseObj;
  } catch (error) {
    console.log(`Error in Get Package: ${error}`);

    throw new Error(`Error in Get Package: ${error}`);
  }
};

const getPackageByUrlPrefix = async (urlPrefix) => {
  try {
    const packageData = await Package.findOne({
      where: { url_prefix: urlPrefix },
    });

    if (!packageData) {
      return false;
    }

    const packagePlaces = await PackagePlace.findAll({
      where: { package_id: packageData.id },
    });

    const placeDetails = await Promise.all(
      packagePlaces.map(async (packagePlace) => {
        const packagPlaceObj = packagePlace.toJSON();
        delete packagPlaceObj.id;
        delete packagPlaceObj.package_id;
        delete packagPlaceObj.place_id;
        delete packagPlaceObj.created_at;

        const place = await Place.findByPk(packagePlace.place_id, {
          attributes: { exclude: ["created_at", "updated_at"] },
          include: [
            {
              model: Activity,
              as: "Activities",
              attributes: { exclude: ["created_at", "updated_at"] },
              through: {
                attributes: [],
              },
            },
          ],
        });

        const placeObj = place.toJSON();
        delete placeObj.id;
        delete placeObj.url_prefix;

        return { place: placeObj, packagePlace: packagPlaceObj };
      })
    );

    if (placeDetails.length > 0) {
      placeDetails.sort(
        (a, b) => a.packagePlace.sort_order - b.packagePlace.sort_order
      );
    }

    // Convert to plain object first, then delete properties
    const packageObj = packageData.toJSON();
    delete packageObj.created_at;
    delete packageObj.updated_at;

    const responseObj = {
      package: packageObj,
      places: placeDetails,
    };
    return responseObj;
  } catch (error) {
    console.log(`Error in Get Package: ${error}`);

    throw new Error(`Error in Get Package: ${error}`);
  }
};

const addPackage = async (data) => {
  let transaction;
  try {
    // Start a transaction
    transaction = await sequelize.transaction();

    // Destructure the related IDs out of data
    const {
      categoryIds = [],
      placeIds = [],
      images = [],
      ...packageData
    } = data;

    // Create the package within the transaction
    const newPackage = await Package.create(packageData, { transaction });

    // Set categories if any
    if (categoryIds.length) {
      await newPackage.setCategories(categoryIds, { transaction });
    }

    // Set places if any
    if (placeIds.length) {
      // await newPackage.setPlaces(placeIds, { transaction });
      const records = placeIds.map((p) => ({
        package_id: newPackage.id,
        place_id: p.place_id,
        description: p.description || null,
        sort_order: Number(p.order) || 0,
        day_no: Number(p.day_no) || 1,
        events: p.events ? JSON.stringify(p.events) : null, // Ensure events is a JSON string
      }));

      await PackagePlace.bulkCreate(records, { transaction });
    }

    // Save images
    if (images.length) {
      const imageRecords = images.map((imagePath) => ({
        package_id: newPackage.id,
        image_url: imagePath, // ensure your PackageImage model has this column
      }));
      await PackageImage.bulkCreate(imageRecords, { transaction });
    }

    // Commit the transaction if all operations were successful
    await transaction.commit();

    // Reload with associations to return full data
    const result = await getPackageById(newPackage.id);
    return result;
  } catch (error) {
    console.log(error);

    // Rollback the transaction if any error occurs
    if (transaction) await transaction.rollback();
    throw new Error(`Error in addPackage repository: ${error.message}`);
  }
};

const updatePackageRating = async (id, data) => {
  let transaction;
  try {
    // Start a transaction
    transaction = await sequelize.transaction();

    // Destructure the related data
    const { rating, user_count } = data;

    // Find the package to update
    const existingPackage = await Package.findByPk(id, { transaction });
    if (!existingPackage) {
      throw new Error("Package not found");
    }

    // Update only the rating and user_count columns
    await existingPackage.update({ rating, user_count }, { transaction });

    // Commit the transaction
    await transaction.commit();

    // Reload with associations to return full data
    const result = await getPackageById(id);
    return result;
  } catch (error) {
    console.log(error);

    // Rollback the transaction if any error occurs
    if (transaction) await transaction.rollback();
    throw new Error(`Error in updatePackage repository: ${error.message}`);
  }
};

export default {
  getPackages,
  addPackage,
  getPackageById,
  getPackageByUrlPrefix,
  updatePackageRating,
};
