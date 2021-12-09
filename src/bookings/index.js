const client = require("../Client")

const responsePath = "frontend/bookings"

module.exports = bookingsHandler = (t, m) => {
    client.emit(t, t, m)
};

client.on('all', (t, m) => {
    client.publish(`${responsePath}/${t}`, m)
})

client.on("available", (t, m) => {
  client.publish(`${responsePath}/${t}`, m);
});
