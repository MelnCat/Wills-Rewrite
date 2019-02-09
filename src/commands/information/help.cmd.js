const Command = require("../../structs/command.struct");
const { MessageEmbed } = require("discord.js");
module.exports = new Command("help", "Gets a list of all the commands.", 0)
	.setFunction(async(client, message, args) => {
		const commands = client.commands.array();
		const chunked = client.utils.chunk(commands, 20);
		let i = 0;
		for (const cmds of chunked) {
			i++;
			const embed = new MessageEmbed()
				.setTitle("Command List")
				.setDescription(`Page ${i} of ${chunked.length}.`);
			for (const cmd of cmds) {
				embed.addField([cmd.name, ...cmd.aliases].join(", "), `${cmd.description}`);
			}
			await message.author.send(embed)
		}
	});
