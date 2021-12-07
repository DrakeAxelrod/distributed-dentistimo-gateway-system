require("dotenv").config();
require("./src/routes");
const DB = require("./src/utils/DB");

DB.connect()
