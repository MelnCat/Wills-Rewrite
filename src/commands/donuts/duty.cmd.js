const Command = require("../../structs/command.struct");
module.exports = new Command("duty", "Go on or off duty.", 2)
	.setFunction(async(client, message) => {
		const onduty = client.roles.onduty;

		if (message.member.roles.has(onduty)) {
			await message.member.roles.remove("id", onduty);
			await message.reply(`You're no longer on ${message.command.inputName}.`);
		} else {
			await message.member.roles.add("id", onduty);
			await message.reply(`You're now on ${message.command.inputName}!`);
		}
	}).setAlias("dudey", "dooty");
