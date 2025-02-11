// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
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

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
