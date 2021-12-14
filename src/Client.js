const client = require("mqtt").connect({
  clientId: "Gateway",
  hostname: process.env.BROKER_URI,
  username: process.env.BROKER_USERNAME,
  password: process.env.BROKER_PASSWORD,
  protocol: "wss",
});

client.on("error", (err) => {
  console.log(err);
});

client.on("connect", (ack) => {
  console.log("mqtt client connected!");
});

module.exports = client;
