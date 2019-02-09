const Command = require("../../structs/command.struct");

module.exports = new Command("test", "Test command.", -1)
	.setFunction(async(client, message, args) => message.channel.send("ok"));
