const mongoose = require("mongoose");

// db connection string
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.23ilw.mongodb.net/E-COMMERCE?retryWrites=true&w=majority`;
const connectDB = () => {
  mongoose
    .connect(url)
    .then((data) => {
      console.log(`MondoDB connected with server:${data.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDB;
