import { Hotel, Place } from "../models/index.js";

const createHotel = async (data) => {
  try {
    return await Hotel.create(data);
  } catch (error) {
    throw new Error(`Error creating hotel: ${error.message}`);
  }
};

const updateHotel = async (id, data) => {
  try {
    const hotel = await Hotel.findByPk(id);
    if (!hotel) return null;
    await hotel.update(data);
    return hotel;
  } catch (error) {
    throw new Error(`Error updating hotel: ${error.message}`);
  }
};

const deleteHotel = async (id) => {
  try {
    const deleted = await Hotel.destroy({ where: { id } });
    return deleted > 0;
  } catch (error) {
    throw new Error(`Error deleting hotel: ${error.message}`);
  }
};

const getAllHotels = async () => {
  try {
    return await Hotel.findAll({
      include: [
        {
          model: Place,
          as: "Place",
          attributes: ["id", "name", "url_prefix"],
        },
      ],
    });
  } catch (error) {
    throw new Error(`Error fetching hotels: ${error.message}`);
  }
};

const getHotelsByPlaceId = async (placeId) => {
  try {
    return await Hotel.findAll({
      where: { place_id: placeId },
      include: [
        {
          model: Place,
          as: "Place",
          attributes: ["id", "name"],
        },
      ],
    });
  } catch (error) {
    throw new Error(`Error fetching hotels by place ID: ${error.message}`);
  }
};

const getHotelById = async (id) => {
  try {
    return await Hotel.findByPk(id, {
      include: [
        {
          model: Place,
          as: "Place",
          attributes: ["id", "name"],
        },
      ],
    });
  } catch (error) {
    throw new Error(`Error fetching hotel by ID: ${error.message}`);
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
