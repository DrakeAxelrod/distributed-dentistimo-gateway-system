var mqtt = require('mqtt')
// change to the actual URI and env variables!
var client  = mqtt.connect('mqtt://test.mosquitto.org')

client.on('connect', function () {
  client.subscribe('presence', function (error) {
    if (!error) {
        client.publish('presence', 'Hello mqtt')
    } else {
        console.log(error);
    }
  })
})

client.on('message', function (topic, message) {
  console.log(message.toString())
  if (message.toString() === "stop") {
    client.end()
    }
})