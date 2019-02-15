const { post } = require("r2");
const Command = require("../../structs/command.struct");

module.exports = new Command("facteval", "Eval javascript code in the fact code.", 4)
	.setFunction(async(client, message, args) => {
		let toEval = args.join(" ");
		if (!toEval) return message.channel.send(client.errors.arguments);
		const res = await post("https://discord-donuts-fact-submitter.glitch.me/eval", { json: { code: toEval } });
		const ERR = /(?<=<pre>).+?(?=<br>)/;
		const t = await res.text;
		if (ERR.exec(t)) return message.channel.send(`ERROR\n\`\`\`js\n${ERR.exec(t)[0]}\n\`\`\``);
		return message.channel.send(`\`\`\`js\n${t}\n\`\`\``);
	});
