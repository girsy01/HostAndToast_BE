const { Server } = require("socket.io");
const http = require("http");
const User = require("./models/User.model"); // Import the User model
const Message = require("./models/Message.model"); // Import the Message model

const app = require("express")();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust as necessary
  },
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("sendMessage", async (message) => {
    try {
      // Retrieve sender and receiver user details
      const sender = await User.findById(message.senderId);
      const receiver = await User.findById(message.receiverId);

      // Create a new message and populate sender and receiver user details
      const newMessage = await Message.create({
        ...message,
        senderId: sender, // Attach full sender object
        receiverId: receiver, // Attach full receiver object
      });

      // Emit the message to the recipient and the sender
      socket.to(message.receiverId).emit("receiveMessage", newMessage);
      socket.emit("receiveMessage", newMessage); // Optionally, send back to the sender
    } catch (error) {
      console.log("Error saving the message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

module.exports = { io, app, server };
