import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const CustomizePackagePlaceActivity = sequelize.define(
  "CustomizePackagePlaceActivity",
  {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    customize_package_place_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    activity_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "customize_package_place_activities",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default CustomizePackagePlaceActivity;
