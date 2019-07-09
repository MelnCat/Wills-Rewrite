const Command = require("../../structs/command.struct");
const { promisify } = require("util");
const { exec } = require("child_process");
const p_exec = promisify(exec);
module.exports = new Command("bash", "Eval bash code.", "{shcode:str}", 4)
	.setFunction(async(client, message, args, strings) => {
		const toExec = args.join(" ");
		if (!toExec) await message.argError();
		return message.channel.send(await client.utils.execBash(toExec), { code: "bash" });
	});
