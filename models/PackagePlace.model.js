import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import Package from "./Package.model.js";
import Place from "./Place.model.js";

const PackagePlace = sequelize.define(
  "PackagePlace",
  {
    package_id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      references: {
        model: Package,
        key: "id",
      },
    },
    place_id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      references: {
        model: Place,
        key: "id",
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
