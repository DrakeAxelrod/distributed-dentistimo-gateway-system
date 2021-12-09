const client = require("../Client")

const responsePath = "frontend/users"

module.exports = userHandle = (t, m) => {
  client.emit(t, t, m)
};

client.on("login", (t, m) => {
  client.publish(`${responsePath}/${t}`, m)
})

client.on("register", (t, m) => {
  client.publish(`${responsePath}/${t}`, m)
})

client.on("all", (t, m) => {
  client.publish(`${responsePath}/${t}`, m)
})
