require("dotenv").config();

require("./db"); // Connects to database

const express = require("express");
const { io, app, server } = require("./socket"); // Use require instead of import

require("./config")(app); // Middleware setup

// Define routes
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/auth", userRoutes);

const addressRoutes = require("./routes/address.routes");
app.use("/api/addresses", addressRoutes);

const mealRoutes = require("./routes/meal.routes");
app.use("/api/meals", mealRoutes);

const ratingRoutes = require("./routes/rating.routes");
app.use("/api/ratings", ratingRoutes);

const orderRoutes = require("./routes/order.routes");
app.use("/api/orders", orderRoutes);

const paymentRoutes = require("./routes/payment.routes");
app.use("/api/payment", paymentRoutes);

const messageRoutes = require("./routes/message.routes");
app.use("/api/messages", messageRoutes);

require("./error-handling")(app); // Error handling

module.exports = server; // Export server instead of app
