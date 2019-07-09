const Command = require("../../structs/command.struct");
module.exports = new Command("sql", "Run SQL.", "{sqlcode:str}", 4)
	.setFunction(async(client, message, args, strings) => {
		const { sequelize } = client.getModule("sql");
		const toRun = args.join(" ");
		if (!toRun) await message.argError();
		try {
			const done = await sequelize.query(toRun);
			await message.channel.send(`\`\`\`json\n${JSON.stringify(done[0]).substring(0, 1800)}\n\`\`\``);
		} catch (err) {
			await message.channel.send(`\`\`\`js\n${err}\n\`\`\``);
		}
	});
