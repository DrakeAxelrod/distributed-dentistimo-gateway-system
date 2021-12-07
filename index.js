require("dotenv").config();
require("./src/routes");
const DB = require("./src/utils/DB");
// connect to the database
DB.connect()
