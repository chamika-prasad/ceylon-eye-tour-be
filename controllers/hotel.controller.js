import { v4 as uuidv4 } from "uuid";
import path from "path";
import hotelService from "../services/hotel.service.js";
import fileUploadService from "../services/fileUpload.service.js";

const createHotel = async (req, res) => {
  try {
    const { name, place_id, description, facilities, rooms_details, rating } =
      req.body;

    if (
      !name ||
      !description ||
      !place_id ||
      !facilities ||
      !rooms_details ||
      !rating
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, description, place_id, facilities, rooms_details and rating are required",
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
      name,
      place_id,
      description,
      facilities,
      images:JSON.stringify(images) || "[]", // Ensure images is a JSON string
      rooms_details,
      rating: Number(rating) || 0,
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
    const data = req.body;

    if (!Object.keys(data).length) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }

    const updatedHotel = await hotelService.updateHotel(id, data);

    if (!updatedHotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hotel updated successfully",
      data: updatedHotel,
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
