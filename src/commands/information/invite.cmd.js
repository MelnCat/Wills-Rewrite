const Command = require("../../structs/command.struct");

module.exports = new Command("invite", "Gets the bot invite link.")
	.setFunction(async(client, message, args) => message.channel.send(`
**The bot invite link**
${await client.generateInvite(8)}
		`));

