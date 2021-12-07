const client = require("../Client")
const { log } =  console

const responsePath = "frontend/users"

module.exports = userHandle = (t, m) => {
  log(t)
  client.emit(t, t, m)
};

client.on("login", (t, m) => {
  client.publish(`${responsePath}/${t}`, m)
})
