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
      allowNull: true,
    },
    custom_package_id: {
      type: DataTypes.STRING(36),
      allowNull: true,
    },
    customer_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    booking_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      unique: true,
      get() {
        const rawValue = this.getDataValue("booking_no");
        // Format as string: JT_ + zero-padded 7 digits
        return rawValue ? `JT_${String(rawValue).padStart(7, "0")}` : null;
      },
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
