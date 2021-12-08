const client = require("../Client")
const { log } =  console

const responsePath = "frontend/bookings"

module.exports = bookingsHandler = (t, m) => {
    client.emit(t, t, m)
};

client.on('all', (t, m) => {
    console.log("here")
    console.log(m)
    client.publish(`${responsePath}/${t}`, m)
})
