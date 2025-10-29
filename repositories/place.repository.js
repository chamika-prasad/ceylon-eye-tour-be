import { Place, Hotel } from "../models/index.js";
import { Sequelize } from "sequelize";

const createPlace = async (data) => {
  return await Place.create(data);
};

const updatePlace = async (id, data) => {
  return await Place.update(data, {
    where: { id },
  });
};

const getAllPlaces = async () => {
  return await Place.findAll();
};

const getPlaceById = async (id) => {
  return await Place.findByPk(id);
};

const deletePlace = async (id) => {
  const deleted = await Place.destroy({ where: { id } });
  return deleted > 0;
};

const getAllPlacesWithHotelCount = async () => {
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

  const filteredPlaces = places.filter((place) => Number(place.hotelCount) > 0);

  return filteredPlaces;
};

const getPlaceByUrlPrefix = async (urlPrefix) => {
  return await Place.findOne({
    where: { url_prefix: urlPrefix },
    include: [
      {
        model: Hotel,
        as: "Hotels", // Must match the association alias
      },
    ],
  });
};

export default {
  createPlace,
  updatePlace,
  getAllPlaces,
  getPlaceById,
  deletePlace,
  getAllPlacesWithHotelCount,
  getPlaceByUrlPrefix,
};
