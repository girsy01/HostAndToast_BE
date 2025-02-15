const { Server } = require("socket.io");
const http = require("http");
const User = require("./models/User.model"); // Import the User model
const Message = require("./models/Message.model"); // Import the Message model

const FRONTEND_URL = process.env.ORIGIN || "http://localhost:5173";

const app = require("express")();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [FRONTEND_URL],
  },
});

const users = new Map(); // Store userId -> socketId mappings

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // Listen for a custom event to associate user ID with socket ID
  socket.on("registerUser", (userId) => {
    users.set(userId, socket.id); // Map user ID to socket ID
  });

  socket.on("sendMessage", async (message) => {
    try {
      const sender = await User.findById(message.senderId);
      const receiver = await User.findById(message.receiverId);

      const newMessage = await Message.create({
        ...message,
        senderId: sender,
        receiverId: receiver,
      });

      const receiverSocketId = users.get(message.receiverId); // Get receiver's socket ID
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", newMessage); // Emit directly to the receiver
      }

      socket.emit("receiveMessage", newMessage); // Send back to sender
    } catch (error) {
      console.log("Error saving the message:", error);
    }
  });

  // Remove user from the map when they disconnect
  socket.on("disconnect", () => {
    users.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        users.delete(userId);
      }
    });
    console.log("User disconnected", socket.id);
  });
});

module.exports = { io, app, server };
