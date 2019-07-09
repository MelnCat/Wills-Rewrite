const Command = require("../../structs/command.struct");

module.exports = new Command("restart", "Restarts the bot.", "", 4)
	.setFunction(async(client, message, args, strings) => {
		await message.channel.send("Restarting...");
		client.status = 4;
		await client.user.setActivity("Restarting");
		process.exit();
	});
