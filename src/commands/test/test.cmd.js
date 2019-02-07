const Command = require("../../structs/command.struct");

module.exports = new Command("test", "Testing command.")
	.setFunction(async(client, message, args) => {
		await message.channel.send(`Test ok! Args: ${args}`);
	});
