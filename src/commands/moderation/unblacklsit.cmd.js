const Command = require("../../structs/command.struct");


module.exports = new Command("blacklist", "Blacklist or unblacklist a guild, user, or channel.", "{method:<add|remove>} {id:str}", 3)
	.setFunction(async(client, message, args, strings) => {
		const blacklist = client.getModel("blacklist");
		const { Op } = client.getModule("sql");
		if (!args[1] || !args[0].equalsAny("add", "remove")) await message.argError();
		if (isNaN(args[1])) return message.channel.send(strings.args.invalidID);
		if (args[0] === "add") {
			if (await blacklist.findByPk(args[1])) return message.channel.send(`${client.mainEmojis.no} That ID is already blacklisted!`);
			await blacklist.create({ id: args[1] });
			await message.channel.send(`${client.mainEmojis.yes} The ID was successfully blacklisted!`);
		} else {
			const user = await blacklist.findByPk(args[1]);
			if (!user) return message.channel.send(`${client.mainEmojis.no} That ID is not blacklisted!`);
			await user.destroy();
			await message.channel.send(`${client.mainEmojis.yes} The ID was successfully removed from the blacklist!`);
		}
	})
	.setShortcuts("bl");
