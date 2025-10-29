import { v4 as uuidv4 } from "uuid";
import path from "path";
import hotelService from "../services/hotel.service.js";
import fileUploadService from "../services/fileUpload.service.js";

const createHotel = async (req, res) => {
  try {
    const {
      name,
      placeId,
      typeId,
      description,
      facilities,
      roomsDetails,
      rating,
    } = req.body;

    if (
      !name ||
      !description ||
      !placeId ||
      !typeId ||
      !facilities ||
      !roomsDetails ||
      !rating
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, description, placeId, typeId, facilities, rooms_details and rating are required",
      });
    }
    const urlPrifix = name.toLowerCase().replace(/\s+/g, "-");
    const existingHotel = await hotelService.getHotelByPrefix(urlPrifix);

    if (existingHotel) {
      return res.status(400).json({
        success: false,
        message: "Hotel with the same name already exists",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Hotel images are required",
      });
    }

    const hotelId = uuidv4();

    const uploadDir = path.join("uploads", "hotels", hotelId.toString());
    const images = [];

    for (const file of req.files) {
      const filename = await fileUploadService.uploadFile(uploadDir, file);
      images.push(`/uploads/hotels/${hotelId}/${filename}`);
    }

    const newHotel = await hotelService.createHotel({
      id: hotelId,
      name,
      place_id: placeId,
      type_id: typeId,
      description,
      facilities,
      images: JSON.stringify(images) || "[]", // Ensure images is a JSON string
      rooms_details: JSON.stringify(roomsDetails) || "[]", // Ensure rooms_details is a JSON string
      rating: Number(rating) || 0,
      url_prefix: urlPrifix,
    });

    return res.status(201).json({
      success: true,
      message: "Hotel created successfully",
      data: newHotel,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating hotel",
      error: error.message,
    });
  }
};

const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      placeId,
      typeId,
      description,
      facilities,
      roomsDetails,
      rating,
      removeImages,
    } = req.body;

    if (
      !name &&
      !description &&
      !placeId &&
      !typeId &&
      !facilities &&
      !roomsDetails &&
      !rating &&
      !req.files
    ) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }

    const existingHotel = await hotelService.getHotelById(id);

    if (!existingHotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    var updatedImages;
    if (
      removeImages &&
      Array.isArray(JSON.parse(removeImages)) &&
      JSON.parse(removeImages).length > 0
    ) {
      const currentImages = Array.isArray(existingHotel.images)
        ? existingHotel.images
        : JSON.parse(existingHotel.images || "[]");
      updatedImages = currentImages.filter(
        (img) => !JSON.parse(removeImages).includes(img)
      );
    }

    var images = [];

    if (req.files && req.files.length > 0) {
      const uploadDir = path.join("uploads", "hotels", id);

      for (const file of req.files) {
        const filename = await fileUploadService.uploadFile(uploadDir, file);
        images.push(`/uploads/hotels/${id}/${filename}`);
      }
    }

    if (updatedImages && images) {
      updatedImages = [...updatedImages, ...images];
    } else if (images) {
      updatedImages = images;
    }

    const updateData = {
      ...(name && { name }),
      ...(placeId && { place_id: placeId }),
      ...(typeId && { type_id: typeId }),
      ...(description && { description }),
      ...(facilities && { facilities }),
      ...(roomsDetails && { roomsDetails }),
      ...(name && { url_prefix: name.toLowerCase().replace(/\s+/g, "-") }),
      ...(rating && { rating: Number(rating) }),
      ...(updatedImages && { images: JSON.stringify(updatedImages) }),
      ...(name && { url_prefix: name.toLowerCase().replace(/\s+/g, "-") }),
    };

    const updatedHotel = await hotelService.updateHotel(id, updateData);

    if (
      removeImages &&
      Array.isArray(JSON.parse(removeImages)) &&
      JSON.parse(removeImages).length > 0
    ) {
      for (const removeImage of JSON.parse(removeImages)) {
        await fileUploadService.removeFile(removeImage);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Hotel updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating hotel",
      error: error.message,
    });
  }
};

const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await hotelService.deleteHotel(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hotel deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting hotel",
      error: error.message,
    });
  }
};

const getAllHotels = async (req, res) => {
  try {
    const hotels = await hotelService.getAllHotels();
    return res.status(200).json({
      success: true,
      message: "Hotels retrieved successfully",
      data: hotels,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving hotels",
      error: error.message,
    });
  }
};

const getHotelsByPlaceId = async (req, res) => {
  try {
    const { placeId } = req.params;
    const hotels = await hotelService.getHotelsByPlaceId(placeId);

    if (!hotels.length) {
      return res.status(404).json({
        success: false,
        message: "No hotels found for this place",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hotels retrieved successfully",
      data: hotels,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving hotels by place ID",
      error: error.message,
    });
  }
};

const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await hotelService.getHotelById(id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hotel retrieved successfully",
      data: hotel,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving hotel by ID",
      error: error.message,
    });
  }
};

export default {
  createHotel,
  updateHotel,
  deleteHotel,
  getAllHotels,
  getHotelsByPlaceId,
  getHotelById,
};
