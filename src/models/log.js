const mongoose = require("mongoose")
const Schema = mongoose.Schema

const log = new Schema({
  timestamp: {
    type: Date,
  },
  topic: {
    type: String,
  },
  message: {
    type: String,
  },
  client: {
    type: String,
  }
})

module.exports = mongoose.model("Log", log)
