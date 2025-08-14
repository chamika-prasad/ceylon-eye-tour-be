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
    description: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue("description");
        return rawValue ? JSON.parse(rawValue) : [];
      },
    },
    package_highlights: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue("package_highlights");
        return rawValue ? JSON.parse(rawValue) : [];
      },
    },

    price: DataTypes.DECIMAL(10, 2),
    tour_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    departure_location: { type: DataTypes.STRING, allowNull: false },
    departure_description: DataTypes.TEXT,
    arrival_location: { type: DataTypes.STRING, allowNull: false },
    arrival_description: DataTypes.TEXT,
    duration: DataTypes.STRING,
    // excludes: DataTypes.TEXT,
    excludes: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue("excludes");
        return rawValue ? JSON.parse(rawValue) : [];
      },
    },
    // includes: DataTypes.TEXT,
    includes: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue("includes");
        return rawValue ? JSON.parse(rawValue) : [];
      },
    },
    url_prefix: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    review: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    user_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
