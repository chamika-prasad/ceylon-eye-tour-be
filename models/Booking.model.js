import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    adult_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    child_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
      defaultValue: "pending",
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    package_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "bookings",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Booking;
