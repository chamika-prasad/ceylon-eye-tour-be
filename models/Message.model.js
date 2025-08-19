import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sender_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    receiver_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "messages",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Message;
