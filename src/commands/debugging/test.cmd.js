const Command = require("../../structs/command.struct");

module.exports = new Command("test", "Test command.", "{import}", 0)
	.setFunction(async(client, message, args) => message.channel.send("hi"));
