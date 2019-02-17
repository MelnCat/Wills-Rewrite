const Command = require("../../structs/command.struct");

module.exports = new Command("restart", "Restarts the bot.", 4)
	.setFunction(async(client, message, args) => {
		await message.channel.send("Restarting...");
		process.exit();
	});
