const Command = require("../../structs/command.struct");

module.exports = new Command("test", "Test command.", "{import}", 0)
	.setFunction(async(client, message, args, strings) => message.channel.send("hi"));
