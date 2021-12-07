const userHandler = require("../users")
const model = require("../models/log")
const client = require("../Client")
const { log } = console;

// base topics used to forward to subsystems
const usersPath = "api/users";
const bookingsPath = "api/bookings";

// listen for frontend
client.subscribe("users/#");
client.subscribe("bookings/#");

// listen for other sub-systems
client.subscribe("api/gateway/#");

client.on("message", (t, m) => { // users/login -> users
  // users/login
  const msg = m.toString();
  const base = t.split("/")[0]; // users or bookings
  const topic = t.replace(base, ""); // /login
  if (base === "api") {
    //log("res from backends");
    const topic = t.replace("api/gateway/", "");
    const base = topic.split("/")[0];
    if (base === "users") {
      let logMsg;
      if (topic === "/login" || topic === "/register") {
        const o = JSON.parse(msg);
        o["password"] = "**********";
        logMsg = JSON.stringify(o);
      } else {
        logMsg = msg;
      }
      model.create({
        timestamp: Date.now(),
        client: "User Management",
        topic: t,
        message: logMsg,
      });
      // strips off api/gateway/users 
      userHandler(topic.replace(base + "/", ""), msg)
      // publish back to frontend
      // this should go to functions ( in another file that handle users)
      //client.publish(usersPath + topic, msg);
    }
    if (base === "bookings") {
      model.create({
        timestamp: Date.now(),
        client: "Booking Management",
        topic: t,
        message: logMsg,
      });
      // this should go to functions ( in another file that handle bookigs)
      //client.publish(bookingsPath + topic, msg);
    }
  }
  if (base === "users") {
    let logMsg
    if (topic === "/login" || topic === "/register") {
      const o = JSON.parse(msg)
      o["password"] = "**********"
      logMsg  = JSON.stringify(o)
    } else {
      logMsg = msg
    }
    model.create({
      timestamp: Date.now(),
      client: "User Interface",
      topic: t,
      message: logMsg
    })
    client.publish(usersPath + topic, msg); // users/login -> api/users/login
    
  }
  if (base === "bookings") {
    model.create({
      timestamp: Date.now(),
      client: "User Interface",
      topic: t,
      message: logMsg,
    });
    client.publish(bookingsPath + topic, msg);
  }
});

//temp func for demo purposes
const allUsers = () => {
  // buffer to array
  res = Array.from(m);
  //log(res);
};
