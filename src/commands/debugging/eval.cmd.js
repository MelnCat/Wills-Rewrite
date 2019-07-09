const Command = require("../../structs/command.struct");

module.exports = new Command("eval", "Eval javascript code.", "{jscode:str}", 4)
	.setFunction(async(client, message, args, strings) => {
		try {
			let toEval = args.join(" ");
			if (!toEval) await message.argError();
			let com = await eval(`(async () => {${toEval}})()`);
			let type = "Unknown";
			try {
				type = com.constructor.name;
			} catch (e) {
				type = typeof com;
			}
			if (typeof com !== "string") com = require("util").inspect(com, false, 1);
			let isOutHigh = com.length > 1987;
			com = com.split(client.auth.token).join("Censored");
			await message.channel.send(`\`\`\`js\n${com.substr(0, 1987)}${isOutHigh ? "..." : ""}\`\`\``);
			await message.channel.send(`**TYPE**\n\`\`\`js\n${type}\n\`\`\``);
		} catch (e) {
			if (!e.stack) e.stack = e.toString();
			let isErrHigh = e.stack.length > 1987;
			await message.channel.send(`\`\`\`js\n${e.stack.substr(0, 1987)}${isErrHigh ? "..." : ""}\`\`\``);
		}
	});
