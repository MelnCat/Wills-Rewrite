const Command = require("../../structs/command.struct");

module.exports = new Command("reload", "Reload the bot commands.", "", 4)
	.setFunction(async(client, message, args, strings) => {
		client.reloadCommands();
		return message.channel.send("Commands successfully reloaded!");
	});
