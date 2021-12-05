const { log } = console;

// base topics used to forward to subsystems
const usersPath = "api/users";
const bookingsPath = "api/bookings"

const client = require("mqtt").connect({
  clientId: "Gateway",
  hostname: process.env.BROKER_URI,
  username: process.env.BROKER_USERNAME,
  password: process.env.BROKER_PASSWORD,
  protocol: "wss",
});

client.on("error", (err) => {
  log(err)
})

client.on('connect', (ack) => {
  console.log("mqtt client connected!")
})

// listen for frontend
client.subscribe("users/#")
client.subscribe("bookings/#");
// listen for other sub-systems
client.subscribe("api/gateway/#");

client.on('message', (t, m) => {
    const msg = m.toString();
    const base = t.split("/")[0]
    const topic = t.replace(base, "")

    if (base === "api") {
      //log("res from backends");
      const topic = t.replace("api/gateway/", "");
      const base = topic.split("/")[0];
      if (base === "users") {
        // this should go to functions ( in another file that handle users)
        client.publish(usersPath + topic, msg);
      }
      if (base === "bookings") {
        // this should go to functions ( in another file that handle bookigs)
        client.publish(bookingsPath + topic, msg);
      }
    }
    if (base === "users") {
      client.publish(usersPath + topic, msg);
    }
    if (base === "bookings") {
      client.publish(bookingsPath + topic, msg);
    }
})


//temp func for demo purposes
const allUsers = () => {
  // buffer to array
  res = Array.from(m);
  log(res);
}
