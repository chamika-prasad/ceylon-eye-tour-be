import hotelRepository from "../repositories/hotel.repository.js";

const createHotel = async (data) => {
  return await hotelRepository.createHotel(data);
};

const updateHotel = async (id, data) => {
  return await hotelRepository.updateHotel(id, data);
};

const deleteHotel = async (id) => {
  return await hotelRepository.deleteHotel(id);
};

const getAllHotels = async () => {
  const hotels = await hotelRepository.getAllHotels();
  // Convert rooms_details into array
  const formattedHotels = hotels.map((hotel) => {
    return {
      ...hotel.dataValues,
      rooms_details: JSON.parse(hotel.rooms_details || "[]"),
    };
  });

  return formattedHotels;
};

const getHotelsByPlaceId = async (placeId) => {
  return await hotelRepository.getHotelsByPlaceId(placeId);
};

const getHotelById = async (id) => {
  return await hotelRepository.getHotelById(id);
};

const getHotelByPrefix = async (prefix) => {
  return await hotelRepository.getHotelByPrefix(prefix);
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
