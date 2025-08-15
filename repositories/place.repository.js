import { Place, Hotel } from "../models/index.js";
import { Sequelize } from "sequelize";

const createPlace = async (data) => {
  try {
    return await Place.create(data);
  } catch (error) {
    throw new Error(`Error creating place: ${error.message}`);
  }
};

const getAllPlaces = async () => {
  try {
    return await Place.findAll();
  } catch (error) {
    throw new Error(`Error fetching places: ${error.message}`);
  }
};

const getPlaceById = async (id) => {
  try {
    return await Place.findByPk(id);
  } catch (error) {
    throw new Error(`Error fetching place by ID: ${error.message}`);
  }
};

const deletePlace = async (id) => {
  try {
    const deleted = await Place.destroy({ where: { id } });
    return deleted > 0;
  } catch (error) {
    throw new Error(`Error deleting place: ${error.message}`);
  }
};

const getAllPlacesWithHotelCount = async () => {
  try {
    const places = await Place.findAll({
      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("Hotels.id")), "hotelCount"],
        ],
      },
      include: [
        {
          model: Hotel,
          as: "Hotels",
          attributes: [], // No hotel fields, only counting
          required: false,
        },
      ],
      group: ["Place.id"],
      raw: true, // optional, gives plain objects
    });

    const filteredPlaces = places.filter(
      (place) => Number(place.hotelCount) > 0
    );

    return filteredPlaces;
  } catch (error) {
    throw new Error(`Error fetching places: ${error.message}`);
  }
};

const getPlaceByUrlPrefix = async (urlPrefix) => {
  try {
    return await Place.findOne({
      where: { url_prefix: urlPrefix },
      include: [
        {
          model: Hotel,
          as: "Hotels", // Must match the association alias
        },
      ],
    });
  } catch (error) {
    throw new Error(`Error fetching place by urlPrefix: ${error.message}`);
  }
};

export default {
  createPlace,
  getAllPlaces,
  getPlaceById,
  deletePlace,
  getAllPlacesWithHotelCount,
  getPlaceByUrlPrefix
};
