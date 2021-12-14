const client = require("../Client")
const CircuitBreaker = require('opossum');

const options = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000 // After 30 seconds, try again.
};

const responsePath = "frontend/bookings"

module.exports = bookingsHandler = (t, m) => {
    client.emit("event", t, m)
};

// client.on('all', (t, m) => {
//     client.publish(`${responsePath}/${t}`, m)
// })

// client.on("available", (t, m) => {
//   client.publish(`${responsePath}/${t}`, m);
// });

client.on("event", (t, m) => {
  const breaker = new CircuitBreaker(client.publish(`${responsePath}/${t}`, m), options);
  const result = breaker.fire(t, m)
  .then(res => res)
  .catch(console.error)
  //client.publish(`${responsePath}/${t}`, m);
});
