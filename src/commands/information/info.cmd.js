const Command = require("../../structs/command.struct");
const pb = require("pretty-bytes");
const { MessageEmbed, version } = require("discord.js");
const os = require("os");
const pms = require("pretty-ms");
module.exports = new Command("info", "Get info about the bot.", "", 0)
	.setAlias("botinfo")
	.setFunction(async(client, message, args, strings) => {
		const embed = new MessageEmbed()
			.setTitle("Bot Information")
			.setDescription("Information about the bot!")
			.addField("Operating System", process.platform, true)
			.addField("System Uptime", pms(os.uptime() * 1000), true)
			.addField("Bot Uptime", pms(client.uptime), true)
			.addField("Node.js Version", process.version, true)
			.addField("Discord.js Version", version, true)
			.addField("Memory Usage", pb(process.memoryUsage().rss), true)
			.addField("Version", await client.getVersion(), true)
			.setFooter("Discord Donuts is allowed to collect all Command Usage and Direct Messages sent to the bot.");
		return message.channel.send(embed);
	});
