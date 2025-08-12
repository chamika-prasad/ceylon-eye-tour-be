import { v4 as uuidv4 } from "uuid";
import path from "path";
import packageService from "../services/package.service.js";
import fileUploadService from "../services/fileUpload.service.js";

const getPackages = async (req, res) => {
  try {
    const packages = await packageService.getPackages();
    return res.status(200).json({
      success: true,
      message: "Packages retrived successfully",
      data: packages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving Packages",
      error: error,
    });
  }
};

const addPackage = async (req, res) => {
  try {
    const {
      title,
      description,
      packageHighlights,
      price,
      categoryIds,
      placeIds,
      tourType,
      arrival,
      departure,
      arrivalDescription,
      departureDescription,
      duration,
      excludes,
      includes,
    } = req.body;

    if (!title || !price || !description || !packageHighlights) {
      return res.status(400).json({
        success: false,
        message: "Title,description,package highlights and price are required",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Package images are required",
      });
    }

    const packageId = uuidv4();

    // Prepare upload directory: uploads/packages/{packageId}
    const uploadDir = path.join("uploads", "packages", packageId.toString());
    const images = [];

    for (const file of req.files) {
      const filename = await fileUploadService.uploadFile(uploadDir, file);
      images.push(`/uploads/packages/${packageId}/${filename}`);
    }

    const parseCategoryIds = JSON.parse(categoryIds || "[]");
    const parsePlaceIds = JSON.parse(placeIds || "[]");

    const newPackage = await packageService.addPackage({
      id: packageId,
      title,
      description,
      package_highlights: packageHighlights,
      price,
      tour_type: tourType,
      categoryIds: parseCategoryIds, // array of category UUID strings
      placeIds: parsePlaceIds, // array of place UUID strings
      images,
      arrival_location: arrival,
      departure_location: departure,
      arrival_description: arrivalDescription,
      departure_description: departureDescription,
      duration,
      excludes: excludes,
      includes: includes,
    });

    return res.status(201).json({
      success: true,
      message: "Package created successfully",
      data: newPackage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating package",
      error: error.message,
    });
  }
};

const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await packageService.getPackageById(id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Package retrived successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retriving package",
      error: error.message,
    });
  }
};

const getPackagesByCategoryId = async (req, res) => {
  const { categoryId } = req.params;
  const { tourType } = req.query;

  try {
    const packages = await packageService.getPackagesByCategoryId(categoryId,Number(tourType));

    if (!packages) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Packages retrieved successfully",
      data: packages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving packages by category",
      error: error.message,
    });
  }
};

export default {
  getPackages,
  addPackage,
  getPackageById,
  getPackagesByCategoryId,
};
