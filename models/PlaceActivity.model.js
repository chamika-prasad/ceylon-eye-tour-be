import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const PlaceActivity = sequelize.define(
  "PlaceActivity",
  {
    place_id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    activity_id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
    },
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL(10, 2),
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "place_activities",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default PlaceActivity;
