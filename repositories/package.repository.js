import {
  Package,
  Place,
  Activity,
  Category,
  PackageImage,
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
    const selectedPackage = await Package.findByPk(id, {
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
      ],
    });
    if (!selectedPackage) {
      return false;
    }
    return selectedPackage;
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
      await newPackage.setPlaces(placeIds, { transaction });
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
    // Rollback the transaction if any error occurs
    if (transaction) await transaction.rollback();
    throw new Error(`Error in addPackage repository: ${error.message}`);
  }
};

const getPackagesByTourType = async (tour_type_id) => {
  try {
    const packages = await Package.findAll({
      where: { tour_type_id },
      include: [
        {
          model: PackageImage,
          as: "Images",
        },
      ],
    });

    return packages;
  } catch (error) {
    throw new Error(`Error in getPackagessByTourType: ${error}`);
  }
};

const getPackagesByCategoryId = async (categoryId) => {
  try {
    const category = await Category.findByPk(categoryId, {
      include: {
        model: Package,
        as: "Packages",
        through: { attributes: [] },
        include: {
          model: PackageImage,
          as: "Images",
        },
      },
    });

    if (!category) return null;

    return category;
  } catch (error) {
    throw new Error(
      "Failed to fetch packages by category ID: " + error.message
    );
  }
};

export default {
  getPackages,
  addPackage,
  getPackageById,
  getPackagesByTourType,
  getPackagesByCategoryId,
};
