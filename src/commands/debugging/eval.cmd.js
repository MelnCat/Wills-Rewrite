const Command = require("../../structs/command.struct");

module.exports = new Command("eval", "Eval javascript code.")
	.setFunction(async(client, message, args) => {
		try {
			let toEval = args.join(" ");
			if (!toEval) return message.channel.send(client.errors.arguments);
			let com = await eval(`(async () => \{${toEval}\})()`); // eslint-disable-line no-eval, no-useless-escape

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
			let isErrHigh = e.stack.length > 1987;
			await message.channel.send(`\`\`\`js\n${e.stack.substr(0, 1987)}${isErrHigh ? "..." : ""}\`\`\``);
		}
	});
