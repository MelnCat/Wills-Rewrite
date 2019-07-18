const Command = require("../../structs/command.struct");


module.exports = new Command("blacklist", "Blacklist commands.", "{method:<add|remove>} {id:str}", 3)
	.setFunction(async(client, message, args, strings) => {
		const blacklists = client.getModel("blacklists");
		const { Op } = client.getModule("sql");
		if (!args[1] || !args[0].equalsAny("add", "remove")) await message.argError();
		if (isNaN(args[1])) return message.channel.send(strings.args.invalidID);
		if (await blacklists.findByPk(args[0])) return message.channel.send(`${client.mainEmojis.no} That ID is already blacklisted!`);
		await blacklists.create({ id: args[0] });
		await message.channel.send(`${client.mainEmojis.yes} The ID was successfully blacklisted!`);
	})
	.setShortcuts("bl");
