const { Server } = require("socket.io");
const http = require("http"); // Using require for consistency
const express = require("express");

const app = express();
const server = http.createServer(app);
const FRONTEND_URL = process.env.ORIGIN || "http://localhost:5173";

const io = new Server(server, {
  cors: {
    origin: [FRONTEND_URL],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

module.exports = { io, app, server }; // Ensure exports are using module.exports
