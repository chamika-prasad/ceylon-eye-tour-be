import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const TourType = sequelize.define(
  "TourType",
  {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    image_url: DataTypes.STRING(500),
  },
  {
    tableName: "tour_types",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default TourType;