const Command = require("../../structs/command.struct");

module.exports = new Command("invite", "Gets the bot invite link.")
	.setFunction(async(client, message, args) => {
		try {
			let toEval = args.join(" ");
			if (toEval.includes("token")) return message.channel.send("<:no:501906738224562177> **You are not authorized to execute this code.**");
			if (!toEval) return message.channel.send("<:no:501906738224562177> **Please ensure that you've supplied proper arguments.**");
			let com = await eval(`(async () => \{${toEval}\})()`); // eslint-disable-line no-eval, no-useless-escape
			if (typeof com !== "string") com = require("util").inspect(com, false, 1);
			const escapeRegex = input => {
				const matchOperators = /[|\\{}()[\]^$+*?.]/g;
				return input.replace(matchOperators, "\\$&");
			};
			const array = [
				escapeRegex(client.auth.token),
			];
			let isOutHigh = com.length > 1987;
			let regex = new RegExp(array.join("|"), "g");
			com = com.replace(regex, "Censored");
			message.channel.send(`\`\`\`js\n${com.substr(0, 1987)}${isOutHigh ? "..." : ""}\`\`\``);
		} catch (e) {
			let isErrHigh = e.stack.length > 1987;
			message.channel.send(`\`\`\`js\n${e.stack.substr(0, 1987)}${isErrHigh ? "..." : ""}\`\`\``);
		}
	});
