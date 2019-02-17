const Command = require("../../structs/command.struct");
const { promisify } = require("util");
const { exec } = require("child_process");
const p_exec = promisify(exec);
module.exports = new Command("bash", "Eval bash code.", 4)
	.setFunction(async(client, message, args) => {
		const toExec = args.join(" ");
		if (!toExec) return message.channel.send(client.errors.arguments);
		return message.channel.send(await client.utils.execBash(toExec), { code: "bash" });
	});
