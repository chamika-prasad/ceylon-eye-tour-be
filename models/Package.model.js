import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Package = sequelize.define(
  "Package",
  {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    package_highlights: DataTypes.TEXT,
    price: DataTypes.DECIMAL(10, 2),
    tour_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "packages",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Package;
