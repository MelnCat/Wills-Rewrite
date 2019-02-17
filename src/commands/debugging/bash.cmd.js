const Command = require("../../structs/command.struct");
const { promisify } = require("util");
const { exec } = require("child_process");
const p_exec = promisify(exec);
module.exports = new Command("bash", "Eval bash code.", 4)
	.setFunction(async(client, message, args) => {
		const toExec = args.join(" ");
		if (!toExec) return message.channel.send(client.errors.arguments);
		try {
			const res = await p_exec(toExec);
			await message.channel.send(res.stdout || res.stderr, { code: "bash" });
		} catch (err) {
			await message.channel.send(err.stderr, { code: "bash" });
		}
	});
