import { HotelType, Hotel, Place } from "../models/index.js";
import { Sequelize,Op } from "sequelize";

const createHotelType = async (data) => {
  return await HotelType.create(data);
};

const getAllHotelTypes = async () => {
  // return await HotelType.findAll();
  return await HotelType.findAll({
    attributes: {
      exclude: ["created_at", "updated_at"],
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
    group: ["HotelType.id"],
    raw: true, // optional, gives plain objects
  });
};

const getHotelTypeById = async (id) => {
  return await HotelType.findByPk(id);
};

const updateHotelType = async (id, data) => {
  const [updated] = await HotelType.update(data, { where: { id } });
  return updated > 0;
};

const deleteHotelType = async (id) => {
  const deleted = await HotelType.destroy({ where: { id } });
  return deleted > 0;
};

const getAllHotelTypesWithHotelCount = async () => {
  const hotelTypes = await HotelType.findAll({
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
    group: ["HotelType.id"],
    raw: true, // optional, gives plain objects
  });

  const filteredHotelTypes = hotelTypes.filter(
    (type) => Number(type.hotelCount) > 0
  );

  return filteredHotelTypes;
};

const getHotelTypeByUrlPrefix = async (urlPrefix) => {
  return await HotelType.findOne({
    where: { url_prefix: urlPrefix },
    include: [
      {
        model: Hotel,
        as: "Hotels", // Must match the association alias
        include: [{ model: Place, as: "Place", attributes: ["name"] }],
        attributes: [
          "id",
          "name",
          "description",
          "facilities",
          "images",
          "rating",
          "rooms_details",
          "url_prefix",
        ],
      },
    ],
  });
};

const getAllHotelTypesWithHotelCountAndPagination = async (
  page = 1,
  pageSize = 10,
  searchTerm = ""
) => {
  const offset = (page - 1) * pageSize;

  // Build where clause for searching hotel type name
  const whereClause = searchTerm
    ? {
        name: { [Op.like]: `%${searchTerm}%` },
      }
    : {};

  try {
    // First, get all filtered hotel types with hotel count
    const allHotelTypes = await HotelType.findAll({
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
      group: ["HotelType.id"],
      raw: true,
    });

    // Filter hotel types with hotelCount > 0
    const filteredHotelTypes = allHotelTypes.filter(
      (type) => Number(type.hotelCount) > 0
    );

    // Apply pagination to filtered results
    const paginatedHotelTypes = filteredHotelTypes.slice(
      offset,
      offset + pageSize
    );

    return {
      hotelTypes: paginatedHotelTypes,
      totalItems: filteredHotelTypes.length,
      totalPages: Math.ceil(filteredHotelTypes.length / pageSize),
      currentPage: parseInt(page),
      pageSize: parseInt(pageSize),
    };
  } catch (error) {
    throw new Error(
      `Error fetching hotel types with hotel count: ${error.message}`
    );
  }
};

const getAllHotelTypesWithPagination = async (
  page = 1,
  pageSize = 10,
  searchTerm = ""
) => {
  const offset = (page - 1) * pageSize;

  // Build where clause for searching hotel type name
  const whereClause = searchTerm
    ? {
        name: { [Op.like]: `%${searchTerm}%` },
      }
    : {};

  try {
    // Get all hotel types with hotel count and search filter
    const allHotelTypes = await HotelType.findAll({
      where: whereClause,
      attributes: {
        exclude: ["created_at", "updated_at"],
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
      group: ["HotelType.id"],
      raw: true,
    });

    // Get total count
    const totalItems = allHotelTypes.length;

    // Apply pagination
    const paginatedHotelTypes = allHotelTypes.slice(offset, offset + pageSize);

    return {
      hotelTypes: paginatedHotelTypes,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
      currentPage: parseInt(page),
      pageSize: parseInt(pageSize),
    };
  } catch (error) {
    throw new Error(`Error fetching hotel types: ${error.message}`);
  }
};

export default {
  createHotelType,
  getAllHotelTypes,
  getHotelTypeById,
  updateHotelType,
  deleteHotelType,
  getAllHotelTypesWithHotelCount,
  getHotelTypeByUrlPrefix,
  getAllHotelTypesWithHotelCountAndPagination,
  getAllHotelTypesWithPagination,
};
