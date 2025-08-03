import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const PackageImage = sequelize.define(
  "PackageImage",
  {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    package_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "package_images",
    timestamps: false,
  }
);

export default PackageImage;
