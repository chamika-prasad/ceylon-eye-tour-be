import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const CustomizePackagePlace = sequelize.define(
  "CustomizePackagePlace",
  {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    customize_package_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    place_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    day_no: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "customize_package_places",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default CustomizePackagePlace;
