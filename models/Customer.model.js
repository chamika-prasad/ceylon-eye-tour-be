import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Customer = sequelize.define(
  "Customer",
  {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    pw: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneno: DataTypes.STRING,
    country: DataTypes.STRING,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "customers",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Customer;
