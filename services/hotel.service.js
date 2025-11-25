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
      description: hotel.description,
      facilities: hotel.facilities,
      images: hotel.images,
      rooms_details: safeParse(hotel.rooms_details),
    };
  });

  return formattedHotels;
};

const getHotelsByPlaceId = async (placeId) => {
  const hotels = await hotelRepository.getHotelsByPlaceId(placeId);
   const formattedHotels = hotels.map((hotel) => {
    return {
      ...hotel.dataValues,
      description: hotel.description,
      facilities: hotel.facilities,
      images: hotel.images,
      rooms_details: safeParse(hotel.rooms_details),
    };
  });

  return formattedHotels;
};

const getHotelById = async (id) => {
  const hotel = await hotelRepository.getHotelById(id);
  const formattedHotel = {
    ...hotel.dataValues,
    description: hotel.description,
    facilities: hotel.facilities,
    images: hotel.images,
    rooms_details: safeParse(hotel.rooms_details),
  };
  return formattedHotel;
};

const getHotelByPrefix = async (prefix) => {
  const hotel = await hotelRepository.getHotelByPrefix(prefix);
  const formattedHotel = {
    ...hotel.dataValues,
    description: hotel.description,
    facilities: hotel.facilities,
    images: hotel.images,
    rooms_details: safeParse(hotel.rooms_details),
  };
  return formattedHotel;
};

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
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
