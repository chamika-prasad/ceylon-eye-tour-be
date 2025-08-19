import { Message,User } from "../models/index.js";
import { Op, QueryTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const addMessage = async (messageData) => {
  return await Message.create({
    sender_id: messageData.senderId,
    receiver_id: messageData.receiverId,
    message: messageData.message,
  });
};

const getMessagesByUser = async (userId) => {
  return await Message.findAll({
    where: {
      [Op.or]: [{ sender_id: userId }, { receiver_id: userId }],
    },
    order: [["created_at", "ASC"]],
  });
};

const getMessagesGroupedByUser = async (adminId) => {

    const latestMessages = await Message.findAll({
      attributes: [
        'sender_id',
        'message',
        'created_at',
        [sequelize.fn('MAX', sequelize.col('created_at')), 'latest_message_time']
      ],
      where: {
        sender_id: {
          [Op.ne]: adminId
        }
      },
      group: ['sender_id'],
      order: [[sequelize.fn('MAX', sequelize.col('created_at')), 'DESC']]
    });

    const response = await Promise.all (latestMessages.map(async message => {
      const user = await User.findOne({
        where: {
          id: message.sender_id
        },
        attributes: ['id', 'name', 'email']
      })

      return {
        sender_id: message.sender_id,
        receiver_id: message.receiver_id,
        message: message.message,
        created_at: message.created_at,
        latest_message_time: message.latest_message_time,
        sender_name: user.name, // Include user details
      };
    }))


    
    return response;
  
};

export default {
  addMessage,
  getMessagesByUser,
  getMessagesGroupedByUser,
};
