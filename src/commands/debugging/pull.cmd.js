const Command = require("../../structs/command.struct");
const { promisify } = require("util");
const { exec } = require("child_process");
const p_exec = promisify(exec);
module.exports = new Command("pull", "Pull changes to the bot.", "", 4)
	.setFunction(async(client, message, args, strings) => message.channel.send(await client.utils.execBash("git add -A;git commit -m 'Pulling';git pull"), { code: "bash" }));
