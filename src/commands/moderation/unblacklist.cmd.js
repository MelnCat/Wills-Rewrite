const Command = require("../../structs/command.struct");


module.exports = new Command("unblacklist", "Unblacklist a guild, user, or channel. Deprecated command, use blacklist remove instead.", "{method:<add|remove>} {id:str}", 3)
	.setFunction(async(client, message, args, strings) => {
		await message.channel.send(client.errors.deprecated);
		await client.commands.get("blacklist").exec(client, message, ["remove", args], strings);
	})
	.setShortcuts("ubl");
