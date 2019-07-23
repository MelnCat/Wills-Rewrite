const Command = require("../../structs/command.struct");
const { promisify } = require("util");
const { exec } = require("child_process");
const p_exec = promisify(exec);
module.exports = new Command("pull", "Pull changes to the bot.", "", 4)
	.setFunction(async(client, message, args, strings) => {
		const list = ["git add -A", "git commit -m 'Pulling'", "git pull"];
		const res = await Promise.all(list.map(async x => `[${x}]\n${await client.utils.execBash(x)}`));
		await message.channel.send(res.join("\n"), { code: "ini" });
	});
