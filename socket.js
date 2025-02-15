const { Server } = require("socket.io");
const http = require("http");
const User = require("./models/User.model"); // Import the User model
const Message = require("./models/Message.model"); // Import the Message model

setInterval(() => {
  io.emit("ping", { message: "Keep WebSocket Alive" });
}, 25000); // Every 25 seconds

const FRONTEND_URL = process.env.ORIGIN || "http://localhost:5173";
const app = require("express")();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [FRONTEND_URL], // Ensure frontend URL is correct
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // Ensure WebSocket transport works
});

const users = new Map(); // Store userId -> socketId mappings

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // Listen for a custom event to associate user ID with socket ID
  socket.on("registerUser", (userId) => {
    if (userId) {
      users.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ID ${socket.id}`);
    } else {
      console.log("registerUser: Invalid userId received");
    }
  });

  socket.on("sendMessage", async (message) => {
    try {
      // Retrieve sender and receiver user details
      const sender = await User.findById(message.senderId);
      const receiver = await User.findById(message.receiverId);

      // Create a new message and populate sender and receiver user details
      const newMessage = await Message.create({
        ...message,
        senderId: sender,
        receiverId: receiver,
      });

      // Emit the message to the recipient and the sender
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
        console.log(`User ${userId} disconnected`);
      }
    });
  });
});

module.exports = { io, app, server };
