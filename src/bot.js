const Client = require("./structs/client.struct");
const auth = require("./auth");
Client.login(auth.token);
