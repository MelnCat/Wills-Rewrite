const Command = require("../../structs/command.struct");

module.exports = new Command("invite", "Gets the bot invite link.", "", 0)
	.setFunction(async(client, message, args, strings) => message.channel.send(`
**The bot invite link**
${await client.generateInvite(8)}
		`));

