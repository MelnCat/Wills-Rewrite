const moment = require("moment-timezone");
exports.timestamp = () => `${moment().tz("Canada/Pacific").format("DD-MM-YY hh:mm:ss z")}`;
