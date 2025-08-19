import { Server } from "socket.io";

const users = {};

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("join", (userData) => {
      users[userData.id] = { ...userData, socketId: socket.id };
      console.log(`${userData.name} (${userData.role}) joined`);
      io.emit("users", Object.values(users));
    });

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

    socket.on("sendMessage", (data) => {
      // data -> {
      //   senderId,
      //   receiverId,
      //   message
      // }
      const recipient = Object.values(users).find(
        (user) => user.id === data.receiverId
      );
      if (recipient) {
        io.to(recipient.socketId).emit("messageReceived", {
          from: data.senderId,
          message: data.message,
        });
        console.log(`Message sent from ${data.senderId} to ${data.receiverId}`);
      }
    });
  });

  return io;
};
