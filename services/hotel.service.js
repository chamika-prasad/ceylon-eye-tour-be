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
  return await hotelRepository.getAllHotels();
};

const getHotelsByPlaceId = async (placeId) => {
  return await hotelRepository.getHotelsByPlaceId(placeId);
};

const getHotelById = async (id) => {
  return await hotelRepository.getHotelById(id);
};

export default {
  createHotel,
  updateHotel,
  deleteHotel,
  getAllHotels,
  getHotelsByPlaceId,
  getHotelById,
};
