const userHandler = require("../users")
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

client.on("message", (t, m) => {
  // users/login
  const msg = m.toString();
  const base = t.split("/")[0]; // users or bookings
  const topic = t.replace(base, ""); // /login
  if (base === "api") {
    //log("res from backends");
    const topic = t.replace("api/gateway/", "");
    const base = topic.split("/")[0];
    if (base === "users") {
      
      userHandler(topic.replace(base + "/", ""), msg)
      // publish back to frontend
      // this should go to functions ( in another file that handle users)
      //client.publish(usersPath + topic, msg);
    }
    if (base === "bookings") {
      // this should go to functions ( in another file that handle bookigs)
      //client.publish(bookingsPath + topic, msg);
    }
  }
  if (base === "users") {
    client.publish(usersPath + topic, msg); // users/login -> api/users/login
  }
  if (base === "bookings") {
    client.publish(bookingsPath + topic, msg);
  }
});

//temp func for demo purposes
const allUsers = () => {
  // buffer to array
  res = Array.from(m);
  //log(res);
};
