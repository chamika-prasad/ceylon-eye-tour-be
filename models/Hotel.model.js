import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Hotel = sequelize.define(
  "Hotel",
  {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    place_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    type_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue("description");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      allowNull: true,
    },
    facilities: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue("facilities");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      allowNull: true,
    },
    images: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue("images");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      allowNull: true,
    },
    rooms_details: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue("rooms_details");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      allowNull: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "hotels",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Hotel;
