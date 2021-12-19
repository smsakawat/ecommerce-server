const app = require("./app");
require("dotenv").config();
const connectDB = require("./database/mongoose");
const port = process.env.PORT || 5000;

// connect database
connectDB();

// listening server
app.listen(port, () => {
  console.log(`Server is working on http://localhost${port}`);
});
