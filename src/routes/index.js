const userHandler = require("../users")
const model = require("../models/log")
const client = require("../Client")
const bookingHandler = require('../bookings/index')

// base topics used to forward to subsystems
const usersPath = "api/users";
const bookingsPath = "api/bookings";
// listen for frontend
client.subscribe("users/#");
client.subscribe("bookings/#");
// listen for other sub-systems
client.subscribe("api/gateway/#");


const logging = (system, topic,  msg) => {
  let logMsg;
  if (msg.hasOwnProperty("password")) {
    const obj = JSON.parse(msg);
    obj["password"] = "**********";
    logMsg = JSON.stringify(obj);
  } else {
    logMsg = msg;
  }
  model.create({
    timestamp: Date.now(),
    client: system,
    topic: topic,
    message: logMsg,
  });
}

client.on("message", (t, m) => {
  const msg = m.toString()
  const base = t.split("/")[0];
  const topic = t.replace(base, "");
  if (base === "api") {
    const _topic = t.replace("api/gateway/", "");
    const _base = _topic.split("/")[0];
    if (_base === "users") {
      logging("User Management", t, msg)
      userHandler(_topic.replace(_base + "/", ""), msg)
    }
    if (_base === "bookings") {
      logging("Booking Management", t, msg)
      bookingHandler(_topic.replace(_base + "/", ""), msg)
    }
  }
  if (base === "users") {
    logging("User Interface", t, msg)
    client.publish(usersPath + topic, msg);
    
  }
  if (base === "bookings") {
    logging("User Interface", t, msg)
    client.publish(bookingsPath + topic, msg);
  }
});
