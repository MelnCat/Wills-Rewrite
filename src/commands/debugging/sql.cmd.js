const Command = require("../../structs/command.struct");
module.exports = new Command("sql", "Run SQL.", 4)
	.setFunction(async(client, message, args) => {
		const { sequelize } = client.getModule("sql");
		const toRun = args.join(" ");
		if (!toRun) return message.channel.send(client.errors.arguments);
		try {
			const done = await sequelize.query(toRun);
			await message.channel.send(`\`\`\`json\n${JSON.stringify(done[0]).substring(0, 1800)}\n\`\`\``);
		} catch (err) {
			await message.channel.send(`\`\`\`js\n${err}\n\`\`\``);
		}
	});
