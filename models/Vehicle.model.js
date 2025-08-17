import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Vehicle = sequelize.define(
  "Vehicle",
  {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    descriptions: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("descriptions");
        return rawValue ? JSON.parse(rawValue) : [];
      },
    },
    images: {
      type: DataTypes.TEXT, // storing JSON string
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("images");
        return rawValue ? JSON.parse(rawValue) : [];
      },
    },
    excludes: {
      type: DataTypes.TEXT, // storing JSON string
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("excludes");
        return rawValue ? JSON.parse(rawValue) : [];
      },
    },
    facilities: {
      type: DataTypes.TEXT, // storing JSON string
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("facilities");
        return rawValue ? JSON.parse(rawValue) : [];
      },
    },
    terms: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("terms");
        return rawValue ? JSON.parse(rawValue) : [];
      },
    },
    owner: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    owner_contact: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    url_prefix: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    passenger_capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "vehicles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Vehicle;
