const app = require("./app");
// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error:${err.message}`);
  console.log("Shutting down the server due to uncaught exception");
  process.exit(1);
});
require("dotenv").config();
const connectDB = require("./database/mongoose");
const port = process.env.PORT || 5000;

// connect database
connectDB();

// listening server
const server = app.listen(port, () => {
  console.log(`Server is working on http://localhost${port}`);
});

// console.log(uncaught);(will be an uncaught error)

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to unhandled Promise rejection");
  // I also have to close the server after handling the promise rejection
  server.close(() => {
    process.exit(1);
  });
});
