const Command = require("../../structs/command.struct");
const pms = require("pretty-ms");
const bipms = (x, etc = {}) => pms(Number(x) / 1000000, { formatSubMs: true, ...etc });
const { get } = require("r2");
const { MessageEmbed } = require("discord.js");
module.exports = new Command("permissions", "Check your own bot permissions.", "[user:user]", 0)
	.setAlias("perms")
	.setFunction(async(client, message, args, strings) => {
		const user = await client.utils.getUser(message, args, 0, true, true, u => message.guild.members.get(u.id));
		const member = message.guild.members.get(user.id);
		const permissions = Object.values(client.getModule("permissions")).map((x, i) => [client.constants.permissions[i], i]);
		const embed = new MessageEmbed()
			.setTitle("Permissions")
			.setDescription(`Permissions for ${member.tag}.`);
		for (const [name, index] of permissions) {
			embed.addField(name, client.utils.execPermission(index, member) ? client.mainEmojis.yes : client.mainEmojis.no, true);
		}
		return message.channel.send(embed);
	});
