import mqtt from "mqtt";
import { config } from "dotenv"
const { log } = console;

config()

const client = mqtt.connect({
  hostname: process.env.BROKER_URI,
  username: process.env.BROKER_USERNAME,
  password: process.env.BROKER_PASSWORD,
  protocol: "wss",
});

client.on('connect', (ack, err) => {
    if (!err) {
        console.log("connected")
        setInterval(
          () => client.publish("gateway", "message from gateway"),
          1000
        );
    } else {
        console.log(err);
    }
})

client.subscribe("user")
client.subscribe("booking");
client.subscribe("frontend")

client.on('message', (topic, message) => {
  log(message.toString())
  if (message.toString() === "stop") {
    client.end()
  }
})
