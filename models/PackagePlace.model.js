import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import Package from "./Package.model.js";
import Place from "./Place.model.js";

const PackagePlace = sequelize.define(
  "PackagePlace",
  {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    package_id: {
      type: DataTypes.STRING(36),
      // primaryKey: true,
      references: {
        model: Package,
        key: "id",
      },
    },
    place_id: {
      type: DataTypes.STRING(36),
      // primaryKey: true,
      references: {
        model: Place,
        key: "id",
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    day_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    events: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("events");
        return rawValue ? JSON.parse(rawValue) : [];
      },
    },
  },
  {
    tableName: "package_places",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default PackagePlace;
