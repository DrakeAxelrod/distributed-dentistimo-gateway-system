const mongoose = require("mongoose");
const { log } = console;
require('dotenv').config()

const uri = process.env.MONGODB_URI;
const connect = () => {
  const database = mongoose.connect(uri, {}, (err) => {
    if (!err) {
      log(`Connected to MongoDB`);
    } else {
      console.error(`Failed to connect to MongoDB`);
      console.error(err.stack);
      process.exit(1);
    }
  });
};

module.exports = db = {
  connect: connect
};
