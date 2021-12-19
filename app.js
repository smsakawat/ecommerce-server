const express = require("express");
const app = express();
app.use(express.json());
// Route imports
const product = require("./routes/productRoute");
app.use("/api/v1", product);

// Middlware for Errors(not working for now..so i'll send error manually everywhere)
// app.use(errorMiddleware);

module.exports = app;
