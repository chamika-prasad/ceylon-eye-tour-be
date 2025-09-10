import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    booking_id: DataTypes.STRING(36),
    payment_id: DataTypes.STRING,
    amount: DataTypes.DECIMAL(10, 2),
    currency: DataTypes.STRING,
    method: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM(
        "success",
        "pending",
        "canceled",
        "failed",
        "chargedback"
      ),
      defaultValue: "pending",
    },
    status_message: DataTypes.STRING,
  },
  {
    tableName: "payments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Payment;
