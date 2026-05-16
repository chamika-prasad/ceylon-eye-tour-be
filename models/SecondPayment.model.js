import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const SecondPayment = sequelize.define(
  "SecondPayment",
  {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    booking_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    payment_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    first_payment_id: {
      type: DataTypes.STRING(36),
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    method: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
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
    status_message: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    random_order_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    paymentType: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    sourceUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "second_payments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default SecondPayment;
