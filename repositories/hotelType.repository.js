import { HotelType, Hotel, Place } from "../models/index.js";
import { Sequelize } from "sequelize";

const createHotelType = async (data) => {
  try {
    return await HotelType.create(data);
  } catch (error) {
    throw new Error(`Error creating hotel type: ${error.message}`);
  }
};

const getAllHotelTypes = async () => {
  try {
    return await HotelType.findAll();
  } catch (error) {
    throw new Error(`Error fetching hotel types: ${error.message}`);
  }
};

const getHotelTypeById = async (id) => {
  try {
    return await HotelType.findByPk(id);
  } catch (error) {
    throw new Error(`Error fetching hotel type by ID: ${error.message}`);
  }
};

const updateHotelType = async (id, data) => {
  try {
    const [updated] = await HotelType.update(data, { where: { id } });
    return updated > 0;
  } catch (error) {
    throw new Error(`Error updating hotel type: ${error.message}`);
  }
};

const deleteHotelType = async (id) => {
  try {
    const deleted = await HotelType.destroy({ where: { id } });
    return deleted > 0;
  } catch (error) {
    throw new Error(`Error deleting hotel type: ${error.message}`);
  }
};

const getAllHotelTypesWithHotelCount = async () => {
  try {
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
  } catch (error) {
    throw new Error(`Error fetching hotel types: ${error.message}`);
  }
};

const getHotelTypeByUrlPrefix = async (urlPrefix) => {
  try {
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
          ],
        },
      ],
    });
  } catch (error) {
    throw new Error(`Error fetching hotel type by urlPrefix: ${error.message}`);
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
};
