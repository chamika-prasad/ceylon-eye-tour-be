import { Place, Hotel } from "../models/index.js";
import { Sequelize, Op } from "sequelize";

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

const getAllPlacesWithPagination = async (
  page = 1,
  pageSize = 10,
  searchTerm = ""
) => {
  const offset = (page - 1) * pageSize;

  // Build where clause for searching place name
  const whereClause = searchTerm
    ? {
        name: { [Op.like]: `%${searchTerm}%` },
      }
    : {};

  try {
    const { count, rows } = await Place.findAndCountAll({
      where: whereClause,
      limit: parseInt(pageSize),
      offset: parseInt(offset),
      order: [["name", "ASC"]],
    });

    return {
      places: rows,
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: parseInt(page),
      pageSize: parseInt(pageSize),
    };
  } catch (error) {
    throw new Error(`Error fetching places: ${error.message}`);
  }
};

const getAllPlacesWithHotelCountAndPagination = async (
  page = 1,
  pageSize = 10,
  searchTerm = ""
) => {
  const offset = (page - 1) * pageSize;

  // Build where clause for searching place name
  const whereClause = searchTerm
    ? {
        name: { [Op.like]: `%${searchTerm}%` },
      }
    : {};

  try {
    // First, get total count of filtered places with hotels
    const allPlaces = await Place.findAll({
      where: whereClause,
      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("Hotels.id")), "hotelCount"],
        ],
      },
      include: [
        {
          model: Hotel,
          as: "Hotels",
          attributes: [],
          required: false,
        },
      ],
      group: ["Place.id"],
      raw: true,
    });

    // Filter places with hotelCount > 0
    const filteredPlaces = allPlaces.filter(
      (place) => Number(place.hotelCount) > 0
    );

    // Apply pagination to filtered results
    const paginatedPlaces = filteredPlaces.slice(offset, offset + pageSize);

    return {
      places: paginatedPlaces,
      totalItems: filteredPlaces.length,
      totalPages: Math.ceil(filteredPlaces.length / pageSize),
      currentPage: parseInt(page),
      pageSize: parseInt(pageSize),
    };
  } catch (error) {
    throw new Error(`Error fetching places with hotel count: ${error.message}`);
  }
};

export default {
  createPlace,
  updatePlace,
  getAllPlaces,
  getPlaceById,
  deletePlace,
  getAllPlacesWithHotelCount,
  getPlaceByUrlPrefix,
  getAllPlacesWithPagination,
  getAllPlacesWithHotelCountAndPagination,
};
