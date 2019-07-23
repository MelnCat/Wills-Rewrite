const Command = require("../../structs/command.struct");
const { promisify } = require("util");
const { exec } = require("child_process");
const p_exec = promisify(exec);
module.exports = new Command("pull", "Pull changes to the bot.", "", 4)
	.setFunction(async(client, message, args, strings) => {
		const list = ["git add - A", "git commit - m 'Pulling'", "git pull"];
		const res = Promise.all(list.map(x => client.utils.execBash(x)));
		await message.channel.send(res.join("\n\n"), { code: "bash" });
	});
