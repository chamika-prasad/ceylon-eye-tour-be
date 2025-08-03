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
    passenger_count: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
      defaultValue: "pending",
    },
    start_date: DataTypes.DATEONLY,
    package_id: DataTypes.STRING(36),
    customer_id: DataTypes.STRING(36),
  },
  {
    tableName: "booking",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Booking;
