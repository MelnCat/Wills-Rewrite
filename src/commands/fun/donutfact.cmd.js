const Command = require("../../structs/command.struct");
const { MessageEmbed } = require("discord.js");
const { get } = require("r2");
module.exports = new Command("donutfact", "Gets a list of all the commands.", 0)
	.setAlias("fact")
	.setFunction(async(client, message, args) => {
		const facts = await (await get("https://discord-donuts-fact-submitter.glitch.me/facts")).json;
		const random = Math.floor(Math.random() * facts.length);
		const embed = new MessageEmbed()
			.setTitle("Donut Fact")
			.setDescription(facts[random].fact)
			.setFooter(`INDEX: ${random} | Do you want to submit a donut fact? Visit https://discord-donuts-fact-submitter.glitch.me/ !`);
		return message.channel.send(embed);
	});
