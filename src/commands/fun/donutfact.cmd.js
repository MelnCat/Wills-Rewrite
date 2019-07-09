const Command = require("../../structs/command.struct");
const { MessageEmbed } = require("discord.js");
const { get } = require("r2");
module.exports = new Command("donutfact", "Learn a cool fact about donuts!", "", 0)
	.setAlias("fact")
	.setFunction(async(client, message, args, strings) => {
		const random = Math.floor(Math.random() * 1);
		const embed = new MessageEmbed()
			.setTitle("Donut Fact")
			.setDescription("TEMP_FACT") // todo
			.setFooter(`INDEX: ${random} | Do you want to submit a donut fact? Visit mars!`);
		return message.channel.send(embed);
	});
