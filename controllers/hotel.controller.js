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
    const roomUploadDir = path.join(
      "uploads",
      "hotels",
      hotelId.toString(),
      "rooms"
    );
    const images = [];

    const hotelImages = req.files.filter((f) => f.fieldname === "images");

    for (const file of hotelImages) {
      const filename = await fileUploadService.uploadFile(uploadDir, file);
      images.push(`/uploads/hotels/${hotelId}/${filename}`);
    }

    var roomsDetailsRow = JSON.parse(roomsDetails);

    const roomsDetailsWithImages = await Promise.all(
      roomsDetailsRow.map(async (room) => {
        const file = req.files.find((f) => f.fieldname === `image_${room.id}`);

        let filename = null;
        if (file) {
          filename = await fileUploadService.uploadFile(roomUploadDir, file);
        }

        return {
          ...room,
          image: file ? `/uploads/hotels/${hotelId}/rooms/${filename}` : null,
        };
      })
    );

    const newHotel = await hotelService.createHotel({
      id: hotelId,
      name,
      place_id: placeId,
      type_id: typeId,
      description,
      facilities,
      images: JSON.stringify(images) || "[]", // Ensure images is a JSON string
      // rooms_details: JSON.stringify(roomsDetails) || "[]", // Ensure rooms_details is a JSON string
      rooms_details: JSON.stringify(roomsDetailsWithImages) || "[]",
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
      removeRoomImages,
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

    if (name) {
      var urlPrifix = name.toLowerCase().replace(/\s+/g, "-");
      const hotelWithSameName = await hotelService.getHotelByPrefix(urlPrifix);
      if (hotelWithSameName) {
        return res.status(409).json({
          success: false,
          message: "Another hotel with the same name already exists",
        });
      }
    }

    var updatedImages = Array.isArray(existingHotel.images)
      ? existingHotel.images
      : JSON.parse(existingHotel.images || "[]");
      
    if (
      removeImages &&
      Array.isArray(JSON.parse(removeImages)) &&
      JSON.parse(removeImages).length > 0
    ) {
      updatedImages = updatedImages.filter(
        (img) => !JSON.parse(removeImages).includes(img)
      );
    }

    const hotelImages = req.files.filter((f) => f.fieldname === "images");
    var images = [];

    if (req.files && hotelImages.length > 0) {
      const uploadDir = path.join("uploads", "hotels", id);

      for (const file of hotelImages) {
        const filename = await fileUploadService.uploadFile(uploadDir, file);
        images.push(`/uploads/hotels/${id}/${filename}`);
      }
    }

    if (images.length > 0) {
      updatedImages = [...updatedImages, ...images];
    }

    const roomUploadDir = path.join("uploads", "hotels", id, "rooms");

    if(roomsDetails){

    
    var roomsDetailsRow = JSON.parse(roomsDetails);

    var roomsDetailsWithImages = await Promise.all(
      roomsDetailsRow.map(async (room) => {
        if (room.image) {
          return room;
        }
        const file = req.files.find((f) => f.fieldname === `image_${room.id}`);

        let filename = null;
        if (file) {
          filename = await fileUploadService.uploadFile(roomUploadDir, file);
        }

        return {
          ...room,
          image: file ? `/uploads/hotels/${id}/rooms/${filename}` : null,
        };
      })
    );

  }

    const updateData = {
      ...(name && { name }),
      ...(placeId && { place_id: placeId }),
      ...(typeId && { type_id: typeId }),
      ...(description && { description }),
      ...(facilities && { facilities }),
      ...(roomsDetails && {
        rooms_details: JSON.stringify(roomsDetailsWithImages) || "[]",
      }),
      ...(name && { url_prefix: name.toLowerCase().replace(/\s+/g, "-") }),
      ...(rating && { rating: Number(rating) }),
      ...(updatedImages.length && { images: JSON.stringify(updatedImages) }),
      ...(name && { url_prefix: urlPrifix }),
    };

    const updatedHotel = await hotelService.updateHotel(id, updateData);

    if (!updatedHotel) {
      return res.status(400).json({
        success: false,
        message: "Hotel update failed",
      });
    }

    if (
      removeImages &&
      Array.isArray(JSON.parse(removeImages)) &&
      JSON.parse(removeImages).length > 0
    ) {
      for (const removeImage of JSON.parse(removeImages)) {
        await fileUploadService.removeFile(removeImage);
      }
    }

    if (
      removeRoomImages &&
      Array.isArray(JSON.parse(removeRoomImages)) &&
      JSON.parse(removeRoomImages).length > 0
    ) {
      for (const removeImage of JSON.parse(removeRoomImages)) {
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

const getHotelByPrefix = async (req, res) => {
  try {
    const { urlPrifix } = req.params;
    const hotel = await hotelService.getHotelByPrefix(urlPrifix);

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
      message: "Error retrieving hotel by urlPrifix",
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
  getHotelByPrefix,
};
