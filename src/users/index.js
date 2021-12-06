const client = require("../Client")
const { log } =  console

const responsePath = "frontend/users"

module.exports = userHandle = (t, m) => {
  client.emit(t, t, m)
};

client.on("login", (t, m) => {
  log("send login result")
  client.publish(`${responsePath}/${t}`, m)
})
