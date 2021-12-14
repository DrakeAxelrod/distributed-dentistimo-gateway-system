const client = require("../Client")
const CircuitBreaker = require("opossum");

const options = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};

const responsePath = "frontend/users"

module.exports = userHandle = (t, m) => {
  client.emit("event", t, m)
};

// client.on("login", (t, m) => {
//   client.publish(`${responsePath}/${t}`, m)
// })

// client.on("register", (t, m) => {
//   client.publish(`${responsePath}/${t}`, m)
// })

client.on("event", (t, m) => {
    // const breaker = new CircuitBreaker(
    //   client.publish(`${responsePath}/${t}`, m),
    //   options
    // );
    // const result = breaker
    //   .fire()
    //   .then((res) => res)
    //   .catch(console.error);
  client.publish(`${responsePath}/${t}`, m)
})
