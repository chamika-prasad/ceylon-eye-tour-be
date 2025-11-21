import { HotelType, Hotel, Place } from "../models/index.js";
import { Sequelize } from "sequelize";

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
        ],
      },
    ],
  });
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
