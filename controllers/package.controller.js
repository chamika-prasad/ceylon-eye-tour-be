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
      url_prefix: title.toLowerCase().replace(/\s+/g, "-"),
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

const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Package ID is required",
      });
    }

    // Extract fields (only those possibly included in request)
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
      removedCategoryIds,
      removedPlaceIds,
      removedImages,
      updateplaceIds,
    } = req.body;
    
    // Handle uploaded images if any
    let images = [];
    if (req.files && req.files.length > 0) {
      const uploadDir = path.join("uploads", "packages", id.toString());
      for (const file of req.files) {
        const filename = await fileUploadService.uploadFile(uploadDir, file);
        images.push(`/uploads/packages/${id}/${filename}`);
      }
    }

    // Parse JSON strings if any (since body might come as stringified arrays)
    const parseCategoryIds = categoryIds ? JSON.parse(categoryIds) : [];
    const parsePlaceIds = placeIds ? JSON.parse(placeIds) : [];
    const parseUpdateplaceIds = updateplaceIds
      ? JSON.parse(updateplaceIds)
      : [];
    const parseRemovedCategoryIds = removedCategoryIds
      ? JSON.parse(removedCategoryIds)
      : [];
    const parseRemovedPlaceIds = removedPlaceIds
      ? JSON.parse(removedPlaceIds)
      : [];
    const parseRemovedImages = removedImages ? JSON.parse(removedImages) : [];

    // Prepare update data (only changed fields)
    const updateData = {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(packageHighlights !== undefined && {
        package_highlights: packageHighlights,
      }),
      ...(price !== undefined && { price }),
      ...(tourType !== undefined && { tour_type: tourType }),
      ...(arrival !== undefined && { arrival_location: arrival }),
      ...(departure !== undefined && { departure_location: departure }),
      ...(arrivalDescription !== undefined && {
        arrival_description: arrivalDescription,
      }),
      ...(departureDescription !== undefined && {
        departure_description: departureDescription,
      }),
      ...(duration !== undefined && { duration }),
      ...(excludes !== undefined && { excludes }),
      ...(includes !== undefined && { includes }),
      ...(title && { url_prefix: title.toLowerCase().replace(/\s+/g, "-") }),
      ...(parseCategoryIds.length && { categoryIds: parseCategoryIds }),
      ...(parsePlaceIds.length && { placeIds: parsePlaceIds }),
      ...(parseUpdateplaceIds.length && {
        updateplaceIds: parseUpdateplaceIds,
      }),
      ...(images.length && { images }),
      ...(parseRemovedCategoryIds.length && {
        removedCategoryIds: parseRemovedCategoryIds,
      }),
      ...(parseRemovedPlaceIds.length && {
        removedPlaceIds: parseRemovedPlaceIds,
      }),
      ...(parseRemovedImages.length && { removedImages: parseRemovedImages }),
    };

    const updatedPackage = await packageService.updatePackage(updateData, id);

    return res.status(200).json({
      success: true,
      message: "Package updated successfully",
      data: updatedPackage,
    });
  } catch (error) {
    console.error("Error updating package:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating package",
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

const getPackageByUrlPrefix = async (req, res) => {
  try {
    const { urlPrefix } = req.params;
    const result = await packageService.getPackageByUrlPrefix(urlPrefix);
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

export default {
  getPackages,
  addPackage,
  getPackageById,
  getPackageByUrlPrefix,
  updatePackage,
};
