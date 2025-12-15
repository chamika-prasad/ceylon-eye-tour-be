import { Hotel, Place } from "../models/index.js";
import { Op } from "sequelize";

const createHotel = async (data) => {
  try {
    return await Hotel.create(data);
  } catch (error) {
    throw new Error(`Error creating hotel: ${error.message}`);
  }
};

const updateHotel = async (id, data) => {
  return await Hotel.update(data, {
    where: { id },
  });
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

const getHotelByPrefix = async (prefix) => {
  try {
    return await Hotel.findOne({
      where: { url_prefix: prefix },
      include: [
        {
          model: Place,
          as: "Place",
          attributes: ["id", "name"],
        },
      ],
    });
  } catch (error) {
    throw new Error(`Error fetching hotel by urlPrifix: ${error.message}`);
  }
};

const getAllHotelsWithPagination = async (
  page = 1,
  pageSize = 10,
  searchTerm = ""
) => {
  const offset = (page - 1) * pageSize;

  // Build where clause for searching hotel name
  const whereClause = searchTerm
    ? {
        name: { [Op.like]: `%${searchTerm}%` },
      }
    : {};

  try {
    const { count, rows } = await Hotel.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Place,
          as: "Place",
          attributes: ["id", "name", "url_prefix"],
        },
      ],
      limit: parseInt(pageSize),
      offset: parseInt(offset),
      order: [["name", "ASC"]],
    });

    return {
      hotels: rows,
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: parseInt(page),
      pageSize: parseInt(pageSize),
    };
  } catch (error) {
    throw new Error(`Error fetching hotels: ${error.message}`);
  }
};

const getHotelsByPlaceIdWithPagination = async (
  placeId,
  page = 1,
  pageSize = 10,
  searchTerm = ""
) => {
  const offset = (page - 1) * pageSize;

  // Build where clause combining place_id filter with search
  const whereClause = {
    place_id: placeId,
    ...(searchTerm && {
      name: { [Op.like]: `%${searchTerm}%` },
    }),
  };

  try {
    const { count, rows } = await Hotel.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Place,
          as: "Place",
          attributes: ["id", "name"],
        },
      ],
      limit: parseInt(pageSize),
      offset: parseInt(offset),
      order: [["name", "ASC"]],
    });

    return {
      hotels: rows,
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: parseInt(page),
      pageSize: parseInt(pageSize),
    };
  } catch (error) {
    throw new Error(`Error fetching hotels by place ID: ${error.message}`);
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
  getAllHotelsWithPagination,
  getHotelsByPlaceIdWithPagination,
};
