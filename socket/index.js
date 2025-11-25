import { Server } from "socket.io";
import messageService from "./../services/message.service.js";

const users = {};

export const initializeSocket = (server, frontEndUrl) => {
  console.log(frontEndUrl);

  const io = new Server(server, {
    cors: {
      origin: frontEndUrl,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // ✅ Join user
    socket.on("join", (userData) => {
      users[userData.id] = { ...userData, socketId: socket.id };
      console.log(`${userData.name} (${userData.role}) joined`);
      io.emit("users", Object.values(users));
    });

    // ✅ Disconnect user
    socket.on("disconnect", () => {
      const disconnectedUser = Object.values(users).find(
        (user) => user.socketId === socket.id
      );
      if (disconnectedUser) {
        delete users[disconnectedUser.id];
        io.emit("users", Object.values(users));
        console.log(`${disconnectedUser.name} disconnected`);
      }
    });

    // ✅ Send message
    socket.on("sendMessage", async (data) => {
      try {
        // data: { senderId, receiverId, message }
        const { senderId, receiverId, userId, message } = data;

        // Save message in DB

        const newMessage = await messageService.createMessage({
          senderId,
          receiverId,
          userId,
          message,
        });

        // Find recipient user
        const recipient = users[receiverId];

        if (recipient) {
          io.to(recipient.socketId).emit("messageReceived", {
            from: senderId,
            message,
          });
        }

        // ✅ Send confirmation back to sender
        socket.emit("messageSent", newMessage);

        console.log(`Message sent from ${senderId} to ${receiverId}`);
      } catch (error) {
        console.error("Error sending message:", error.message);
        socket.emit("error", { message: "Failed to send message" });
      }
    });
  });

  console.log("socket.io server created");
  return io;
};
