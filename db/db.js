const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongodb is connected");
  })
  .catch((err) => {
    console.log("failed to connect to mongodb", err);
  });
