import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js"; // Adjust this path if needed

const PackageCategory = sequelize.define(
  "PackageCategory",
  {
    package_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "package_categories",
    timestamps: false, // created_at is manually managed
    underscored: true,
  }
);

export default PackageCategory;
